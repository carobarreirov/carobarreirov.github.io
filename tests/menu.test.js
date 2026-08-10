import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { initMenu } from "../js/modules/menu.js";

describe("mobile navigation", () => {
  let cleanup;

  beforeEach(() => {
    document.body.innerHTML = `
      <button data-menu-toggle aria-expanded="false">Menu</button>
      <nav data-site-nav><a href="#about">About</a></nav>
    `;
    cleanup = initMenu(document);
  });

  afterEach(() => cleanup());

  it("opens with the menu control and closes after navigation", () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-site-nav]");

    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(navigation.dataset.open).toBe("true");

    navigation.querySelector("a").click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(navigation.dataset.open).toBe("false");
  });
});
