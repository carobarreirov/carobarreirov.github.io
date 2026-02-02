// Language toggle for CV bio
document.querySelectorAll(".lang-btn, .bio-lang-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const lang = this.getAttribute("data-lang");
    const buttonGroup = this.parentElement;
    buttonGroup.querySelectorAll("button").forEach((b) => {
      b.classList.remove("active");
    });
    this.classList.add("active");

    const contentContainer = this.closest("section");
    contentContainer
      .querySelectorAll(".bio-content, .bio-text")
      .forEach((content) => {
        content.style.display = "none";
      });

    const targetId = contentContainer.querySelector(`#bio-${lang}`)
      ? `bio-${lang}`
      : null;
    if (targetId) {
      document.getElementById(targetId).style.display = "block";
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Update active nav item
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");
    }
  });
});

// Add scroll spy functionality
window.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (
      window.scrollY >= sectionTop - 100 &&
      window.scrollY < sectionTop + sectionHeight - 100
    ) {
      const id = section.getAttribute("id");
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      document
        .querySelector(`.nav-link[href="#${id}"]`)
        ?.classList.add("active");
    }
  });
});

// Disable links in Blog and Talks section (non-destructive)
// This sets aria-disabled and removes links from the tab order for accessibility
// and adds a defensive click handler in case styles are overridden.
document.querySelectorAll("#content a").forEach((a) => {
  a.setAttribute("aria-disabled", "true");
  a.setAttribute("tabindex", "-1");
  a.addEventListener("click", (e) => {
    e.preventDefault();
  });
  a.classList.add("disabled-link");
});
