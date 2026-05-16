const installPrompt = `Please install Teddy, my tiny Codex buddy, from:
https://danieloleary.github.io/teddy-v31/downloads/teddy-codex-buddy.zip

Download and unzip it, copy pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
then verify the installed spritesheet hash matches the package manifest.`;

const toast = document.querySelector("[data-toast]");
const toastDuration = 3200;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, toastDuration);
}

function setCopiedState(button) {
  if (!button.dataset.originalLabel) {
    button.dataset.originalLabel = button.textContent.trim();
  }
  button.classList.add("copied");
  button.lastChild.textContent = "Copied for Codex";

  window.clearTimeout(button.copyTimer);
  button.copyTimer = window.setTimeout(() => {
    button.classList.remove("copied");
    button.lastChild.textContent = button.dataset.originalLabel;
  }, toastDuration);
}

async function copyInstallPrompt(event) {
  const button = event.currentTarget;

  try {
    await navigator.clipboard.writeText(installPrompt);
    setCopiedState(button);
    showToast("Copied. Paste this into Codex to add Teddy.");
  } catch {
    showToast("Copy failed. Select the prompt manually.");
  }
}

document.querySelectorAll("[data-copy-install]").forEach((button) => {
  button.addEventListener("click", copyInstallPrompt);
});
