const installPrompt = `Please install Teddy, my tiny Codex buddy, from:
https://danieloleary.github.io/teddy-v31/downloads/teddy-codex-buddy.zip

Download and unzip it, copy pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
then verify the installed spritesheet hash matches the package manifest.`;

const toast = document.querySelector("[data-toast]");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function copyInstallPrompt() {
  try {
    await navigator.clipboard.writeText(installPrompt);
    showToast("Teddy install prompt copied.");
  } catch {
    showToast("Copy failed. Select the prompt manually.");
  }
}

document.querySelectorAll("[data-copy-install]").forEach((button) => {
  button.addEventListener("click", copyInstallPrompt);
});
