const installPrompt = `Please install Teddy, my tiny Codex buddy, from:
https://danieloleary.github.io/teddy-v31/downloads/teddy-codex-buddy.zip

Download and unzip it, copy pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
then verify the installed spritesheet hash matches the package manifest.`;

const toast = document.querySelector("[data-toast]");
const copyPanel = document.querySelector("[data-copy-panel]");
const copyFallback = document.querySelector("[data-copy-fallback]");
const copySelect = document.querySelector("[data-copy-select]");
const copyClose = document.querySelector("[data-copy-close]");
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
  const label = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (label) {
    label.textContent = " Copied for Codex";
  } else {
    button.textContent = "Copied for Codex";
  }

  window.clearTimeout(button.copyTimer);
  button.copyTimer = window.setTimeout(() => {
    button.classList.remove("copied");
    if (label) {
      label.textContent = ` ${button.dataset.originalLabel}`;
    } else {
      button.textContent = button.dataset.originalLabel;
    }
  }, toastDuration);
}

function selectFallbackPrompt() {
  if (!copyFallback) return;
  copyFallback.focus();
  copyFallback.select();
}

function openCopyPanel() {
  if (!copyPanel || !copyFallback) return;
  copyFallback.value = installPrompt;
  copyPanel.hidden = false;
  window.requestAnimationFrame(selectFallbackPrompt);
}

function closeCopyPanel() {
  if (!copyPanel) return;
  copyPanel.hidden = true;
}

function legacyCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }

  if (!copied) {
    throw new Error("Legacy copy failed");
  }
}

async function writeClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  legacyCopy(text);
}

async function copyInstallPrompt(event) {
  const button = event.currentTarget;

  try {
    await writeClipboard(installPrompt);
    setCopiedState(button);
    showToast("Copied. Paste this into Codex to add Teddy.");
  } catch {
    openCopyPanel();
    showToast("Copy blocked. Prompt opened for manual copy.");
  }
}

document.querySelectorAll("[data-copy-install]").forEach((button) => {
  button.addEventListener("click", copyInstallPrompt);
});

copySelect?.addEventListener("click", selectFallbackPrompt);
copyClose?.addEventListener("click", closeCopyPanel);
copyPanel?.addEventListener("click", (event) => {
  if (event.target === copyPanel) {
    closeCopyPanel();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCopyPanel();
  }
});
