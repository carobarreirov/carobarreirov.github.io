import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initNavigation } from "../js/modules/navigation.js";

class FakeIntersectionObserver {
  static instance;

  constructor(callback) {
    this.callback = callback;
    this.disconnect = vi.fn();
    this.observe = vi.fn();
    FakeIntersectionObserver.instance = this;
  }

  trigger(entries) {
    this.callback(entries);
  }
}

describe("primary navigation state", () => {
  let cleanup;
  let originalObserver;

  beforeEach(() => {
    originalObserver = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = FakeIntersectionObserver;
    document.body.innerHTML = `
      <nav class="site-nav">
        <a class="site-nav__link" href="#about">About</a>
        <a class="site-nav__link" href="#content">Content</a>
        <a class="site-nav__link" href="https://example.com">External</a>
      </nav>
      <section id="about"></section>
      <section id="content"></section>
    `;
    cleanup = initNavigation(document);
  });

  afterEach(() => {
    cleanup();
    globalThis.IntersectionObserver = originalObserver;
  });

  it("marks the intersecting section link as the current location", () => {
    const aboutSection = document.getElementById("about");
    const aboutLink = document.querySelector('a[href="#about"]');

    FakeIntersectionObserver.instance.trigger([
      {
        target: aboutSection,
        isIntersecting: true,
        boundingClientRect: { top: 20 },
      },
    ]);

    expect(aboutLink.classList.contains("active")).toBe(true);
    expect(aboutLink.getAttribute("aria-current")).toBe("location");
  });

  it("disconnects the observer during cleanup", () => {
    cleanup();
    expect(FakeIntersectionObserver.instance.disconnect).toHaveBeenCalledOnce();
    cleanup = () => {};
  });
});
