import "./global_styles.css";
import "./libguides/az_database/main.css";

// Remove Springshare stylesheet references from page source
document.addEventListener("DOMContentLoaded", () => {
  // List of filenames to be removed
  const sheetsToRemove = ["lookfeel.css", "lg-public-bs5.min.css"];

  // Loop through sheetsToRemove, remove each from DOM
  sheetsToRemove.forEach((filename) => {
    const links = document.querySelectorAll(
      `link[rel="stylesheet"][href*="${filename}"]`,
    );
    links.forEach((link) => link.parentNode.removeChild(link));
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
