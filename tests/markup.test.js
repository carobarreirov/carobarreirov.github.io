import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");

describe("static markup", () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html;
  });

  it("uses resolvable in-page accessibility relationships", () => {
    for (const element of document.querySelectorAll("[aria-labelledby]")) {
      const labelIds = element
        .getAttribute("aria-labelledby")
        .split(/\s+/)
        .filter(Boolean);

      for (const labelId of labelIds) {
        expect(
          document.getElementById(labelId),
          `${element.id || element.tagName} references #${labelId}`,
        ).not.toBeNull();
      }
    }
  });

  it("secures links that open a new browsing context", () => {
    for (const link of document.querySelectorAll('a[target="_blank"]')) {
      const relationships = new Set(
        link.getAttribute("rel")?.split(/\s+/).filter(Boolean),
      );
      expect(relationships.has("noopener")).toBe(true);
      expect(relationships.has("noreferrer")).toBe(true);
    }
  });

  it("does not use an empty hash as a link target", () => {
    expect(document.querySelector('a[href="#"]')).toBeNull();
  });

  it("does not rely on remote runtime styles or scripts", () => {
    const runtimeReferences = [
      ...document.querySelectorAll('link[rel="stylesheet"][href], script[src]'),
    ].map(
      (element) => element.getAttribute("href") ?? element.getAttribute("src"),
    );

    expect(
      runtimeReferences.every((reference) => !reference.startsWith("http")),
    ).toBe(true);
  });

  it("keeps local linked assets in the repository", () => {
    const references = [
      ...document.querySelectorAll(
        "a[href], img[src], link[href], script[src]",
      ),
    ]
      .map(
        (element) =>
          element.getAttribute("href") ?? element.getAttribute("src"),
      )
      .filter(
        (reference) =>
          reference &&
          !reference.startsWith("#") &&
          !reference.startsWith("http"),
      );

    for (const reference of references) {
      expect(
        existsSync(resolve(projectRoot, reference)),
        `Missing local asset: ${reference}`,
      ).toBe(true);
    }
  });
});
