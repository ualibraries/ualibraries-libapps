async function loadHTML(selector, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.querySelector(selector).innerHTML = html;
}

function ensureLibchatScript() {
  const libchat_src =
    "https://ask.library.arizona.edu/load_chat.php?hash=07713bc057f66ebcdccd4dd1b4a2be3e";

  // Remove existing libchat script if it exists
  const existingScript = document.querySelector(`script[src="${libchat_src}"]`);
  if (existingScript) {
    existingScript.parentNode.removeChild(existingScript);
  }

  const libchat_script = document.createElement("script");
  libchat_script.src = libchat_src;
  document.body.appendChild(libchat_script);
}

async function init() {
  await loadHTML("#ualibraries-header", "/html/global_header.html");
  if (window.location.pathname === "/lg-guide") {
    await loadHTML("#ualibraries-guide-header", "/html/libguides/guide_header.html");
  }
  ensureLibchatScript();
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
