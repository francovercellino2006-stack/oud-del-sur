/**
 * Agrega o completa perfumes en Sanity usando datos de Fragrantica.
 *
 * USO:
 *   node scripts/upload-images.mjs
 *
 * - Elegís un perfume existente para completarle los datos
 * - O escribís "0" para crear uno nuevo desde cero
 */

import { createClient } from "@sanity/client";
import { createInterface } from "readline";
import { createWriteStream, createReadStream, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { pipeline } from "stream/promises";
import { spawn } from "child_process";

const PROJECT_ID = "mbd1smgb";
const DATASET    = "production";
const TOKEN      = "skrVODsYlAdDv5WKNebAAyTvju3CEittxoUWqeizjdIJEZklhFpwS5S008nAKM3J5qB7df6WqXirjErsZGHlVJkatYzWiVdSYzdPUW2zARAIdzN6WMXk6cqDjTckm9bv3vjugxLX9HDoDRCnDuQPpmvQTb5MBHUanrVXMjUxQdFhLiLK83SY";

const BRANDS_VALID   = ["Lattafa", "Armaf", "Afnan", "Maison Alhambra", "Rasasi", "Al Wataniah", "French Avenue"];
const FAMILIES_VALID = ["dulces", "frescos", "orientales", "maderosos", "florales", "aromaticas", "aromaticas acuaticas"];

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: "2024-01-01", useCdn: false });
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

const ACCORD_MAP = [
  { keywords: ["aquatic", "marine", "ozonic", "sea"],                          family: "aromaticas acuaticas" },
  { keywords: ["aromatic", "herbal", "lavender", "fougere"],                   family: "aromaticas" },
  { keywords: ["floral", "rose", "jasmine", "iris", "lily"],                   family: "florales" },
  { keywords: ["woody", "oud", "sandalwood", "cedar", "vetiver", "patchouli"], family: "maderosos" },
  { keywords: ["oriental", "amber", "balsamic", "incense", "spicy", "musky"],  family: "orientales" },
  { keywords: ["sweet", "vanilla", "gourmand", "caramel", "fruity", "powdery"],family: "dulces" },
  { keywords: ["fresh", "citrus", "green", "lemon", "bergamot"],               family: "frescos" },
];

function acordToFamily(accords) {
  const joined = accords.join(" ").toLowerCase();
  for (const { keywords, family } of ACCORD_MAP) {
    if (keywords.some(k => joined.includes(k))) return family;
  }
  return null;
}

function toSlug(str) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Convierte un string al formato slug de Fragrantica (Primera-Letra-Mayuscula)
function toFragranticaSlug(str) {
  return str
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

async function probarUrlFragrantica(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
    // Fragrantica devuelve 200 incluso para páginas de búsqueda, verificar que sea una página de perfume
    if (!res.ok) return false;
    const html = await res.text();
    return html.includes('itemprop="name"') || html.includes("accord-box");
  } catch { return false; }
}

async function buscarFragranticaUrl(nombre, marca) {
  // 1. Intentar construir la URL directamente (lo más confiable)
  const marcaSlug  = toFragranticaSlug(marca);
  const nombreSlug = toFragranticaSlug(nombre);
  const urlDirecta = `https://www.fragrantica.com/perfume/${marcaSlug}/${nombreSlug}.html`;
  if (await probarUrlFragrantica(urlDirecta)) return urlDirecta;

  // 2. Intentar variaciones del nombre (sin palabras cortas, con primeras palabras)
  const palabras = nombre.trim().split(/\s+/);
  const variantes = [
    palabras.slice(0, 3).join(" "),
    palabras.slice(0, 2).join(" "),
    palabras[0],
  ].filter((v, i, arr) => v !== nombre && arr.indexOf(v) === i);

  for (const variante of variantes) {
    const url = `https://www.fragrantica.com/perfume/${marcaSlug}/${toFragranticaSlug(variante)}.html`;
    if (await probarUrlFragrantica(url)) return url;
  }

  // 3. Fallback: buscar en Fragrantica directamente por su buscador
  try {
    const searchRes = await fetch(
      `https://www.fragrantica.com/search/?query=${encodeURIComponent(nombre)}`,
      { headers: HEADERS }
    );
    const searchHtml = await searchRes.text();
    const matches = [...searchHtml.matchAll(/href="(\/perfume\/[^"]+\.html)"/g)];
    if (matches.length > 0) {
      const nameSlug = toFragranticaSlug(nombre).toLowerCase();
      const best = matches.find(m => m[1].toLowerCase().includes(nameSlug)) ?? matches[0];
      return `https://www.fragrantica.com${best[1]}`;
    }
  } catch {}

  return null;
}

