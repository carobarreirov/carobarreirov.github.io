export function initMenu(root = document) {
  const toggle = root.querySelector("[data-menu-toggle]");
  const navigation = root.querySelector("[data-site-nav]");

  if (!toggle || !navigation) return () => {};

  const setOpen = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    navigation.dataset.open = String(isOpen);
  };

  const toggleMenu = () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  };

  const closeMenu = () => setOpen(false);
  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  };

  const links = [...navigation.querySelectorAll("a")];
  toggle.addEventListener("click", toggleMenu);
  root.addEventListener("keydown", handleKeydown);
  for (const link of links) link.addEventListener("click", closeMenu);

  return () => {
    toggle.removeEventListener("click", toggleMenu);
    root.removeEventListener("keydown", handleKeydown);
    for (const link of links) link.removeEventListener("click", closeMenu);
  };
}
