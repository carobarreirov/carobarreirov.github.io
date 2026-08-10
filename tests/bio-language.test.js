import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initBioLanguage } from "../js/modules/bio-language.js";

describe("biography language selector", () => {
  let cleanup;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="bio-lang-btn active" data-lang="en" aria-pressed="true">English</button>
      <button class="bio-lang-btn" data-lang="es" aria-pressed="false">Español</button>
      <div data-bio-language="en">English biography</div>
      <div data-bio-language="es" hidden>Biografía en español</div>
    `;
    cleanup = initBioLanguage(document);
  });

  afterEach(() => {
    cleanup();
  });

  it("switches the visible biography and pressed state", () => {
    const englishButton = document.querySelector('[data-lang="en"]');
    const spanishButton = document.querySelector('[data-lang="es"]');
    const englishPanel = document.querySelector('[data-bio-language="en"]');
    const spanishPanel = document.querySelector('[data-bio-language="es"]');

    spanishButton.click();

    expect(englishPanel.hidden).toBe(true);
    expect(spanishPanel.hidden).toBe(false);
    expect(englishButton.getAttribute("aria-pressed")).toBe("false");
    expect(spanishButton.getAttribute("aria-pressed")).toBe("true");
    expect(spanishButton.classList.contains("active")).toBe(true);
  });
});
