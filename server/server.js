import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const app = express();
app.use(cors());
app.use(express.json());

// Helpers
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { recipes: [] };
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
function genId() {
  return Math.random().toString(36).slice(2, 10);
}
function clampMood(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < 1 || n > 5) return null;
  return Math.round(n);
}

// Health
app.get("/api/health", (_, res) => res.json({ ok: true }));

// Listar
app.get("/api/recipes", (req, res) => {
  const db = readDB();
  res.json(db.recipes);
});

// Crear (incluye mood)
app.post("/api/recipes", (req, res) => {
  const { name, description = "", ingredients = [], mood = 3 } = req.body;
  const moodOk = clampMood(mood);
  if (!name || !Array.isArray(ingredients) || moodOk === null) {
    return res.status(400).json({ error: "Invalid payload (name/ingredients/mood)" });
    }
  const db = readDB();
  const recipe = { id: genId(), name, description, ingredients, mood: moodOk };
  db.recipes.unshift(recipe);
  writeDB(db);
  res.status(201).json(recipe);
});

// Actualizar (permite mood)
app.put("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, ingredients, mood } = req.body;
  const db = readDB();
  const idx = db.recipes.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  let moodPatch = {};
  if (mood !== undefined) {
    const moodOk = clampMood(mood);
    if (moodOk === null) return res.status(400).json({ error: "Invalid mood (1-5)" });
    moodPatch = { mood: moodOk };
  }

  db.recipes[idx] = {
    ...db.recipes[idx],
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(ingredients !== undefined ? { ingredients } : {}),
    ...moodPatch
  };
  writeDB(db);
  res.json(db.recipes[idx]);
});

// Eliminar
app.delete("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const before = db.recipes.length;
  db.recipes = db.recipes.filter(r => r.id !== id);
  if (db.recipes.length === before) return res.status(404).json({ error: "Not found" });
  writeDB(db);
  res.status(204).end();
});

// Sugerir por estado de ánimo
// GET /api/recipes/suggest?mood=1..5
app.get("/api/recipes/suggest", (req, res) => {
  const moodQuery = clampMood(req.query.mood);
  if (moodQuery === null) return res.status(400).json({ error: "Provide mood=1..5" });

  const db = readDB();
  if (!db.recipes.length) return res.status(404).json({ error: "No recipes available" });

  const best = db.recipes
    .map(r => ({ r, score: Math.abs((r.mood ?? 3) - moodQuery) }))
    .sort((a, b) => a.score - b.score)[0].r;

  res.json(best);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
