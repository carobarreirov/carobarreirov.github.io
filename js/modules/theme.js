const THEME_DETAILS = {
  terracotta: {
    label: "Terracotta",
    color: "#f6f0e8",
  },
  rose: {
    label: "Rose",
    color: "#f8ecee",
  },
  ink: {
    label: "Ink",
    color: "#1e1817",
  },
};

const THEME_NAMES = Object.keys(THEME_DETAILS);

function storeTheme(theme) {
  try {
    localStorage.setItem("cbv-theme", theme);
  } catch {
    // The visual control still works when persistent storage is unavailable.
  }
}

export function initTheme(root = document) {
  const toggle = root.getElementById("theme-toggle");
  const label = root.getElementById("theme-label");
  const colorMeta = root.getElementById("theme-color");
  const rootElement = root.documentElement;

  if (!toggle || !label || !rootElement) return () => {};

  const applyTheme = (theme) => {
    const details = THEME_DETAILS[theme] ?? THEME_DETAILS.terracotta;
    rootElement.dataset.theme = theme;
    label.textContent = details.label;
    toggle.setAttribute(
      "aria-label",
      `Change color theme. Current theme: ${details.label}`,
    );

    if (colorMeta) colorMeta.content = details.color;
  };

  const initialTheme = THEME_NAMES.includes(rootElement.dataset.theme)
    ? rootElement.dataset.theme
    : "terracotta";
  applyTheme(initialTheme);

  const changeTheme = () => {
    const currentIndex = THEME_NAMES.indexOf(rootElement.dataset.theme);
    const nextTheme = THEME_NAMES[(currentIndex + 1) % THEME_NAMES.length];
    const update = () => applyTheme(nextTheme);
    const reduceMotion = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof root.startViewTransition === "function" && !reduceMotion) {
      root.startViewTransition(update);
    } else {
      update();
    }

    storeTheme(nextTheme);
  };

  toggle.addEventListener("click", changeTheme);
  return () => toggle.removeEventListener("click", changeTheme);
}
