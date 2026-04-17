// Remove Springshare stylesheet references from page source
document.addEventListener('DOMContentLoaded', () => {
  // List of filenames to be removed
  const sheetsToRemove = ['lookfeel.css', 'lg-public-bs5.min.css'];

  // Loop through sheetsToRemove, remove each from DOM
  sheetsToRemove.forEach(filename => {
    const links = document.querySelectorAll(`link[rel="stylesheet"][href*="${filename}"]`);
    links.forEach(link => link.parentNode.removeChild(link));
  });
});