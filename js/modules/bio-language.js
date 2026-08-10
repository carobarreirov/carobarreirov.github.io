export function initBioLanguage(root = document) {
  const buttons = [...root.querySelectorAll(".bio-lang-btn")];
  const panels = [...root.querySelectorAll("[data-bio-language]")];

  if (buttons.length === 0 || panels.length === 0) {
    return () => {};
  }

  const selectLanguage = (selectedButton) => {
    const selectedLanguage = selectedButton.dataset.lang;

    for (const button of buttons) {
      const isSelected = button === selectedButton;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    }

    for (const panel of panels) {
      panel.hidden = panel.dataset.bioLanguage !== selectedLanguage;
    }
  };

  const listeners = buttons.map((button) => {
    const listener = () => selectLanguage(button);
    button.addEventListener("click", listener);
    return [button, listener];
  });

  return () => {
    for (const [button, listener] of listeners) {
      button.removeEventListener("click", listener);
    }
  };
}