const LONGEVITY_MAP = {
  "weak":               "2-4 hs",
  "moderate":           "4-6 hs",
  "long lasting":       "6-10 hs",
  "very long lasting":  "10+ hs",
  "eternal":            "12+ hs",
};

async function scrapFragrantica(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Fragrantica respondió ${res.status}`);
  const html = await res.text();
  const data = {};

  // Nombre
  const nameMatch = html.match(/<h1[^>]*itemprop="name"[^>]*>([^<]+)<\/h1>/i)
    ?? html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  data.name = nameMatch?.[1]?.trim();

  // Descripción (itemprop o primer párrafo largo)
  const descMatch = html.match(/<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/i)
    ?? html.match(/<p[^>]*>([\s\S]{80,}?)<\/p>/i);
  if (descMatch) {
    data.description = descMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 400);
  }

  // Género
  const titleLower = (html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "").toLowerCase();
  const genderText = html.match(/for\s+(men|women|unisex)/i)?.[1]?.toLowerCase()
    ?? (titleLower.includes("for men") ? "men" : titleLower.includes("for women") ? "women" : "unisex");
  data.category = genderText === "men" ? "hombre" : genderText === "women" ? "mujer" : "unisex";

  // Familia (acordes principales)
  const accordMatches = [...html.matchAll(/class="[^"]*accord-box[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi)];
  const accords = accordMatches.map(m => m[1].trim().toLowerCase()).filter(Boolean);
  if (accords.length > 0) {
    data.family  = acordToFamily(accords);
    data.accords = accords.slice(0, 5);
  }

  // Duración (longevity — buscar la categoría con más votos)
  const longevitySection = html.match(/longevity[\s\S]{0,2000}?vote-button-name[\s\S]{0,500}/i)?.[0] ?? html;
  for (const [key, value] of Object.entries(LONGEVITY_MAP)) {
    if (longevitySection.toLowerCase().includes(key)) {
      data.duration = value;
      break;
    }
  }

  // Notas olfativas (top, heart, base)
  const noteMatches = [...html.matchAll(/class="[^"]*note-name[^"]*"[^>]*>([^<]+)<\/span>/gi)];
  const notes = noteMatches.map(m => m[1].trim()).filter(Boolean);
  if (notes.length > 0) data.notes = notes.slice(0, 8).join(", ");

  // Imagen
  const imgMatch = html.match(/src="(https:\/\/fimgs\.net\/[^"]+\.jpg)"/i)
    ?? html.match(/content="(https:\/\/fimgs\.net\/[^"]+)"/i);
  data.imageUrl = imgMatch?.[1];

  return data;
}

async function descargarImagen(url) {
  const ext = url.split("?")[0].match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? "jpg";
  const tmpPath = join(tmpdir(), `perfume-${Date.now()}.${ext}`);
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await pipeline(res.body, createWriteStream(tmpPath));
  return tmpPath;
}

async function subirImagen(imageUrl, nombre) {
  const tmpPath = await descargarImagen(imageUrl);
  const asset = await client.assets.upload("image", createReadStream(tmpPath), { filename: `${nombre}.jpg` });
  try { unlinkSync(tmpPath); } catch {}
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// Dominios confiables para imágenes de perfumes (fotos reales del producto)
const TRUSTED_DOMAINS = [
  "fimgs.net",           // Fragrantica CDN
  "fragrantica.com",
  "lattafaperfumes.com",
  "lattafa.ae",
  "armafperfumes.com",
  "afnanperfumes.com",
  "rasasi.com",
  "alwataniah.com",
  "parfumo.com",
  "notino.com",
  "parfum.com",
  "scentbird.com",
  "beautyhabit.com",
  "theperfumeshop.com",
];

// Extrae datos de perfume scrapeando Notino
async function scrapNotino(nombre, marca) {
  const query = `${nombre} ${marca} perfume site:notino.es OR site:notino.com.ar`;
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&kl=es-es`, { headers: HEADERS });
  const html = await res.text();
  const urlMatch = html.match(/https?:\/\/www\.notino\.[^"&\s>]+perfume[^"&\s>]+/i)
    ?? html.match(/https?:\/\/www\.notino\.[^"&\s>]+/i);
  if (!urlMatch) return null;

  const pRes = await fetch(urlMatch[0], { headers: HEADERS });
  if (!pRes.ok) return null;
  const pHtml = await pRes.text();
  const data = {};

  // Género
  const genderMatch = pHtml.match(/para\s+(hombres|mujeres|unisex)/i)
    ?? pHtml.match(/(men's|women's|unisex)/i);
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    data.category = g.includes("hombr") || g === "men's" ? "hombre"
      : g.includes("mujer") || g === "women's" ? "mujer" : "unisex";
  }

  // Descripción
  const descMatch = pHtml.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]{50,500}?)<\/div>/i);
  if (descMatch) data.description = descMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 400);

  return Object.keys(data).length > 0 ? data : null;
}

