import "dotenv/config";
import express from "express";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import slugify from "slugify";
import { buildPrompt } from "./promptTemplates.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4317);
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "outputs");
const upload = multer({ dest: uploadDir });

app.use(express.json({ limit: "2mb" }));
app.use("/outputs", express.static(outputDir));
app.use(express.static(path.join(__dirname, "public")));

async function ensureDirs() {
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
}

function requireKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is missing. Copy .env.example to .env and add your key.");
  }
  return key;
}

function makeBaseName(input) {
  const label = input.title || input.assetType || "image";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${slugify(label, { lower: true, strict: true }) || "image"}-${stamp}`;
}

async function saveBase64Image(b64, baseName, index) {
  const filename = `${baseName}-${index}.png`;
  const outPath = path.join(outputDir, filename);
  await fs.writeFile(outPath, Buffer.from(b64, "base64"));
  return `/outputs/${filename}`;
}

async function fetchImageToBase64(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not download generated image URL: ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  return bytes.toString("base64");
}

async function generateImage({ prompt, variants, size, model }) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt,
      n: variants,
      size
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI image generation failed: ${response.status}`);
  }
  return data.data || [];
}

async function editImage({ prompt, file, variants, size, model }) {
  const form = new FormData();
  form.append("model", model);
  form.append("prompt", prompt);
  form.append("n", String(variants));
  form.append("size", size);
  const bytes = await fs.readFile(file.path);
  const blob = new Blob([bytes], { type: file.mimetype || "image/png" });
  form.append("image", blob, file.originalname || "reference.png");

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireKey()}`
    },
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenAI image edit failed: ${response.status}`);
  }
  return data.data || [];
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.IMAGE_MODEL || "gpt-image-1"
  });
});

app.post("/api/generate", upload.single("reference"), async (req, res) => {
  try {
    const input = {
      assetType: req.body.assetType,
      title: req.body.title,
      summary: req.body.summary,
      theme: req.body.theme,
      audience: req.body.audience,
      style: req.body.style
    };
    const model = req.body.model || process.env.IMAGE_MODEL || "gpt-image-1";
    const variants = Math.min(Math.max(Number(req.body.variants || 1), 1), 4);
    const size = req.body.size || "1024x1024";
    const prompt = buildPrompt(input);
    const baseName = makeBaseName(input);

    const imageItems = req.file
      ? await editImage({ prompt, file: req.file, variants, size, model })
      : await generateImage({ prompt, variants, size, model });

    const images = [];
    for (let index = 0; index < imageItems.length; index += 1) {
      const item = imageItems[index];
      const b64 = item.b64_json || (item.url ? await fetchImageToBase64(item.url) : null);
      if (!b64) continue;
      images.push(await saveBase64Image(b64, baseName, index + 1));
    }

    res.json({ ok: true, prompt, images, model, usedReference: Boolean(req.file) });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  } finally {
    if (req.file?.path) {
      await fs.rm(req.file.path, { force: true }).catch(() => {});
    }
  }
});

await ensureDirs();
app.listen(port, () => {
  console.log(`AI image lab running at http://localhost:${port}`);
});
