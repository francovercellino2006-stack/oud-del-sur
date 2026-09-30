/**
 * Busca la mejor imagen del perfume en internet y la sube a Sanity.
 *
 * USO:
 *   node scripts/upload-images.mjs
 *
 * Muestra la lista de perfumes sin imagen → elegís uno → busca la foto → la sube.
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

const client = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  token:      TOKEN,
  apiVersion: "2024-01-01",
  useCdn:     false,
});

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(res => rl.question(q, res));

async function buscarImagen(query) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  };

  const homeRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, { headers });
  const homeHtml = await homeRes.text();
  const vqdMatch = homeHtml.match(/vqd=['"]([^'"]+)['"]/);
  if (!vqdMatch) throw new Error("No se pudo obtener el token de búsqueda.");
  const vqd = vqdMatch[1];

  const searchUrl = `https://duckduckgo.com/i.js?l=es-es&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`;
  const imgRes = await fetch(searchUrl, { headers: { ...headers, Referer: "https://duckduckgo.com/" } });
  const data = await imgRes.json();

  if (!data.results || data.results.length === 0) throw new Error("No se encontraron imágenes.");

  const preferred = ["fragrantica", "parfum", "perfume", "oud", "lattafa", "armaf", "afnan", "rasasi", "amazon", "mercadolibre"];
  const sorted = data.results.sort((a, b) => {
    const aScore = preferred.some(s => (a.url ?? "").toLowerCase().includes(s)) ? 1 : 0;
    const bScore = preferred.some(s => (b.url ?? "").toLowerCase().includes(s)) ? 1 : 0;
    return bScore - aScore;
  });

  return sorted[0].image;
}

async function descargarImagen(url) {
  const ext = url.split("?")[0].match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? "jpg";
  const tmpPath = join(tmpdir(), `perfume-${Date.now()}.${ext}`);

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
  });
  if (!res.ok) throw new Error(`Error al descargar imagen: ${res.status}`);

  await pipeline(res.body, createWriteStream(tmpPath));
  return tmpPath;
}

async function main() {
  console.log("\n🔍  Cargando perfumes...");
  const perfumes = await client.fetch(
    `*[_type == "perfume"] | order(name asc) { _id, name, brand, image, imageDecant }`
  );

  const sinImagen = perfumes.filter(p => !p.image);
  const conImagen = perfumes.filter(p => p.image);
  const lista = [...sinImagen, ...conImagen];

  console.log("\n══════════════════════════════════════════");
  console.log("📋  PERFUMES (sin imagen primero):");
  console.log("══════════════════════════════════════════");
  lista.forEach((p, i) => {
    const img = p.image ? "🖼️ " : "   ";
    console.log(`  ${String(i + 1).padStart(3)}.  ${img}  ${p.name}  —  ${p.brand}`);
  });
  console.log("\n🖼️ = ya tiene imagen\n");

  const input = await ask("Número o nombre del perfume: ");
  const num = parseInt(input);
  let perfume;
  if (!isNaN(num) && num >= 1 && num <= lista.length) {
    perfume = lista[num - 1];
  } else {
    const q = input.toLowerCase();
    perfume = lista.find(p => p.name.toLowerCase().includes(q));
  }

  if (!perfume) {
    console.error(`❌  No se encontró "${input}"`);
    rl.close(); return;
  }

  console.log(`\n✅  Perfume: ${perfume.name} — ${perfume.brand}`);

  if (perfume.image) {
    const ok = await ask("⚠️  Ya tiene imagen. ¿Reemplazar? [s/N]: ");
    if (!ok.toLowerCase().startsWith("s")) {
      console.log("Cancelado.");
      rl.close(); return;
    }
  }

  const query = `${perfume.name} ${perfume.brand} perfume bottle`;
  console.log(`\n🌐  Buscando imagen de "${perfume.name}"...`);

  let imageUrl;
  try {
    imageUrl = await buscarImagen(query);
    console.log(`📸  Imagen encontrada.`);
  } catch (e) {
    console.error(`❌  Error buscando imagen: ${e.message}`);
    rl.close(); return;
  }

  console.log("⬇️   Descargando...");
  let tmpPath;
  try {
    tmpPath = await descargarImagen(imageUrl);
  } catch (e) {
    console.error(`❌  Error descargando: ${e.message}`);
    rl.close(); return;
  }

  console.log("⬆️   Subiendo a Sanity...");
  try {
    const asset = await client.assets.upload("image", createReadStream(tmpPath), {
      filename: `${perfume.name}.jpg`,
    });
    await client.patch(perfume._id).set({
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    }).commit();
    console.log(`\n🎉  ¡Listo! Imagen de "${perfume.name}" subida a Sanity.`);
  } catch (e) {
    console.error(`❌  Error subiendo a Sanity: ${e.message}`);
  } finally {
    try { unlinkSync(tmpPath); } catch {}
  }

  const otro = await ask("\n¿Subir imagen de otro perfume? [s/N]: ");
  rl.close();
  if (otro.toLowerCase().startsWith("s")) {
    spawn(process.execPath, [process.argv[1]], { stdio: "inherit" });
  }
}

main().catch(e => { console.error(e); rl.close(); process.exit(1); });