// Extrae datos de los snippets de búsqueda de DuckDuckGo (sin entrar a ningún sitio)
async function buscarDatosDDG(nombre, marca) {
  const query = `${nombre} ${marca} perfume for men women unisex fragrance family notes`;
  const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&kl=es-es`, { headers: HEADERS });
  const html = await res.text();
  const data = {};

  // Extraer todos los snippets de texto de los resultados
  const snippets = [...html.matchAll(/<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, " ").toLowerCase())
    .join(" ");

  // Género
  if (/\bfor men\b/.test(snippets))        data.category = "hombre";
  else if (/\bfor women\b/.test(snippets)) data.category = "mujer";
  else if (/\bunisex\b/.test(snippets))    data.category = "unisex";

  // Familia desde acordes mencionados en snippets
  const familiaDetectada = acordToFamily(snippets.split(/\W+/));
  if (familiaDetectada) data.family = familiaDetectada;

  // Duración
  if (/very long lasting/i.test(snippets))  data.duration = "10+ hs";
  else if (/long lasting/i.test(snippets))  data.duration = "6-10 hs";
  else if (/moderate/i.test(snippets))      data.duration = "4-6 hs";

  return Object.keys(data).length > 0 ? data : null;
}

// Solo devuelve imagen si es de una fuente confiable
async function buscarImagenConfiable(query) {
  const homeRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, { headers: HEADERS });
  const homeHtml = await homeRes.text();
  const vqdMatch = homeHtml.match(/vqd=['"]([^'"]+)['"]/);
  if (!vqdMatch) return null;
  const vqd = vqdMatch[1];
  const searchUrl = `https://duckduckgo.com/i.js?l=es-es&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`;
  const imgRes = await fetch(searchUrl, { headers: { ...HEADERS, Referer: "https://duckduckgo.com/" } });
  const data = await imgRes.json();
  if (!data.results?.length) return null;

  // Filtrar solo imágenes de dominios confiables
  const confiables = data.results.filter(r =>
    TRUSTED_DOMAINS.some(d => (r.url ?? "").toLowerCase().includes(d))
  );

  if (confiables.length === 0) return null; // No encontró nada confiable — mejor no subir nada
  return confiables[0].image;
}

