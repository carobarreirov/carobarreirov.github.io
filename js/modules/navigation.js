export function setActiveNavigation(links, activeSectionId) {
  for (const link of links) {
    const isActive = link.hash === `#${activeSectionId}`;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

export function initNavigation(root = document) {
  const links = [
    ...root.querySelectorAll(
      '.site-nav .site-nav__link[href^="#"]:not([href="#"])',
    ),
  ];
  const sections = links
    .map((link) => root.getElementById(link.hash.slice(1)))
    .filter(Boolean);

  if (links.length === 0 || sections.length === 0) {
    return () => {};
  }

  const linkListeners = links.map((link) => {
    const listener = () => setActiveNavigation(links, link.hash.slice(1));
    link.addEventListener("click", listener);
    return [link, listener];
  });

  if (!("IntersectionObserver" in globalThis)) {
    return () => {
      for (const [link, listener] of linkListeners) {
        link.removeEventListener("click", listener);
      }
    };
  }

  const visibleSections = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.boundingClientRect.top);
        } else {
          visibleSections.delete(entry.target.id);
        }
      }

      const activeSection = [...visibleSections.entries()].sort(
        ([, firstTop], [, secondTop]) =>
          Math.abs(firstTop) - Math.abs(secondTop),
      )[0];

      setActiveNavigation(links, activeSection?.[0] ?? "");
    },
    {
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    },
  );

  for (const section of sections) {
    observer.observe(section);
  }

  return () => {
    observer.disconnect();
    for (const [link, listener] of linkListeners) {
      link.removeEventListener("click", listener);
    }
  };
}
