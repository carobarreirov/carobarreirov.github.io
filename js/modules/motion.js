const REVEAL_KEYFRAMES = [
  { opacity: 0, transform: "translateY(18px)" },
  { opacity: 1, transform: "translateY(0)" },
];

function getRevealDelay(element) {
  const group = element.closest("[data-reveal-group]");
  if (!group) return 0;

  const groupedElements = [...group.querySelectorAll("[data-reveal]")];
  return Math.max(0, groupedElements.indexOf(element)) * 90;
}

export function initMotion(root = document) {
  const elements = [...root.querySelectorAll("[data-reveal]")];
  const reduceMotion = globalThis.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (
    elements.length === 0 ||
    reduceMotion ||
    typeof Element.prototype.animate !== "function" ||
    !("IntersectionObserver" in globalThis)
  ) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const animation = entry.target.animate(REVEAL_KEYFRAMES, {
          duration: 700,
          delay: getRevealDelay(entry.target),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        });
        animation.finished
          .then(() => animation.cancel())
          .catch(() => undefined);
        observer.unobserve(entry.target);
      }
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    },
  );

  for (const element of elements) observer.observe(element);
  return () => observer.disconnect();
}
