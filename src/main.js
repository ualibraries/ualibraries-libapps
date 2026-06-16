import "./global_styles.css";
import "./libguides/az_database/main.css";
import "./libguides/guide_sidebar.css";
import "./libguides/guide_main.css";

// Remove Springshare stylesheet references from page source
document.addEventListener("DOMContentLoaded", () => {
  // List of filenames to be removed
  const sheetsToRemove = ["lookfeel.css", "lg-public-bs5.min.css", "lg-public-bs535.min.css"];

  // Loop through sheetsToRemove, remove each from DOM
  sheetsToRemove.forEach((filename) => {
    const links = document.querySelectorAll(
      `link[rel="stylesheet"][href*="${filename}"]`,
    );
    links.forEach((link) => link.parentNode.removeChild(link));
  });

  // Remove Springshare inline styles
  document.querySelectorAll("style").forEach((style) => {
    // Remove inline CSS that starts with a comment referencing this twig file
    if (style.textContent.includes("bootstrap_tab_box_css.twig")) {
      style.remove();
    }
  });
});

function collapseAccordionsOnMobile() {
  if (window.innerWidth < 992) {
    document
      .querySelectorAll(".accordion-collapse.show")
      .forEach((openPanel) => {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(openPanel);
        bsCollapse.hide();
      });
  }
}

// Run on page load
collapseAccordionsOnMobile();

// Run on window resize
window.addEventListener("resize", collapseAccordionsOnMobile);