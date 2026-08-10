import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initTheme } from "../js/modules/theme.js";

describe("theme switcher", () => {
  let cleanup;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "terracotta";
    document.head.innerHTML =
      '<meta id="theme-color" name="theme-color" content="#f6f0e8">';
    document.body.innerHTML = `
      <button id="theme-toggle" type="button">
        <span id="theme-label">Terracotta</span>
      </button>
    `;
    cleanup = initTheme(document);
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("cycles through locally defined themes and persists the selection", () => {
    const toggle = document.getElementById("theme-toggle");

    toggle.click();

    expect(document.documentElement.dataset.theme).toBe("rose");
    expect(document.getElementById("theme-label").textContent).toBe("Rose");
    expect(document.getElementById("theme-color").content).toBe("#f8ecee");
    expect(localStorage.getItem("cbv-theme")).toBe("rose");
    expect(toggle.getAttribute("aria-label")).toContain("Rose");
  });
});
