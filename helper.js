import "./src/style.css";

async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}

async function init() {
  await loadHTML("#vite-header", "/html/header.html");
  await loadHTML("#vite-footer", "/html/footer.html");
}

init();

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR update");
    init(); // reload header/footer on change
  });
}
