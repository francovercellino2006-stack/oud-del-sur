/**
 * Subir imagen a un perfume en Sanity.
 *
 * USO INTERACTIVO (te muestra la lista y elegís):
 *   node scripts/upload-images.mjs
 *
 * USO DIRECTO:
 *   node scripts/upload-images.mjs "Nombre del Perfume" /ruta/imagen.jpg
 *   node scripts/upload-images.mjs "Nombre del Perfume" /ruta/imagen.jpg --decant
 *
 * Solo sube si el perfume NO tiene imagen. Para reemplazar una existente
 * agregá el flag --forzar al final del comando.
 */

import { createClient } from "@sanity/client";
import { createReadStream, existsSync } from "fs";
import { createInterface } from "readline";
import { extname } from "path";

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

async function main() {
  const args    = process.argv.slice(2).filter(a => !a.startsWith("--"));
  const isDecant = process.argv.includes("--decant");
  const forzar  = process.argv.includes("--forzar");

  // Traer perfumes
  console.log("\n🔍  Cargando perfumes...");
  const perfumes = await client.fetch(
    `*[_type == "perfume"] | order(name asc) { _id, name, brand, image, imageDecant }`
  );

  let perfume;

  if (args[0]) {
    // Modo directo: buscar por nombre
    const q = args[0].toLowerCase();
    perfume = perfumes.find(p => p.name.toLowerCase().includes(q));
    if (!perfume) {
      console.error(`❌  No se encontró ningún perfume con "${args[0]}"`);
      console.log("Perfumes disponibles:");
      perfumes.forEach((p, i) => console.log(`  ${i + 1}. ${p.name} — ${p.brand}`));
      rl.close(); return;
    }
  } else {
    // Modo interactivo: mostrar lista
    console.log("\n══════════════════════════════════════════");
    console.log("📋  PERFUMES EN SANITY:");
    console.log("══════════════════════════════════════════");
    perfumes.forEach((p, i) => {
      const tieneImg = p.image ? "🖼️ " : "   ";
      const tieneDecant = p.imageDecant ? "🔬" : "  ";
      console.log(`  ${String(i + 1).padStart(3)}.  ${tieneImg}${tieneDecant}  ${p.name}  —  ${p.brand}`);
    });
    console.log("\n🖼️  = tiene imagen principal   🔬 = tiene imagen decant\n");

    const input = await ask("Escribí el número o parte del nombre del perfume: ");
    const num = parseInt(input);
    if (!isNaN(num) && num >= 1 && num <= perfumes.length) {
      perfume = perfumes[num - 1];
    } else {
      const q = input.toLowerCase();
      perfume = perfumes.find(p => p.name.toLowerCase().includes(q));
    }
    if (!perfume) {
      console.error(`❌  No se encontró "${input}"`);
      rl.close(); return;
    }
  }

  console.log(`\n✅  Perfume seleccionado: ${perfume.name} — ${perfume.brand}`);

  // Tipo de imagen
  let campo = isDecant ? "imageDecant" : "image";
  if (!args[1] && !isDecant) {
    const tipo = await ask("¿Imagen principal o decant? [principal/decant] (Enter = principal): ");
    if (tipo.toLowerCase().startsWith("d")) campo = "imageDecant";
  }

  // Verificar si ya tiene imagen
  const yaExiste = campo === "imageDecant" ? perfume.imageDecant : perfume.image;
  if (yaExiste && !forzar) {
    const ok = await ask(`⚠️  "${perfume.name}" ya tiene ${campo === "imageDecant" ? "imagen decant" : "imagen principal"}. ¿Reemplazar? [s/N]: `);
    if (!ok.toLowerCase().startsWith("s")) {
      console.log("Cancelado — imagen no modificada.");
      rl.close(); return;
    }
  }

  // Ruta de la imagen
  let imagePath = args[1];
  if (!imagePath) {
    imagePath = await ask("Arrastrá la imagen aquí (o escribí la ruta): ");
    imagePath = imagePath.trim().replace(/^['"]|['"]$/g, ""); // quita comillas si las pega
  }

  if (!existsSync(imagePath)) {
    console.error(`❌  Archivo no encontrado: ${imagePath}`);
    rl.close(); return;
  }

  const ext = extname(imagePath).slice(1) || "jpeg";

  // Subir
  console.log(`\n⬆️  Subiendo imagen...`);
  try {
    const asset = await client.assets.upload("image", createReadStream(imagePath), {
      filename: `${perfume.name}.${ext}`,
    });
    await client.patch(perfume._id).set({
      [campo]: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    }).commit();
    console.log(`🎉  ¡Listo! Imagen subida a "${perfume.name}" [${campo}]`);
  } catch (e) {
    console.error(`❌  Error al subir: ${e.message}`);
  }

  rl.close();
}

main().catch(e => { console.error(e); rl.close(); process.exit(1); });
