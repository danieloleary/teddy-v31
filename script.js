const installPrompt = `Install the Teddy V3.1 Codex pet from this ZIP.
Unzip it, copy pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
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
    showToast("Codex install prompt copied.");
  } catch {
    showToast("Copy failed. Select the prompt manually.");
  }
}

document.querySelectorAll("[data-copy-install]").forEach((button) => {
  button.addEventListener("click", copyInstallPrompt);
});
