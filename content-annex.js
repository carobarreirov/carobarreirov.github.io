// Annex-driven Blog Posts + Offcanvas PDF viewer (moved from index.js)
(() => {
  const blogListEl = document.getElementById('blog-list');
  const annexUrl = 'assets/annex.json';
  let annexItems = [];
  let currentIndex = 0;
  const offcanvasEl = document.getElementById('pdfOffcanvas');
  let bsOffcanvas = null;
  if (offcanvasEl) bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);

  function updateCounter() {
    const counter = document.getElementById('offcanvasCounter');
    if (counter) counter.textContent = `${currentIndex + 1} / ${annexItems.length}`;
  }

  function renderList() {
    if (!blogListEl) return;
    blogListEl.innerHTML = '';
    if (!annexItems.length) {
      blogListEl.innerHTML = '<p class="text-muted">No works available yet.</p>';
      return;
    }
    annexItems.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'mb-3';
      const a = document.createElement('a');
      a.href = '#';
      a.className = 'link-info';
      a.textContent = item.title;
      a.setAttribute('data-index', idx);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openViewer(idx);
      });
      li.appendChild(a);
      blogListEl.appendChild(li);
    });
  }

  function openViewer(idx) {
    currentIndex = idx;
    showItem(idx);
    if (bsOffcanvas) bsOffcanvas.show();
  }

  // Keep current blob URL so we can revoke it when changing items
  let currentBlobUrl = null;

  function clearBlobUrl() {
    if (currentBlobUrl) {
      try {
        URL.revokeObjectURL(currentBlobUrl);
      } catch (e) {}
      currentBlobUrl = null;
    }
  }

  function showItem(idx) {
    const item = annexItems[idx];
    if (!item) return;
    const titleEl = document.getElementById('offcanvasTitle');
    const iframe = document.getElementById('pdfViewer');
    const spinner = document.getElementById('pdfSpinner');
    const fallback = document.getElementById('pdfFallback');
    const fallbackText = document.getElementById('pdfFallbackText');

    if (titleEl) titleEl.textContent = item.title;

    // Reset UI
    if (iframe) iframe.src = '';
    if (fallback) fallback.classList.add('d-none');
    if (spinner) spinner.classList.remove('d-none');
    clearBlobUrl();

    // Try to fetch the file first (use blob so Content-Disposition: attachment is less likely to force download)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    fetch(item.file, { signal: controller.signal })
      .then((r) => {
        clearTimeout(timeoutId);
        if (!r.ok) throw new Error('Network error');
        // If content-type is present validate it's a PDF (be permissive if missing)
        const ct = r.headers.get('content-type') || '';
        if (ct && !ct.toLowerCase().includes('pdf')) {
          // still attempt to read it, but this is suspicious
          console.warn('Fetched resource content-type:', ct);
        }
        return r.blob();
      })
      .then((blob) => {
        if (!blob || blob.size === 0) throw new Error('Empty file');
        currentBlobUrl = URL.createObjectURL(blob);
        if (iframe) {
          iframe.src = currentBlobUrl;
          iframe.onload = () => {
            spinner?.classList.add('d-none');
            fallback?.classList.add('d-none');
          };
        }
      })
      .catch((err) => {
        console.error('Error loading preview', err);
        spinner?.classList.add('d-none');
        if (fallback) {
          fallback.classList.remove('d-none');
          if (err.name === 'AbortError') {
            fallbackText.textContent = 'Preview timed out';
          } else {
            fallbackText.textContent = 'Preview not available — file cannot be displayed.';
          }
        }
      });

    updateCounter();
    updateControls();
  }

  function updateControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < annexItems.length - 1;

    if (prevBtn) {
      prevBtn.disabled = !hasPrev;
      prevBtn.setAttribute('aria-disabled', String(!hasPrev));
      prevBtn.classList.toggle('d-none', !hasPrev);
    }

    if (nextBtn) {
      nextBtn.disabled = !hasNext;
      nextBtn.setAttribute('aria-disabled', String(!hasNext));
      nextBtn.classList.toggle('d-none', !hasNext);
    }
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      showItem(currentIndex);
    }
  });

  document.getElementById('nextBtn')?.addEventListener('click', () => {
    if (currentIndex < annexItems.length - 1) {
      currentIndex += 1;
      showItem(currentIndex);
    }
  });



  function keyHandler(e) {
    if (e.key === 'ArrowLeft') document.getElementById('prevBtn')?.click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn')?.click();
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  }

  function preventCtx(e) {
    e.preventDefault();
  }

  if (offcanvasEl) {
    offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
      offcanvasEl.addEventListener('contextmenu', preventCtx, { passive: false });
      document.addEventListener('keydown', keyHandler);
    });
    offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
      offcanvasEl.removeEventListener('contextmenu', preventCtx);
      document.removeEventListener('keydown', keyHandler);
      const iframe = document.getElementById('pdfViewer');
      const spinner = document.getElementById('pdfSpinner');
      const fallback = document.getElementById('pdfFallback');
      if (iframe) {
        iframe.src = '';
        iframe.onload = null;
      }
      if (spinner) spinner.classList.add('d-none');
      if (fallback) fallback.classList.add('d-none');
      clearBlobUrl();
    });
  }

  // Load annex.json
  if (blogListEl) {
    fetch(annexUrl)
      .then((r) => {
        if (!r.ok) throw new Error('Network error');
        return r.json();
      })
      .then((data) => {
        annexItems = Array.isArray(data) ? data : [];
        renderList();
      })
      .catch((err) => {
        console.error('Error loading annex.json', err);
        if (blogListEl) blogListEl.innerHTML = '<p class="text-muted">Unable to load works.</p>';
      });
  }
})();