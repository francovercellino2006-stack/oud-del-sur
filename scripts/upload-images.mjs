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

const PROJECT_ID        = "mbd1smgb";
const DATASET           = "production";
const TOKEN             = "skrVODsYlAdDv5WKNebAAyTvju3CEittxoUWqeizjdIJEZklhFpwS5S008nAKM3J5qB7df6WqXirjErsZGHlVJkatYzWiVdSYzdPUW2zARAIdzN6WMXk6cqDjTckm9bv3vjugxLX9HDoDRCnDuQPpmvQTb5MBHUanrVXMjUxQdFhLiLK83SY";
// IA: usá tu clave de Anthropic (console.anthropic.com) mientras tengas suscripción.
// Si no tenés, usá Groq que es GRATIS (console.groq.com → API Keys).
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";
const GROQ_API_KEY      = process.env.GROQ_API_KEY      ?? "";

const BRANDS_VALID   = ["Lattafa", "Armaf", "Afnan", "Maison Alhambra", "Rasasi", "Al Wataniah", "French Avenue"];
const FAMILIES_VALID = ["dulces", "frescos", "orientales", "maderosos", "florales", "aromaticas", "aromaticas acuaticas"];

// Detecta la marca automáticamente según palabras clave del nombre
function detectarMarca(nombre) {
  const n = nombre.toLowerCase();
  if (/hawas|khamrah|shamoos|asad|ejaazi|oud mood|oud for glory|oud mood|emirati/.test(n))  return "Lattafa";
  if (/voyage|sterling|tres nuit|ameer|magic|black onyx|bucephalus|caliber|club de nuit|milestone|precieux/.test(n)) return "Armaf";
  if (/supremacy|modest|1 million|9 pm|blue sapphire|anniversary|rare|wind flower/.test(n)) return "Afnan";
  if (/paris corner|sultan|aldehyde|baroque|crystal|renaissance/.test(n))                    return "Maison Alhambra";
  if (/oudh|rasasi|dakhoon|choco musk|hawas rasasi/.test(n))                                 return "Rasasi";
  if (/odyssey|opulent|qimmah|waha|oud 24 hours/.test(n))                                    return "Al Wataniah";
  return null;
}

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

