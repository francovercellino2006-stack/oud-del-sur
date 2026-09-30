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

async function buscarFragranticaUrl(nombre, marca) {
  // Intentar con variaciones progresivamente más cortas
  const variaciones = [
    `${nombre} ${marca}`,
    nombre,
    nombre.split(" ").slice(0, 2).join(" "), // primeras 2 palabras
    nombre.split(" ")[0],                     // primera palabra
  ].filter((v, i, arr) => arr.indexOf(v) === i); // sin duplicados

  for (const variante of variaciones) {
    const query = `site:fragrantica.com ${variante} perfume`;
    const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&kl=es-es`, { headers: HEADERS });
    const html = await res.text();
    const matches = [...html.matchAll(/https?:\/\/www\.fragrantica\.com\/perfume\/[^"&\s>]+/g)];
    if (matches.length === 0) continue;
    const nameSlug = variante.toLowerCase().replace(/\s+/g, "-");
    const best = matches.find(m => m[0].toLowerCase().includes(nameSlug)) ?? matches[0];
    return best[0].split("&")[0];
  }
  return null;
}

async function scrapFragrantica(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Fragrantica respondió ${res.status}`);
  const html = await res.text();
  const data = {};

  const nameMatch = html.match(/<h1[^>]*itemprop="name"[^>]*>([^<]+)<\/h1>/i)
    ?? html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  data.name = nameMatch?.[1]?.trim();

  const descMatch = html.match(/<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/i);
  if (descMatch) {
    data.description = descMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 400);
  }

  const titleLower = (html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "").toLowerCase();
  const genderText = html.match(/for\s+(men|women|unisex)/i)?.[1]?.toLowerCase()
    ?? (titleLower.includes("for men") ? "men" : titleLower.includes("for women") ? "women" : "unisex");
  data.category = genderText === "men" ? "hombre" : genderText === "women" ? "mujer" : "unisex";

  const accordMatches = [...html.matchAll(/class="[^"]*accord-box[^"]*"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/gi)];
  const accords = accordMatches.map(m => m[1].trim().toLowerCase()).filter(Boolean);
  if (accords.length > 0) {
    data.family  = acordToFamily(accords);
    data.accords = accords.slice(0, 5);
  }

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
  } else {
    console.log("⚠️   No encontrado en Fragrantica — buscando imagen en internet...");
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
  console.log(`  Categoría:   ${datos.category ?? "(no encontrado)"}`);
  console.log(`  Familia:     ${datos.family ?? "(no encontrado)"}`);
  if (datos.accords?.length) console.log(`  Acordes:     ${datos.accords.join(", ")}`);
  if (datos.description) console.log(`  Descripción: ${datos.description.slice(0, 80)}...`);
  console.log(`  Imagen:      ${datos.imageUrl ? "✅ encontrada" : "❌ no encontrada"}`);

  const primero = await ask("¿Poner este perfume primero en el catálogo? [s/N]: ");
  const ok = await ask("¿Guardar datos? [s/N]: ");
  if (!ok.toLowerCase().startsWith("s")) { console.log("Cancelado."); return false; }

  const patch = {};
  if (datos.category) patch.category = datos.category;
  if (datos.family && FAMILIES_VALID.includes(datos.family)) patch.family = datos.family;
  if (datos.description) patch.description = datos.description;

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

  console.log("\n⬆️   Creando perfume en Sanity...");
  const created = await client.create(doc);
  console.log(`✅  Perfume creado con ID: ${created._id}`);

  // Buscar datos en Fragrantica
  await buscarYGuardar(nombre, marca, created._id);
}

async function main() {
  console.log("\n🔍  Cargando perfumes...");
  const perfumes = await client.fetch(
    `*[_type == "perfume"] | order(name asc) { _id, name, brand, image, family, category }`
  );

  console.log("\n══════════════════════════════════════════");
  console.log("📋  PERFUMES:");
  console.log("══════════════════════════════════════════");
  console.log(`    0.      ➕  Crear perfume nuevo`);
  perfumes.forEach((p, i) => {
    const img = p.image ? "🖼️ " : "   ";
    const fam = p.family && p.category ? "✅" : "❌";
    console.log(`  ${String(i + 1).padStart(3)}.  ${img}  ${fam}  ${p.name}  —  ${p.brand}`);
  });
  console.log("\n🖼️ = imagen   ✅ = datos completos\n");

  const input = (await ask("Número o nombre: ")).trim();

  if (input === "0") {
    await crearPerfume();
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
