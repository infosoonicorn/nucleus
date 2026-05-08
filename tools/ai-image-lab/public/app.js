const form = document.querySelector("#form");
const button = document.querySelector("#generate");
const statusEl = document.querySelector("#status");
const message = document.querySelector("#message");
const gallery = document.querySelector("#gallery");
const promptEl = document.querySelector("#prompt");
const clear = document.querySelector("#clear");

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    statusEl.textContent = data.hasOpenAIKey
      ? `Ready. Model default: ${data.model}`
      : "Missing OPENAI_API_KEY in .env";
  } catch {
    statusEl.textContent = "Server health check failed.";
  }
}

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function renderImages(images) {
  gallery.innerHTML = "";
  images.forEach((src, index) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${src}" alt="Generated variant ${index + 1}" />
      <div class="cardFooter">
        <span>Variant ${index + 1}</span>
        <a href="${src}" target="_blank" rel="noreferrer">Open</a>
      </div>
    `;
    gallery.append(card);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  button.disabled = true;
  setMessage("Generating image variants...");

  try {
    const body = new FormData(form);
    const response = await fetch("/api/generate", {
      method: "POST",
      body
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Generation failed.");
    }
    renderImages(data.images);
    promptEl.textContent = data.prompt;
    setMessage(`${data.images.length} variant${data.images.length === 1 ? "" : "s"} generated with ${data.model}.`);
  } catch (error) {
    setMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
});

clear.addEventListener("click", () => {
  gallery.innerHTML = "";
  promptEl.textContent = "";
  setMessage("No images generated yet.");
});

checkHealth();
