import * as cheerio from "cheerio";
import { defineConfig } from "vite";
import { proxyList } from "./proxy-list.js";

export default defineConfig({
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
    },
  },
  plugins: [
    {
      name: "LibApps middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const matchedProxy = proxyList.find(({ prefix }) =>
            req.url.startsWith(prefix),
          );
          const fetchUrl = matchedProxy
            ? matchedProxy.target + req.url.replace(matchedProxy.prefix, "")
            : null;

          if (fetchUrl) {
            const fetchRes = await fetch(fetchUrl);
            let html = await fetchRes.text();
            const $ = cheerio.load(html);

            $("#header_ua, #header_site, #footer_site").remove();

            $("body").prepend(`<div id="vite-header"></div>`);
            $("body").append(`
              <div id="vite-footer"></div>
              <script type="module" src="/helper.js"></script>
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