async function buscarYGuardar(nombre, marca, perfumeId) {
  console.log(`\n🌐  Buscando "${nombre}" en Fragrantica...`);
  let fragUrl = await buscarFragranticaUrl(nombre, marca) ?? await buscarFragranticaUrl(nombre, "");

  let datos = {};

  if (fragUrl) {
    console.log(`📄  ${fragUrl}`);
    console.log("🔎  Leyendo datos...");
    try { datos = await scrapFragrantica(fragUrl); }
    catch (e) { console.warn(`⚠️   Error leyendo Fragrantica: ${e.message}`); }
  }

  // Si Fragrantica bloqueó, intentar otras fuentes automáticamente
  if (!datos.category || !datos.family) {
    console.log("🔄  Intentando Notino y búsqueda web...");
    try {
      const notinoData = await scrapNotino(nombre, marca);
      if (notinoData) {
        datos = { ...datos, ...notinoData };
        console.log("✅  Datos obtenidos de Notino.");
      }
    } catch {}

    if (!datos.category || !datos.family) {
      try {
        const ddgData = await buscarDatosDDG(nombre, marca);
        if (ddgData) {
          datos = { ...datos, ...ddgData };
          console.log("✅  Datos obtenidos de búsqueda web.");
        }
      } catch {}
    }
  }

  // Si sigue sin datos, pedir URL manual
  if (!datos.category && !datos.imageUrl) {
    console.log("⚠️   No se encontraron datos automáticamente.");
    console.log(`     Buscá en: https://www.fragrantica.com/search/?query=${encodeURIComponent(nombre)}`);
    const urlManual = (await ask("   Pegá la URL del perfume (o Enter para saltar): ")).trim();
    if (urlManual.startsWith("http")) {
      console.log("🔎  Leyendo datos...");
      try { const d = await scrapFragrantica(urlManual); datos = { ...datos, ...d }; }
      catch (e) { console.warn(`⚠️   Error: ${e.message}`); }
    }
  }

  // Fallback imagen: si Fragrantica no la dio, buscar en fuentes confiables
  if (!datos.imageUrl) {
    try {
      datos.imageUrl = await buscarImagenConfiable(`${nombre} ${marca} perfume bottle`);
    } catch {}
  }

  console.log("\n══════════════════════════════════════════");
  console.log("📊  DATOS ENCONTRADOS:");
  console.log("══════════════════════════════════════════");
  console.log(`  Categoría:   ${datos.category ?? "❌ no encontrado"}`);
  console.log(`  Familia:     ${datos.family ?? "❌ no encontrado"}`);
  console.log(`  Duración:    ${datos.duration ?? "❌ no encontrado"}`);
  if (datos.accords?.length) console.log(`  Acordes:     ${datos.accords.join(", ")}`);
  if (datos.notes)       console.log(`  Notas:       ${datos.notes}`);
  if (datos.description) console.log(`  Descripción: ${datos.description.slice(0, 100)}...`);
  console.log(`  Imagen:      ${datos.imageUrl ? "✅ encontrada" : "❌ no encontrada"}`);

  // Completar a mano los datos que faltan
  if (!datos.category) {
    console.log("\n  Categorías: 1) hombre  2) mujer  3) unisex");
    const c = (await ask("  Categoría (número o texto, Enter para saltar): ")).trim();
    if (c === "1") datos.category = "hombre";
    else if (c === "2") datos.category = "mujer";
    else if (c === "3") datos.category = "unisex";
    else if (["hombre","mujer","unisex"].includes(c)) datos.category = c;
  }

  if (!datos.family) {
    console.log("\n  Familias: 1) dulces  2) frescos  3) orientales  4) maderosos  5) florales  6) aromaticas  7) aromaticas acuaticas");
    const f = (await ask("  Familia (número o texto, Enter para saltar): ")).trim();
    const familias = ["dulces","frescos","orientales","maderosos","florales","aromaticas","aromaticas acuaticas"];
    const fn = parseInt(f);
    if (!isNaN(fn) && fn >= 1 && fn <= familias.length) datos.family = familias[fn - 1];
    else if (familias.includes(f)) datos.family = f;
  }

  if (!datos.duration) {
    const d = (await ask("  Duración (ej: 6-10 hs, Enter para saltar): ")).trim();
    if (d) datos.duration = d;
  }

  const primero = await ask("\n¿Poner este perfume primero en el catálogo? [s/N]: ");
  const ok = await ask("¿Guardar datos? [s/N]: ");
  if (!ok.toLowerCase().startsWith("s")) { console.log("Cancelado."); return false; }

  const patch = {};
  if (datos.category)  patch.category    = datos.category;
  if (datos.family && FAMILIES_VALID.includes(datos.family)) patch.family = datos.family;
  if (datos.description) patch.description = datos.description;
  if (datos.duration)  patch.duration    = datos.duration;

  if (primero.toLowerCase().startsWith("s")) {
    // Traer el order más bajo actual y restar 1
    const minOrder = await client.fetch(`*[_type == "perfume"] | order(order asc)[0].order`);
    patch.order = (minOrder ?? 1) - 1;
    console.log(`📌  Orden: ${patch.order} (primero en catálogo)`);
  }

  if (datos.imageUrl) {
    console.log("\n⬇️   Descargando imagen...");
    try {
      patch.image = await subirImagen(datos.imageUrl, nombre);
      console.log("✅  Imagen subida.");
    } catch (e) { console.warn(`⚠️   Sin imagen: ${e.message}`); }
  }

  if (Object.keys(patch).length === 0) {
    console.log("⚠️   Sin datos nuevos."); return true;
  }

  await client.patch(perfumeId).set(patch).commit();
  console.log(`\n🎉  ¡Guardado! (${Object.keys(patch).join(", ")})`);
  return true;
}

