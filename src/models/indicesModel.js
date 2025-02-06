// src/models/indicesModel.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* Recreate __dirname in ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Path to the JSON file with indices data */
const dataPath = path.join(__dirname, "../data/indicesData.json");

/**
 * Load indices from the JSON file.
 */
export function loadIndices() {
  try {
    const fileBuffer = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(fileBuffer);
  } catch (error) {
    console.error("Error reading indicesData.json:", error);
    return [];
  }
}
