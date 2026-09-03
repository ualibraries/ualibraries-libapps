import * as cheerio from "cheerio";
import { defineConfig } from "vite";
import { proxyList } from "./proxy-list.js";

/**
 * Match a request against a proxy prefix on a path boundary, so that a shorter
 * prefix does not swallow a longer one (e.g. "/db" vs "/db-sandbox").
 */
function matchesPrefix(prefix, requestUrl) {
  return (
    requestUrl === prefix ||
    requestUrl.startsWith(`${prefix}/`) ||
    requestUrl.startsWith(`${prefix}?`)
  );
}

/**
 * The target's address without its query string. Links on a proxied page point
 * at the same path but carry their own params (search terms, facets,
 * pagination), so the query has to be ignored when matching them.
 */
function upstreamLinkBase(target) {
  const { origin, pathname } = new URL(target);
  return origin + pathname;
}

/**
 * Compose the upstream URL for a proxied request. The remainder of the request
 * path is appended to the target's path, and query params on the target act as
 * defaults that the request can override.
 */
function buildUpstreamUrl({ prefix, target }, requestUrl) {
  const targetUrl = new URL(target);
  const upstreamUrl = new URL(
    targetUrl.pathname + requestUrl.slice(prefix.length),
    targetUrl,
  );
  for (const [key, value] of targetUrl.searchParams) {
    if (!upstreamUrl.searchParams.has(key)) {
      upstreamUrl.searchParams.set(key, value);
    }
  }
  return upstreamUrl.href;
}

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.js",
      name: "UALibrariesLibApps",
      formats: ["iife"],
      fileName: () => "ualibraries-libapps.js",
    },
  },
  server: {
    proxy: {
      // On the A-Z page, Springshare loads additional resources from the root, so we need to proxy them here.
      "/process": {
        target: "https://customertesting-ua.libguides.com",
        changeOrigin: true,
      },
      "/web": {
        target: "https://customertesting-ua.libguides.com",
        changeOrigin: true,
      },
      "/lookfeel.css": {
        target: "https://customertesting-ua.libguides.com",
        changeOrigin: true,
      },
      "/srch_process_cs.php": {
        target: "https://libguides.library.arizona.edu",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    {
      name: "LibApps middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const matchedProxy = proxyList.find(({ prefix }) =>
            matchesPrefix(prefix, req.url),
          );
          const fetchUrl = matchedProxy
            ? buildUpstreamUrl(matchedProxy, req.url)
            : null;

          if (fetchUrl) {
            const fetchRes = await fetch(fetchUrl);
            let html = await fetchRes.text();
            const $ = cheerio.load(html);

            // Point links that stay on the proxied page back at the local
            // prefix, so navigating keeps our header, footer, and styles.
            const linkBase = upstreamLinkBase(matchedProxy.target);
            $(`a[href^="${linkBase}"]`).each((_, el) => {
              const href = $(el).attr("href");
              const newHref = href.replace(linkBase, matchedProxy.prefix);
              $(el).attr("href", newHref);
            });

            $(
              "#header_ua, #header_site, #footer_site, #ualibraries-banner, footer.footer",
            ).remove();

            // Remove any existing LibApps resources to avoid conflicts with our local versions.
            $(
              "link[href^='https://ualibraries-libapps-'][href$='.s3.us-west-2.amazonaws.com/ualibraries-libapps.css'],script[src^='https://ualibraries-libapps-'][src$='.s3.us-west-2.amazonaws.com/ualibraries-libapps.js']",
            ).remove();

            $("body").prepend(`<div id="ualibraries-header"></div>`);
            $("body").append(`
              <div id="ualibraries-footer"></div>
              <script type="module" src="/helper.js"></script>
              <script type="module" src="/src/main.js"></script>
            `);

            res.setHeader("Content-Type", "text/html");
            res.end($.html());
            return;
          } else {
            next();
          }
        });
      },
    },
  ],
});
