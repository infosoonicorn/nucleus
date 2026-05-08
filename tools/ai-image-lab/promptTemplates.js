const sharedRules = `
Global visual rules:
- No readable text inside the image unless explicitly requested.
- No watermark, logos, UI chrome, screenshots, labels, captions, or typography.
- Compose for a mobile app card where title/subtitle will be overlaid by the product UI.
- Clean focal point, strong silhouette, polished premium finish, not cluttered.
- Warm, modern, emotionally resonant, realistic enough to feel trustworthy.
- Avoid distorted faces, extra fingers, strange anatomy, messy backgrounds, and harsh contrast.
- Leave safe negative space for UI overlay.
`.trim();

const templates = {
  article: ({ title, summary, theme, audience, style }) => `
Create a premium editorial thumbnail for an app article.

Article title for context only: ${title || "Untitled article"}
Article summary: ${summary || "No summary provided"}
Theme: ${theme || "wellbeing, family, growth"}
Audience: ${audience || "mobile app users"}
Preferred style: ${style || "warm polished digital illustration with cinematic lighting"}

Image direction:
- One clear visual metaphor for the article idea.
- Sophisticated, app-ready, high quality.
- Readable at small thumbnail size.
- Square composition.

${sharedRules}
`.trim(),

  milestone: ({ title, summary, theme, audience, style }) => `
Create a premium milestone card image for a mobile app.

Milestone: ${title || "New milestone"}
Context: ${summary || "A meaningful personal achievement"}
Theme: ${theme || "celebration, progress, gentle joy"}
Audience: ${audience || "families and everyday app users"}
Preferred style: ${style || "joyful refined illustration, soft realistic details"}

Image direction:
- Celebratory but elegant, not noisy.
- A visual scene or object that represents achievement and progress.
- Suitable behind app UI text.
- Square composition.

${sharedRules}
`.trim(),

  story: ({ title, summary, theme, audience, style }) => `
Create an inspiring story card image for a mobile app.

Story title for context only: ${title || "Inspired story"}
Story context: ${summary || "A hopeful human moment"}
Theme: ${theme || "hope, courage, care, transformation"}
Audience: ${audience || "mobile app users"}
Preferred style: ${style || "cinematic hopeful editorial illustration"}

Image direction:
- Human, grounded, emotionally warm.
- A simple scene that suggests the story without becoming literal or crowded.
- Hopeful light, premium composition.
- Square composition.

${sharedRules}
`.trim()
};

export function buildPrompt(input) {
  const type = input.assetType || "article";
  const build = templates[type] || templates.article;
  return build(input);
}

export const assetTypes = [
  { id: "article", label: "Article thumbnail" },
  { id: "milestone", label: "Milestone card" },
  { id: "story", label: "Inspired story card" }
];