async function crearPerfume() {
  console.log("\n── CREAR PERFUME NUEVO ──────────────────");
  const nombre = (await ask("Nombre del perfume: ")).trim();
  if (!nombre) return;

  // Mostrar marcas
  BRANDS_VALID.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
  const marcaInput = await ask("Marca (número o nombre): ");
  const num = parseInt(marcaInput);
  const marca = !isNaN(num) && num >= 1 && num <= BRANDS_VALID.length
    ? BRANDS_VALID[num - 1]
    : marcaInput.trim();

  const precio = await ask("Precio (ej: $74.000): ");
  const ml = parseInt(await ask("ML (ej: 100): ") || "0");

  // Crear documento base en Sanity
  const slug = toSlug(nombre);
  const doc = {
    _type: "perfume",
    name: nombre,
    brand: marca,
    price: precio,
    ml: ml || undefined,
    slug: { _type: "slug", current: slug },
    outOfStock: false,
    isDecant: false,
  };

  // Verificar si ya existe un perfume con el mismo slug o nombre
  const existente = await client.fetch(
    `*[_type == "perfume" && (slug.current == $slug || lower(name) == $nameLower)][0]{ _id, name }`,
    { slug, nameLower: nombre.toLowerCase() }
  );
  if (existente) {
    console.log(`⚠️   Ya existe "${existente.name}" en Sanity (ID: ${existente._id}).`);
    const usar = (await ask("   ¿Actualizar ese perfume en vez de crear uno nuevo? [s/N]: ")).trim();
    if (usar.toLowerCase().startsWith("s")) {
      await buscarYGuardar(nombre, marca, existente._id);
      return;
    }
    console.log("   Creando de todas formas con slug alternativo...");
    doc.slug = { _type: "slug", current: `${slug}-2` };
  }

  console.log("\n⬆️   Creando perfume en Sanity...");
  const created = await client.create(doc);
  console.log(`✅  Perfume creado con ID: ${created._id}`);

  // Buscar datos en Fragrantica
  await buscarYGuardar(nombre, marca, created._id);
}

