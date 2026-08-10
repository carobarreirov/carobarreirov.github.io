import { initBioLanguage } from "./modules/bio-language.js";
import { initMenu } from "./modules/menu.js";
import { initMotion } from "./modules/motion.js";
import { initNavigation } from "./modules/navigation.js";
import { initPapersViewer } from "./modules/papers-viewer.js";
import { initTheme } from "./modules/theme.js";

let initialized = false;

export function initSite(root = document) {
  if (initialized) return;
  initialized = true;

  initTheme(root);
  initMenu(root);
  initBioLanguage(root);
  initNavigation(root);
  initPapersViewer(root);
  initMotion(root);

  const copyrightYear = root.getElementById("copyright-year");
  if (copyrightYear) {
    copyrightYear.textContent = String(new Date().getFullYear());
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initSite(), {
    once: true,
  });
} else {
  initSite();
}
