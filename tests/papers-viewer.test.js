import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { initPapersViewer } from "../js/modules/papers-viewer.js";

describe("papers viewer enhancement", () => {
  let cleanup;
  let dialog;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <a class="paper-link" href="assets/papers/first.pdf">
        <span class="publication__title">First paper</span>
      </a>
      <a class="paper-link" href="assets/papers/second.pdf">
        <span class="publication__title">Second paper</span>
      </a>
      <dialog id="pdfDialog">
        <h2 id="document-dialog-title">Selected research</h2>
        <span id="document-counter">0 / 0</span>
        <button id="previous-document" type="button">Previous</button>
        <button id="next-document" type="button">Next</button>
        <a id="open-document" href="assets/papers/first.pdf">Open PDF</a>
        <div id="document-loading" hidden></div>
        <iframe id="document-viewer" title="Document preview" hidden></iframe>
        <div id="document-fallback" hidden>
          <p id="document-fallback-text"></p>
        </div>
      </dialog>
    `;

    dialog = document.getElementById("pdfDialog");
    dialog.showModal = vi.fn(() => dialog.setAttribute("open", ""));
    dialog.close = vi.fn(() => {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    });
    cleanup = initPapersViewer(document);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("enhances a direct link and navigates between documents", () => {
    const firstLink = document.querySelector(".paper-link");
    const title = document.getElementById("document-dialog-title");
    const counter = document.getElementById("document-counter");
    const viewer = document.getElementById("document-viewer");
    const loading = document.getElementById("document-loading");
    const nextButton = document.getElementById("next-document");
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
    });

    firstLink.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(title.textContent).toBe("First paper");
    expect(counter.textContent).toBe("1 / 2");
    expect(viewer.getAttribute("src")).toBe("assets/papers/first.pdf");
    expect(loading.hidden).toBe(false);

    viewer.dispatchEvent(new Event("load"));
    expect(loading.hidden).toBe(true);

    nextButton.click();
    expect(title.textContent).toBe("Second paper");
    expect(counter.textContent).toBe("2 / 2");
    expect(viewer.getAttribute("src")).toBe("assets/papers/second.pdf");
    expect(nextButton.disabled).toBe(true);
  });

  it("shows a usable fallback when the preview times out", () => {
    document.querySelector(".paper-link").click();
    vi.advanceTimersByTime(15_000);

    expect(document.getElementById("document-viewer").hidden).toBe(true);
    expect(document.getElementById("document-fallback").hidden).toBe(false);
    expect(document.getElementById("open-document").getAttribute("href")).toBe(
      "assets/papers/first.pdf",
    );
  });

  it("closes when the dialog backdrop is selected", () => {
    document.querySelector(".paper-link").click();
    dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(dialog.close).toHaveBeenCalledOnce();
  });
});