// Descarta descripciones en árabe u otros idiomas no-latinos
function esDescripcionUtilizable(texto) {
  if (!texto || texto.length < 40) return false;
  const arabicChars = (texto.match(/[؀-ۿ]/g) ?? []).length;
  return arabicChars / texto.length < 0.1; // menos del 10% árabe
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

  // Sin imagen de Fragrantica (solo usamos sus datos de texto)

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
  "parfumo.net",
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

// DuckDuckGo Instant Answers — API gratuita, sin clave, a veces da descripciones de Wikipedia
async function buscarDDGInstant(nombre, marca) {
  try {
    const query = `${nombre} ${marca} perfume`;
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { headers: HEADERS, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = {};

    if (json.AbstractText?.length > 60) data.description = json.AbstractText.slice(0, 400);
    else {
      const topic = json.RelatedTopics?.find(t => t.Text?.length > 60);
      if (topic) data.description = topic.Text.slice(0, 400);
    }

    const text = (json.AbstractText ?? "").toLowerCase();
    if (/\bfor men\b|\bmasculine\b/.test(text))        data.category = "hombre";
    else if (/\bfor women\b|\bfeminine\b/.test(text)) data.category = "mujer";
    else if (/\bunisex\b/.test(text))                 data.category = "unisex";

    const fam = acordToFamily(text.split(/\W+/));
    if (fam) data.family = fam;

    return Object.keys(data).length > 0 ? data : null;
  } catch { return null; }
}

// Intenta obtener descripción directamente del sitio oficial de la marca
async function scrapMarcaOficial(nombre, marca) {
  const sitios = {
    "Lattafa":        `https://lattafaperfumes.com/?s=${encodeURIComponent(nombre)}`,
    "Armaf":          `https://www.armafperfumes.com/?s=${encodeURIComponent(nombre)}`,
    "Afnan":          `https://afnanperfumes.com/?s=${encodeURIComponent(nombre)}`,
    "Rasasi":         `https://rasasi.com/?s=${encodeURIComponent(nombre)}`,
    "Al Wataniah":    `https://alwataniah.com/?s=${encodeURIComponent(nombre)}`,
    "Maison Alhambra":`https://maisonalhambra.com/?s=${encodeURIComponent(nombre)}`,
  };
  const url = sitios[marca];
  if (!url) return null;

  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const html = await res.text();

    // Buscar link al producto en los resultados
    const linkMatch = html.match(/href="(https?:\/\/[^"]*(?:product|perfume|fragrance)[^"]*)"[^>]*>[^<]*(?:${nombre.split(" ")[0]})/i)
      ?? html.match(/href="(https?:\/\/[^"]*(?:product|perfume)[^"]+)"/i);
    if (!linkMatch) return null;

    const prodRes = await fetch(linkMatch[1], { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!prodRes.ok) return null;
    const prodHtml = await prodRes.text();

    const paras = [...prodHtml.matchAll(/<(?:p|div)[^>]*>([\s\S]{80,600}?)<\/(?:p|div)>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
      .filter(p => p.length > 80 && !p.toLowerCase().includes("cookie") && !p.toLowerCase().includes("©"));

    if (paras.length === 0) return null;
    return { description: paras[0].slice(0, 400) };
  } catch { return null; }
}

// Scraper de Parfumo.net — buena base de datos, menos bloqueos que Fragrantica
async function scrapParfumo(nombre, marca) {
  try {
    const searchRes = await fetch(
      `https://www.parfumo.net/Search/index?search=${encodeURIComponent(`${nombre} ${marca}`)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!searchRes.ok) return null;
    const searchHtml = await searchRes.text();

    const linkMatch = searchHtml.match(/href="(\/Perfumes\/[^"#?]+)"/);
    if (!linkMatch) return null;

    const perfRes = await fetch(`https://www.parfumo.net${linkMatch[1]}`, {
      headers: HEADERS, signal: AbortSignal.timeout(10000)
    });
    if (!perfRes.ok) return null;
    const html = await perfRes.text();
    const data = {};

    // Descripción: primer párrafo largo
    const paras = [...html.matchAll(/<p[^>]*>([\s\S]{80,700}?)<\/p>/gi)]
      .map(m => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
      .filter(p => !p.toLowerCase().includes("cookie") && !p.toLowerCase().includes("javascript"));
    if (paras.length > 0) data.description = paras[0].slice(0, 400);

    const lower = html.toLowerCase();

    // Categoría
    if (/\bfor men\b/.test(lower))        data.category = "hombre";
    else if (/\bfor women\b/.test(lower)) data.category = "mujer";
    else if (/\bunisex\b/.test(lower))    data.category = "unisex";

    // Familia desde acordes
    const accordMatches = [...html.matchAll(/class="[^"]*accord[^"]*"[\s\S]*?<span[^>]*>([^<]{3,30})<\/span>/gi)];
    const accords = accordMatches.map(m => m[1].trim().toLowerCase()).filter(Boolean);
    if (accords.length > 0) data.family = acordToFamily(accords);

    // Duración
    if (/very long lasting/i.test(html))  data.duration = "10+ hs";
    else if (/long.?lasting/i.test(html)) data.duration = "6-10 hs";
    else if (/moderate/i.test(html.slice(0, 5000))) data.duration = "4-6 hs";

    // Imagen: og:image es siempre la foto del frasco, alta calidad
    const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1]
      ?? html.match(/src="(https:\/\/[^"]*parfumo\.net\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1];
    if (ogImg) data.imageUrl = ogImg;

    return Object.keys(data).length > 0 ? data : null;
  } catch { return null; }
}

// Busca en DuckDuckGo Lite y visita las primeras páginas para extraer datos reales
async function buscarDatosEnPaginas(nombre, marca) {
  try {
    const query = `${nombre} ${marca} perfume fragrance`;
    const ddgRes = await fetch(
      `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!ddgRes.ok) return null;
    const ddgHtml = await ddgRes.text();

    // Extraer URLs de resultados (DDG Lite las pone en href con posible redirect)
    const rawUrls = [...ddgHtml.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
      .map(m => {
        const u = m[1];
        // Decodificar redirect de DDG: //duckduckgo.com/l/?uddg=ENCODED
        if (u.includes("duckduckgo.com/l/")) {
          try { return new URL(u).searchParams.get("uddg") ?? u; } catch { return u; }
        }
        return u;
      })
      .filter(u => !u.includes("duckduckgo") && !u.includes("google"))
      .slice(0, 5);

    const data = {};

    for (const url of rawUrls) {
      if (data.description && data.category && data.family) break;
      try {
        const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
        if (!res.ok) continue;
        const html = await res.text();
        const lower = html.toLowerCase();

        // Descripción
        if (!data.description) {
          const paras = [...html.matchAll(/<p[^>]*>([\s\S]{80,600}?)<\/p>/gi)]
            .map(m => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
            .filter(p => !p.toLowerCase().includes("cookie") && !p.toLowerCase().includes("javascript") && p.length > 80);
          const primeraPalabra = nombre.split(" ")[0].toLowerCase();
          const relevante = paras.find(p => p.toLowerCase().includes(primeraPalabra)) ?? paras[0];
          if (relevante) data.description = relevante.slice(0, 400);
        }

        // Categoría
        if (!data.category) {
          if (/\bfor men\b|\bmasculine\b|\bmen'?s\b/.test(lower))        data.category = "hombre";
          else if (/\bfor women\b|\bfeminine\b|\bwomen'?s\b/.test(lower)) data.category = "mujer";
          else if (/\bunisex\b/.test(lower))                              data.category = "unisex";
        }

        // Familia
        if (!data.family) data.family = acordToFamily(lower.split(/\W+/));

        // Duración
        if (!data.duration) {
          if (/very long lasting/i.test(html))  data.duration = "10+ hs";
          else if (/long.?lasting/i.test(html)) data.duration = "6-10 hs";
          else if (/moderate longevity/i.test(html)) data.duration = "4-6 hs";
        }

        // Imagen: og:image de dominios confiables (siempre foto principal de producto)
        if (!data.imageUrl && TRUSTED_DOMAINS.some(d => url.includes(d))) {
          const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
            ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1];
          if (ogImg && esImagenApta(ogImg)) data.imageUrl = ogImg;
        }
      } catch {}
    }

    return Object.keys(data).length > 0 ? data : null;
  } catch { return null; }
}

function buildPromptIA(nombre, marca, datosExistentes) {
  const ya = Object.keys(datosExistentes).filter(k => datosExistentes[k]).join(", ");
  return `Sos un experto en perfumería árabe y de Medio Oriente. Dame información sobre el perfume "${nombre}" de la marca ${marca}.

Respondé SOLO con JSON válido (sin markdown ni explicaciones extra):
{
  "description": "descripción en español de 2-3 oraciones: qué huele, notas principales, para qué ocasión",
  "category": "hombre" o "mujer" o "unisex",
  "family": uno de: "dulces", "frescos", "orientales", "maderosos", "florales", "aromaticas", "aromaticas acuaticas",
  "duration": uno de: "2-4 hs", "4-6 hs", "6-10 hs", "10+ hs"
}
${ya ? `\nYa tenés: ${ya}. Completá igualmente todos los campos.` : ""}
Si no conocés el perfume, inferí datos razonables basándote en la marca y el nombre.`;
}

const FAMILY_NORMALIZE = {
  "floral": "florales", "florals": "florales", "flower": "florales",
  "sweet": "dulces", "gourmand": "dulces", "dulce": "dulces",
  "fresh": "frescos", "fresco": "frescos", "citrus": "frescos",
  "oriental": "orientales",
  "woody": "maderosos", "wood": "maderosos", "madera": "maderosos", "maderoso": "maderosos",
  "aromatic": "aromaticas", "aromatica": "aromaticas", "herbal": "aromaticas",
  "aquatic": "aromaticas acuaticas", "marine": "aromaticas acuaticas", "acuatica": "aromaticas acuaticas",
};
const CATEGORY_NORMALIZE = {
  "women": "mujer", "woman": "mujer", "female": "mujer", "femenino": "mujer", "femenina": "mujer",
  "men": "hombre", "man": "hombre", "male": "hombre", "masculino": "hombre",
};

function parseIAResponse(text) {
  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]+\}/)?.[0] ?? text);

    // Normalizar family: acepta inglés y variantes en español
    if (parsed.family) {
      const f = parsed.family.toLowerCase().trim();
      parsed.family = FAMILY_NORMALIZE[f] ?? (FAMILIES_VALID.includes(f) ? f : null);
      if (!parsed.family) delete parsed.family;
    }
    // Normalizar category
    if (parsed.category) {
      const c = parsed.category.toLowerCase().trim();
      parsed.category = CATEGORY_NORMALIZE[c] ?? (["hombre","mujer","unisex"].includes(c) ? c : null);
      if (!parsed.category) delete parsed.category;
    }
    // Normalizar duration: "6-10 hours" → "6-10 hs"
    if (parsed.duration) {
      const d = parsed.duration.replace(/hours?|horas?/i, "hs").replace(/\s+/g, " ").trim();
      parsed.duration = d.match(/\d+\+?\s*hs|\d+-\d+\s*hs/i)?.[0] ?? parsed.duration;
    }

    return Object.keys(parsed).length > 0 ? parsed : null;
  } catch { return null; }
}

// Usa IA para generar datos: Claude primero (si tenés suscripción), Groq como fallback (gratis)
async function buscarConIA(nombre, marca, datosExistentes = {}) {
  const prompt = buildPromptIA(nombre, marca, datosExistentes);

  // 1. Claude (Haiku — el más barato y rápido)
  if (ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 400,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const json = await res.json();
        const result = parseIAResponse(json.content?.[0]?.text ?? "");
        if (result) return result;
      } else {
        const errBody = await res.text().catch(() => "");
        process.stdout.write(` [Claude error ${res.status}: ${errBody.slice(0, 80)}] `);
      }
    } catch (e) { process.stdout.write(` [Claude excepción: ${e.message}] `); }
  }

  // 2. Groq (gratis — fallback cuando no hay suscripción de Claude)
  if (GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          max_tokens: 400,
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const json = await res.json();
        return parseIAResponse(json.choices?.[0]?.message?.content ?? "");
      } else {
        const errBody = await res.text().catch(() => "");
        process.stdout.write(` [Groq error ${res.status}: ${errBody.slice(0, 80)}] `);
      }
    } catch (e) { process.stdout.write(` [Groq excepción: ${e.message}] `); }
  }

  return null;
}

// Extrae la imagen del producto de una página: og:image, JSON-LD, o img de producto
async function ogImage(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const html = await res.text();

    // 1. og:image (lo más común)
    const og = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1];
    if (og) return og;

    // 2. JSON-LD structured data (e-commerce estándar)
    for (const script of [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]) {
      try {
        const d = JSON.parse(script[1]);
        const img = d.image ?? d.image?.[0] ?? d.offers?.image ?? d.logo?.url;
        if (img && typeof img === "string" && img.startsWith("http") && !img.includes("logo")) return img;
      } catch {}
    }

    // 3. Primera imagen grande de producto (src que parezca CDN de producto)
    const cdnImg = html.match(/src="(https?:\/\/[^"]+(?:product|fragrance|perfume)[^"]+\.(?:jpg|jpeg|png|webp))"/i)?.[1];
    if (cdnImg) return cdnImg;

    return null;
  } catch { return null; }
}

// Busca imagen en Notino (retailer profesional)
async function buscarImagenNotino(nombre, marca) {
  const dominios = ["notino.es", "notino.com.ar", "notino.com"];
  for (const dominio of dominios) {
    try {
      const res = await fetch(
        `https://www.${dominio}/search/?query=${encodeURIComponent(`${nombre} ${marca}`)}`,
        { headers: HEADERS, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const html = await res.text();
      // Buscar link al primer producto
      const link = html.match(/href="(https?:\/\/www\.[^"]*notino[^"]+\/p\.[^"]+)"/i)?.[1]
        ?? html.match(/href="(https?:\/\/www\.[^"]*notino[^"]+\/[^"]+\/[^"]+\/)"/i)?.[1];
      if (link) {
        const img = await ogImage(link);
        if (img) return img;
      }
      // Fallback: CDN directo en el HTML de búsqueda
      const cdnImg = html.match(/"(https:\/\/i\.notino\.com\/[^"]+\.(?:jpg|jpeg|webp)[^"]*)"/i)?.[1];
      if (cdnImg) return cdnImg;
    } catch {}
  }
  return null;
}

// Busca imagen en el sitio oficial de la marca usando og:image
async function buscarImagenMarca(nombre, marca) {
  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const URLS = {
    "Lattafa":        [`https://lattafaperfumes.com/${slug}/`, `https://lattafaperfumes.com/?s=${encodeURIComponent(nombre)}`],
    "Armaf":          [`https://www.armafperfumes.com/product/${slug}/`, `https://www.armafperfumes.com/?s=${encodeURIComponent(nombre)}`],
    "Afnan":          [`https://afnanperfumes.com/product/${slug}/`, `https://afnanperfumes.com/?s=${encodeURIComponent(nombre)}`],
    "Maison Alhambra":[`https://maisonalhambra.com/product/${slug}/`, `https://maisonalhambra.com/?s=${encodeURIComponent(nombre)}`],
    "Rasasi":         [`https://rasasi.com/product/${slug}/`, `https://rasasi.com/?s=${encodeURIComponent(nombre)}`],
    "Al Wataniah":    [`https://alwataniah.com/product/${slug}/`, `https://alwataniah.com/?s=${encodeURIComponent(nombre)}`],
  };
  const urls = URLS[marca] ?? [];
  for (const url of urls) {
    const img = await ogImage(url);
    if (img && !img.includes("logo") && !img.includes("banner")) return img;
  }
  return null;
}

// Dominios bloqueados: fotos de baja calidad (vendedores, redes sociales, mercados)
const BLOCKED_DOMAINS = [
  "instagram", "facebook", "twitter", "tiktok", "pinterest",
  "mercadolibre", "mercadolivre", "olx", "ebay", "amazon",
  "aliexpress", "alibaba", "wish", "shopify",
  "blogspot", "wordpress.com", "tumblr",
];

const IMAGEN_MALA_PATTERNS = [
  /set[_-]de[_-]/i, /decant/i, /\bset\b.*\bmujer\b/i, /\bset\b.*\bhombre\b/i,
  /bundle/i, /pack[_-]/i, /combo/i, /cupon/i, /promo/i, /banner/i,
  /logo/i, /icon/i, /placeholder/i,
];

function esImagenApta(url = "") {
  const lower = url.toLowerCase();
  if (BLOCKED_DOMAINS.some(d => lower.includes(d))) return false;
  if (IMAGEN_MALA_PATTERNS.some(p => p.test(lower))) return false;
  return true;
}

async function buscarImagenParfumo(nombre, marca) {
  try {
    const searchRes = await fetch(
      `https://www.parfumo.net/Search/index?search=${encodeURIComponent(`${nombre} ${marca}`)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!searchRes.ok) return null;
    const searchHtml = await searchRes.text();
    const linkMatch = searchHtml.match(/href="(\/Perfumes\/[^"#?]+)"/);
    if (!linkMatch) return null;
    return ogImage(`https://www.parfumo.net${linkMatch[1]}`);
  } catch { return null; }
}

// Fragrancenet — retailer con fotos profesionales para casi todos los perfumes árabes
async function buscarImagenFragrancenet(nombre, marca) {
  const brandSlug   = marca.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const perfumeSlug = nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Variantes del slug — distintos retailers usan "for-her" vs "for-women", etc.
  const slugBase = perfumeSlug.replace(/-?(?:for-her|for-him|for-men|for-women)$/, "");
  const slugWithWomen = perfumeSlug.replace("for-her", "for-women").replace("for-him", "for-men");
  const slugWithHer   = perfumeSlug.replace("for-women", "for-her").replace("for-men", "for-him");
  const slugsToTry = [perfumeSlug, slugWithWomen, slugWithHer, slugBase, `${slugBase}-eau-de-parfum`]
    .filter((s, i, a) => s && a.indexOf(s) === i);

  for (const slug of slugsToTry) {
    const img = await ogImage(`https://www.fragrancenet.com/fragrances/${brandSlug}/${slug}`);
    if (img && esImagenApta(img) && !img.includes("logo")) return img;
  }

  // Fallback: buscar en el sitio
  try {
    const searchRes = await fetch(
      `https://www.fragrancenet.com/search?q=${encodeURIComponent(`${nombre} ${marca}`)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!searchRes.ok) return null;
    const html = await searchRes.text();
    const link = html.match(/href="(\/fragrances\/[^"]+)"/i)?.[1];
    if (!link) return null;
    const img = await ogImage(`https://www.fragrancenet.com${link}`);
    if (img && esImagenApta(img) && !img.includes("logo")) return img;
  } catch {}
  return null;
}

// Busca en DDG de texto, visita los primeros resultados aptos y extrae og:image
async function buscarImagenViaDDGTexto(nombre, marca) {
  const SKIP_DOMAINS = [
    "duckduckgo", "google", "youtube", "instagram", "facebook",
    "twitter", "tiktok", "pinterest", "mercadolibre", "ebay",
    "aliexpress", "amazon", "blogspot", "wordpress.com", "reddit",
  ];
  // Retailers con fotos limpias de producto — priorizamos si aparecen
  const GOOD_DOMAINS = [
    "fragrancenet.com", "notino.", "scentbird.com",
    "theperfumeshop.com", "fragrancedirect.co.uk", "parfumo.",
    "lattafaperfumes.com", "armafperfumes.com", "rasasi.com",
    "afnanperfumes.com", "alwataniah.com",
  ];
  try {
    const query = `"${nombre}" ${marca} perfume buy`;
    const res = await fetch(
      `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const html = await res.text();

    const allUrls = [...html.matchAll(/href="(https?:\/\/[^"]+)"/gi)]
      .map(m => {
        const u = m[1];
        if (u.includes("duckduckgo.com/l/")) {
          try { return decodeURIComponent(new URL(u).searchParams.get("uddg") ?? u); } catch { return u; }
        }
        return u;
      })
      .filter(u => !SKIP_DOMAINS.some(d => u.includes(d)));

    // Priorizar URLs de dominios conocidos por tener fotos limpias
    const sorted = [
      ...allUrls.filter(u => GOOD_DOMAINS.some(d => u.includes(d))),
      ...allUrls.filter(u => !GOOD_DOMAINS.some(d => u.includes(d))),
    ].slice(0, 6);

    for (const url of sorted) {
      const img = await ogImage(url);
      if (img && esImagenApta(img) && !img.includes("logo") && !img.includes("banner")) return img;
    }
  } catch {}
  return null;
}

// Extrae la primera imagen de producto de una página de búsqueda de WooCommerce/WordPress
async function extractProductImgFromSearch(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const html = await res.text();
    // WooCommerce product thumbnails — siempre son fotos del frasco
    const patterns = [
      /class="[^"]*(?:wp-post-image|woocommerce-placeholder|attachment-woocommerce)[^"]*"[^>]+src="([^"]+)"/i,
      /class="[^"]*product[^"]*"[^>]*>[\s\S]{0,200}?<img[^>]+src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/i,
      /<img[^>]+src="(https?:\/\/[^"]+wp-content\/uploads\/[^"]+\.(?:jpg|jpeg|png|webp))"/i,
    ];
    for (const p of patterns) {
      const m = html.match(p);
      if (m?.[1] && esImagenApta(m[1])) return m[1];
    }
    // og:image como fallback
    return html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      ?? html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1]
      ?? null;
  } catch { return null; }
}

// Sitio oficial de la marca — busca en la página de búsqueda (server-side rendered)
async function buscarImagenMarcaOficial(nombre, marca) {
  const q = encodeURIComponent(nombre);
  const SEARCH_URLS = {
    "Lattafa":        `https://lattafaperfumes.com/?s=${q}`,
    "Rasasi":         `https://rasasi.com/?s=${q}`,
    "Afnan":          `https://afnanperfumes.com/?s=${q}`,
    "Armaf":          `https://www.armafperfumes.com/?s=${q}`,
    "Al Wataniah":    `https://alwataniah.com/?s=${q}`,
    "Maison Alhambra":`https://maisonalhambra.com/?s=${q}`,
  };
  const url = SEARCH_URLS[marca];
  if (!url) return null;
  return extractProductImgFromSearch(url);
}

// Dominios confiables para imágenes de perfumes
const DOMINIOS_PERFUME = [
  "amazon", "walmart", "sephora", "macys", "nordstrom", "target",
  "notino", "fragrancenet", "fragrancex", "scentbird", "parfumo",
  "lattafa", "rasasi", "armaf", "afnan", "maison", "wataniah",
  "lujoperfume", "oud", "perfume", "fragrance", "parfum", "scent", "aroma",
  "aliexpress", "alhambra",
];
function esDominioConfiable(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return DOMINIOS_PERFUME.some(d => host.includes(d));
  } catch { return false; }
}

// lujoperfume.com — tienda argentina que tiene todas las marcas árabes + og:image confiable
async function buscarImagenLujo(nombre) {
  try {
    const res = await fetch(
      `https://lujoperfume.com/?s=${encodeURIComponent(nombre)}`,
      { headers: HEADERS, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const html = await res.text();
    // Extraer todos los links de producto y elegir el que más coincida con el nombre buscado
    const links = [...html.matchAll(/href="(https:\/\/lujoperfume\.com\/producto\/[^"]+)"/gi)]
      .map(m => m[1]);
    if (links.length === 0) return null;
    // El slug del nombre buscado para comparar (ej: "khamrah-waha")
    const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const palabras = slug.split("-").filter(p => p.length > 2);
    // Preferir el link cuyo slug contenga más palabras del nombre buscado
    const ranked = links.map(u => {
      const urlSlug = u.split("/producto/")[1] ?? "";
      const hits = palabras.filter(p => urlSlug.includes(p)).length;
      return { u, hits };
    }).sort((a, b) => b.hits - a.hits);
    // Exigir que TODAS las palabras del nombre estén en el slug (evita Khamrah vs Khamrah Waha)
    if (ranked[0].hits < palabras.length) return null;
    const link = ranked[0].u;
    const pRes = await fetch(link, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!pRes.ok) return null;
    const pHtml = await pRes.text();
    const og = pHtml.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
      ?? pHtml.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)?.[1];
    return og && esImagenApta(og) ? og : null;
  } catch { return null; }
}

// Bing Images — extrae mediaurl (URL de imagen real) del HTML de resultados
async function buscarImagenBing(nombre, marca) {
  try {
    const query = `"${nombre}" ${marca} perfume`;
    const res = await fetch(
      `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&qft=+filterui:photo-photo`,
      { headers: { ...HEADERS, "Accept-Language": "en-US,en;q=0.9" }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const html = await res.text();
    const urls = [...html.matchAll(/mediaurl=([^&"'\s]+\.(?:jpg|jpeg|png|webp)[^&"'\s]*)/gi)]
      .map(m => { try { return decodeURIComponent(m[1]); } catch { return m[1]; } })
      .filter(u => esImagenApta(u) && !u.includes("bing.com") && !u.includes("msn.com") && !u.includes("microsoft.com"));
    // Primero: dominio de tienda de perfumes (más confiable)
    const deTienda = urls.find(esDominioConfiable);
    if (deTienda) return deTienda;
    // Segundo: URL cuyo path contiene TODAS las palabras del nombre (evita falsos positivos)
    const palabrasNombre = nombre.toLowerCase().split(/\s+/).filter(p => p.length > 3);
    const porNombre = palabrasNombre.length > 0
      ? urls.find(u => palabrasNombre.every(p => u.toLowerCase().includes(p)))
      : null;
    return porNombre ?? null;
  } catch { return null; }
}

// emiratesoud.co.uk — Shopify store con API de búsqueda predictiva (sin JS)
async function buscarImagenEmirates(nombre, marca) {
  try {
    const res = await fetch(
      `https://www.emiratesoud.co.uk/search/suggest.json?q=${encodeURIComponent(nombre)}&resources[type]=product&resources[limit]=5`,
      { headers: { ...HEADERS, Accept: "application/json" }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const products = data?.resources?.results?.products ?? [];
    const palabras = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").split("-").filter(p => p.length > 2);
    // Exigir al menos 1 palabra del nombre en el handle del producto
    // Exigir TODAS las palabras en el handle (evita Khamrah vs Khamrah Waha)
    const best = products.find(p => palabras.every(w => p.handle?.includes(w)));
    if (!best) return null;
    const img = typeof best.image === "string" ? best.image : best.featured_image?.url;
    return img && esImagenApta(img) ? img : null;
  } catch { return null; }
}

// Fragrantica — imagen del producto (fimgs.net CDN) como último recurso de vendedor
async function buscarImagenFragranticaImg(nombre, marca) {
  try {
    const fragUrl = await buscarFragranticaUrl(nombre, marca);
    if (!fragUrl) return null;
    const res = await fetch(fragUrl, { headers: HEADERS, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const html = await res.text();
    // Fragrantica usa fimgs.net para las fotos de los frascos
    const img = html.match(/https:\/\/fimgs\.net\/mdimg\/perfume\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i)?.[0];
    return img ?? null;
  } catch { return null; }
}

// Pollinations.ai — genera imagen del frasco con IA (gratis, sin API key)
async function generarImagenIA(nombre, marca) {
  try {
    const prompt = `${nombre} by ${marca} luxury arabic perfume bottle product photography white background professional`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&enhance=true`;
    // Verificar que responde antes de devolver la URL (pollinations genera al pedirla)
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(20000) });
    if (!res.ok || !res.headers.get("content-type")?.includes("image")) return null;
    return url;
  } catch { return null; }
}

async function buscarImagenConfiable(nombre, marca) {
  const log = (label, url) => {
    if (url) console.log(`\n    ✅ [${label}] ${url.slice(0, 100)}`);
    else process.stdout.write(` ✗`);
  };

  process.stdout.write("\n    img [1] fragrancenet...");
  const imgFN = await buscarImagenFragrancenet(nombre, marca);
  if (imgFN) { log("fragrancenet", imgFN); return imgFN; }
  log(null, null);

  process.stdout.write("  [2] notino...");
  const imgNotino = await buscarImagenNotino(nombre, marca);
  if (imgNotino) { log("notino", imgNotino); return imgNotino; }
  log(null, null);

  process.stdout.write("  [3] sitio marca...");
  const imgOficial = await buscarImagenMarcaOficial(nombre, marca);
  if (imgOficial) { log("sitio oficial", imgOficial); return imgOficial; }
  log(null, null);

  process.stdout.write("  [4] lujoperfume...");
  const imgLujo = await buscarImagenLujo(nombre);
  if (imgLujo) { log("lujoperfume", imgLujo); return imgLujo; }
  log(null, null);

  process.stdout.write("  [5] emiratesoud...");
  const imgEmirates = await buscarImagenEmirates(nombre, marca);
  if (imgEmirates) { log("emiratesoud", imgEmirates); return imgEmirates; }
  log(null, null);

  process.stdout.write("  [6] bing images...");
  const imgBing = await buscarImagenBing(nombre, marca);
  if (imgBing) { log("bing", imgBing); return imgBing; }
  log(null, null);

  process.stdout.write("  [7] fragrantica...");
  const imgFrag = await buscarImagenFragranticaImg(nombre, marca);
  if (imgFrag) { log("fragrantica", imgFrag); return imgFrag; }
  log(null, null);

  process.stdout.write("  [8] IA Pollinations...");
  const imgIA = await generarImagenIA(nombre, marca);
  if (imgIA) { log("IA generada", imgIA); return imgIA; }
  console.log(" ✗");

  return null;
}

function falta(datos) {
  return !datos.description || !datos.category || !datos.family;
}

function merge(base, nuevo) {
  if (!nuevo) return;
  for (const k of Object.keys(nuevo)) {
    if (base[k]) continue;
    // No guardar descripciones en árabe u otros scripts no-latinos
    if (k === "description" && !esDescripcionUtilizable(nuevo[k])) continue;
    base[k] = nuevo[k];
  }
}

async function buscarYGuardar(nombre, marca, perfumeId, { silencioso = false } = {}) {
  let datos = {};

  // 1. Sitio oficial de la marca
  if (!silencioso) process.stdout.write(`\n🔎  [1/7] Sitio oficial ${marca}...`);
  try { merge(datos, await scrapMarcaOficial(nombre, marca)); } catch {}
  if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");

  // 2. DuckDuckGo Instant Answers (Wikipedia/gratis)
  if (falta(datos)) {
    if (!silencioso) process.stdout.write(`🔎  [2/7] DuckDuckGo Instant...`);
    try { merge(datos, await buscarDDGInstant(nombre, marca)); } catch {}
    if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");
  }

  // 3. Fragrantica (texto sin imagen)
  if (falta(datos)) {
    if (!silencioso) process.stdout.write(`🔎  [3/7] Fragrantica...`);
    try {
      const fragUrl = await buscarFragranticaUrl(nombre, marca) ?? await buscarFragranticaUrl(nombre, "");
      if (fragUrl) { merge(datos, await scrapFragrantica(fragUrl)); }
    } catch {}
    if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");
  }

  // 4. Parfumo
  if (falta(datos)) {
    if (!silencioso) process.stdout.write(`🔎  [4/7] Parfumo...`);
    try { merge(datos, await scrapParfumo(nombre, marca)); } catch {}
    if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");
  }

  // 5. Notino
  if (falta(datos)) {
    if (!silencioso) process.stdout.write(`🔎  [5/7] Notino...`);
    try { merge(datos, await scrapNotino(nombre, marca)); } catch {}
    if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");
  }

  // 6. Búsqueda web general
  if (falta(datos)) {
    if (!silencioso) process.stdout.write(`🔎  [6/7] Búsqueda web...`);
    try { merge(datos, await buscarDatosEnPaginas(nombre, marca)); } catch {}
    if (!silencioso) console.log(falta(datos) ? " sin datos" : " ✅");
  }

  // 7. IA (Claude si hay suscripción, Groq como fallback gratuito)
  if (falta(datos)) {
    const iaLabel = ANTHROPIC_API_KEY ? "Claude" : GROQ_API_KEY ? "Groq" : "IA (sin clave)";
    if (!silencioso) process.stdout.write(`🤖  [7/7] ${iaLabel}...`);
    try {
      const iaData = await buscarConIA(nombre, marca, datos);
      if (iaData) { merge(datos, iaData); }
    } catch {}
    if (!silencioso) console.log(falta(datos) ? (ANTHROPIC_API_KEY || GROQ_API_KEY ? " sin datos" : " sin clave API") : " ✅");
  }

  // Imagen: SIEMPRE buscar con el pipeline dedicado (ignora imageUrl de scrapers de texto)
  // Los scrapers de texto (Parfumo, Notino, etc.) encuentran imágenes genéricas del producto
  // equivocado — el pipeline de imagen tiene lógica específica para evitar confundir variantes.
  if (!silencioso) process.stdout.write(`🖼️   Buscando imagen...`);
  try {
    const imgDedicada = await buscarImagenConfiable(nombre, marca);
    if (imgDedicada) datos.imageUrl = imgDedicada;
    else if (!datos.imageUrl) datos.imageUrl = null; // queda null si nadie encontró nada
  } catch {}
  if (!silencioso) console.log(datos.imageUrl ? " ✅" : " no encontrada");

  // Resumen de lo encontrado
  console.log("\n──────────────────────────────────────────");
  console.log(`  ${nombre} — ${marca}`);
  console.log(`  Categoría:   ${datos.category ?? "—"}`);
  console.log(`  Familia:     ${datos.family ?? "—"}`);
  console.log(`  Duración:    ${datos.duration ?? "—"}`);
  console.log(`  Imagen:      ${datos.imageUrl ? "✅ " + datos.imageUrl.slice(0, 70) + "..." : "— no encontrada"}`);
  if (datos.description) console.log(`  Descripción: ${datos.description.slice(0, 120)}...`);
  console.log("──────────────────────────────────────────");

  const ok = await ask("¿Guardar? [S/n]: ");
  if (ok.toLowerCase() === "n") { console.log("Cancelado."); return false; }

  const patch = {};
  if (datos.category)                                        patch.category    = datos.category;
  if (datos.family && FAMILIES_VALID.includes(datos.family)) patch.family      = datos.family;
  if (datos.description)                                     patch.description = datos.description;
  if (datos.duration)                                        patch.duration    = datos.duration;

  if (datos.imageUrl) {
    process.stdout.write("⬇️   Subiendo imagen...");
    try { patch.image = await subirImagen(datos.imageUrl, nombre); console.log(" ✅"); }
    catch (e) { console.log(` sin imagen: ${e.message}`); }
  } else {
    // Si no encontramos imagen nueva, revisar si la existente en Sanity es una imagen mala (set/promo)
    try {
      const existing = await client.fetch(
        `*[_id == $id][0]{ "imgUrl": image.asset->url }`,
        { id: perfumeId }
      );
      if (existing?.imgUrl && !esImagenApta(existing.imgUrl)) {
        console.log(`\n⚠️   Imagen actual es un set/promo — borrando...`);
        await client.patch(perfumeId).unset(["image"]).commit();
        console.log("   ✅ Imagen mala eliminada de Sanity.");
      }
    } catch {}
  }

  if (Object.keys(patch).length === 0) {
    console.log("⚠️   Sin datos nuevos."); return true;
  }

  const result = await client.patch(perfumeId).set(patch).commit();
  console.log(`🎉  ¡Guardado! ID=${result._id} rev=${result._rev} campos=(${Object.keys(patch).join(", ")})`);
  return true;
}

async function crearPerfume() {
  console.log("\n── CREAR PERFUME NUEVO ──────────────────");
  const nombre = (await ask("Nombre: ")).trim();
  if (!nombre) return;

  // Auto-detectar marca
  let marca = detectarMarca(nombre);
  if (marca) {
    console.log(`   Marca detectada: ${marca}`);
    const cambiar = (await ask("   ¿Cambiar marca? (Enter para usar esta): ")).trim();
    if (cambiar) marca = cambiar;
  } else {
    BRANDS_VALID.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
    const marcaInput = (await ask("Marca (número o nombre): ")).trim();
    const num = parseInt(marcaInput);
    marca = !isNaN(num) && num >= 1 && num <= BRANDS_VALID.length
      ? BRANDS_VALID[num - 1]
      : marcaInput;
  }

  const precio = (await ask("Precio (ej: $74.000): ")).trim();
  const mlStr  = (await ask("ML (ej: 100, Enter = 100): ")).trim();
  const ml     = parseInt(mlStr) || 100;

  // Verificar duplicados
  const slug = toSlug(nombre);
  const existente = await client.fetch(
    `*[_type == "perfume" && (slug.current == $slug || lower(name) == $nameLower)][0]{ _id, name }`,
    { slug, nameLower: nombre.toLowerCase() }
  );
  if (existente) {
    console.log(`⚠️   Ya existe "${existente.name}".`);
    const usar = (await ask("   ¿Actualizar ese en vez de crear uno nuevo? [s/N]: ")).trim();
    if (usar.toLowerCase().startsWith("s")) {
      await buscarYGuardar(nombre, marca, existente._id);
      return;
    }
  }

  // Crear documento base
  process.stdout.write("⬆️   Creando en Sanity...");
  const doc = {
    _type: "perfume",
    name: nombre, brand: marca, price: precio, ml,
    slug: { _type: "slug", current: existente ? `${slug}-2` : slug },
    outOfStock: false, isDecant: false,
  };
  const created = await client.create(doc);
  console.log(` ✅  ID: ${created._id}`);

  // Buscar y guardar todo automáticamente
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
    const soloNum = /^\d+$/.test(query); // solo números puros → índice
    let perfume;
    if (soloNum) {
      const num = parseInt(query);
      if (num >= 1 && num <= perfumes.length) perfume = perfumes[num - 1];
    } else {
      perfume = perfumes.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (!perfume) { console.error(`❌  No encontrado: "${query}"`); rl.close(); return; }

    console.log(`\n⚠️   Vas a eliminar: ${perfume.name} — ${perfume.brand}`);
    const confirmar = await ask(`   Escribí el nombre para confirmar ("${perfume.name}"): `);
    if (confirmar.trim().toLowerCase() !== perfume.name.toLowerCase()) {
      console.log("❌  Nombre incorrecto. Cancelado.");
      rl.close(); return;
    }

    await client.delete(perfume._id);
    console.log(`🗑️   "${perfume.name}" eliminado de Sanity.`);
  } else {
    const soloNum = /^\d+$/.test(input);
    let perfume;
    if (soloNum) {
      const num = parseInt(input);
      if (num >= 1 && num <= perfumes.length) perfume = perfumes[num - 1];
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
