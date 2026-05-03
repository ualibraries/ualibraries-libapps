async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}

async function init() {
  await loadHTML("#ualibraries-header", "/html/global_header.html");
  await loadHTML("#ualibraries-footer", "/html/global_footer.html");
}

init();

// Enable HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR update");
    init(); // reload header/footer on change
  });
}