async function autoOrdenar() {
  console.log("\n📐  Auto-ordenando todos los perfumes alfabéticamente...");
  // Solo documentos publicados (sin drafts)
  const todos = await client.fetch(
    `*[_type == "perfume" && !(_id in path("drafts.**"))] | order(name asc) { _id, name }`
  );
  const transaction = client.transaction();
  todos.forEach((p, i) => {
    transaction.patch(p._id, patch => patch.set({ order: (i + 1) * 10 }));
  });
  await transaction.commit();
  console.log(`✅  ${todos.length} perfumes ordenados. Los del mismo nombre quedan juntos.`);
}

async function main() {
  console.log("\n🔍  Cargando perfumes...");
  const perfumes = await client.fetch(
    `*[_type == "perfume" && !(_id in path("drafts.**"))] | order(name asc) { _id, name, brand, image, family, category }`
  );

  console.log("\n══════════════════════════════════════════");
  console.log("📋  PERFUMES:");
  console.log("══════════════════════════════════════════");
  console.log(`    0.      ➕  Crear perfume nuevo`);
  console.log(`   -1.      📐  Auto-ordenar (agrupar Odyssey, Hawas, etc.)`);
  perfumes.forEach((p, i) => {
    const img = p.image ? "🖼️ " : "   ";
    const fam = p.family && p.category ? "✅" : "❌";
    console.log(`  ${String(i + 1).padStart(3)}.  ${img}  ${fam}  ${p.name}  —  ${p.brand}`);
  });
  console.log("\n🖼️ = imagen   ✅ = datos completos\n");

  const input = (await ask("Número o nombre (o \"borrar X\" para eliminar): ")).trim();

  if (input === "-1") {
    await autoOrdenar(perfumes);
  } else if (input === "0") {
    await crearPerfume();
  } else if (input.toLowerCase().startsWith("borrar ")) {
    const query = input.slice(7).trim();
    const num = parseInt(query);
    let perfume;
    if (!isNaN(num) && num >= 1 && num <= perfumes.length) {
      perfume = perfumes[num - 1];
    } else {
      perfume = perfumes.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (!perfume) { console.error(`❌  No encontrado: "${query}"`); rl.close(); return; }

    console.log(`\n⚠️   Vas a eliminar: ${perfume.name} — ${perfume.brand}`);
    const confirmar = await ask("¿Confirmar eliminación? Esto no se puede deshacer. [s/N]: ");
    if (!confirmar.toLowerCase().startsWith("s")) { console.log("Cancelado."); rl.close(); return; }

    await client.delete(perfume._id);
    console.log(`🗑️   "${perfume.name}" eliminado de Sanity.`);
  } else {
    const num = parseInt(input);
    let perfume;
    if (!isNaN(num) && num >= 1 && num <= perfumes.length) {
      perfume = perfumes[num - 1];
    } else {
      perfume = perfumes.find(p => p.name.toLowerCase().includes(input.toLowerCase()));
    }
    if (!perfume) { console.error(`❌  No encontrado: "${input}"`); rl.close(); return; }

    console.log(`\n✅  Seleccionado: ${perfume.name} — ${perfume.brand}`);
    await buscarYGuardar(perfume.name, perfume.brand, perfume._id);
  }

  const otro = await ask("\n¿Continuar con otro? [s/N]: ");
  rl.close();
  if (otro.toLowerCase().startsWith("s")) {
    spawn(process.execPath, [process.argv[1]], { stdio: "inherit" });
  }
}

main().catch(e => { console.error("\n❌ Error:", e.message); rl.close(); process.exit(1); });
