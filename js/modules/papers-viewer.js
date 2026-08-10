const PREVIEW_TIMEOUT_MS = 15_000;

function getPaperItems(root) {
  return [...root.querySelectorAll(".paper-link")].map((link) => ({
    link,
    title:
      link.querySelector(".publication__title")?.textContent.trim() ??
      link.textContent.trim(),
    file: link.getAttribute("href"),
  }));
}

export function initPapersViewer(root = document) {
  const items = getPaperItems(root);
  const dialog = root.getElementById("pdfDialog");

  if (items.length === 0 || !dialog || typeof dialog.showModal !== "function") {
    return () => {};
  }

  const title = root.getElementById("document-dialog-title");
  const counter = root.getElementById("document-counter");
  const previousButton = root.getElementById("previous-document");
  const nextButton = root.getElementById("next-document");
  const openDocumentLink = root.getElementById("open-document");
  const viewer = root.getElementById("document-viewer");
  const loading = root.getElementById("document-loading");
  const fallback = root.getElementById("document-fallback");
  const fallbackText = root.getElementById("document-fallback-text");

  const requiredElements = [
    title,
    counter,
    previousButton,
    nextButton,
    openDocumentLink,
    viewer,
    loading,
    fallback,
    fallbackText,
  ];

  if (requiredElements.some((element) => !element)) return () => {};

  let currentIndex = 0;
  let previewGeneration = 0;
  let previewTimeout;

  const clearPreview = () => {
    previewGeneration += 1;
    globalThis.clearTimeout(previewTimeout);
    viewer.onload = null;
    viewer.onerror = null;
    viewer.removeAttribute("src");
    viewer.hidden = true;
    loading.hidden = true;
    fallback.hidden = true;
  };

  const showFallback = (message, generation) => {
    if (generation !== previewGeneration) return;

    globalThis.clearTimeout(previewTimeout);
    loading.hidden = true;
    viewer.hidden = true;
    fallbackText.textContent = message;
    fallback.hidden = false;
  };

  const updateControls = () => {
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === items.length - 1;
  };

  const showItem = (index) => {
    const item = items[index];
    if (!item) return;

    clearPreview();
    currentIndex = index;
    const generation = previewGeneration;

    title.textContent = item.title;
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
    openDocumentLink.href = item.file;
    viewer.title = `${item.title} — PDF preview`;
    fallback.hidden = true;
    loading.hidden = false;
    viewer.hidden = false;
    updateControls();

    viewer.onload = () => {
      if (generation !== previewGeneration) return;
      globalThis.clearTimeout(previewTimeout);
      loading.hidden = true;
    };

    viewer.onerror = () => {
      showFallback(
        "Preview not available. Use “Open PDF” instead.",
        generation,
      );
    };

    viewer.src = item.file;
    previewTimeout = globalThis.setTimeout(() => {
      showFallback(
        "The preview is taking too long. Use “Open PDF” instead.",
        generation,
      );
    }, PREVIEW_TIMEOUT_MS);
  };

  const openItem = (index) => {
    showItem(index);
    dialog.showModal();
  };

  const linkListeners = items.map((item, index) => {
    const listener = (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      openItem(index);
    };

    item.link.addEventListener("click", listener);
    return [item.link, listener];
  });

  const showPrevious = () => {
    if (currentIndex > 0) showItem(currentIndex - 1);
  };

  const showNext = () => {
    if (currentIndex < items.length - 1) showItem(currentIndex + 1);
  };

  const keyHandler = (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  };

  const closeHandler = () => {
    clearPreview();
    title.textContent = "Selected research";
    counter.textContent = "0 / 0";
  };

  const backdropHandler = (event) => {
    if (event.target === dialog) dialog.close();
  };

  previousButton.addEventListener("click", showPrevious);
  nextButton.addEventListener("click", showNext);
  dialog.addEventListener("close", closeHandler);
  dialog.addEventListener("click", backdropHandler);
  root.addEventListener("keydown", keyHandler);
  updateControls();

  return () => {
    clearPreview();
    root.removeEventListener("keydown", keyHandler);
    previousButton.removeEventListener("click", showPrevious);
    nextButton.removeEventListener("click", showNext);
    dialog.removeEventListener("close", closeHandler);
    dialog.removeEventListener("click", backdropHandler);

    for (const [link, listener] of linkListeners) {
      link.removeEventListener("click", listener);
    }
  };
}
