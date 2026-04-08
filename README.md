# ualibraries-libapps

University of Arizona Libraries customizations and workflows for Springshare/LibApps.

## Project Structure

This project uses [Vite](https://vite.dev/) as its build and development tool.

```text
ualibraries-libapps/
├── src/
│   ├── main.js
│   └── style.css
├── html/
├── helper.js           # Helper functions to load local html files to the mount points
├── package.json
├── proxy-list.js       # Fetch live Springshare pages for local development
├── README.md
└── vite.config.js
```

## Before you begin
- Node.js version 22.12+ is required (upgrade your `node` version if necessary)


## How to Use Vite in This Repo

Install dependencies:

```bash
npm install
```

Start the local development server (hot reload enabled):

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Updating Vite and Related Dependencies

This project currently relies on Vite via `devDependencies`.

Check what is out of date:

```bash
npm outdated
```

Update within allowed semver ranges in `package.json`:

```bash
npm update
```

Update a specific package to the latest version:

```bash
npm install vite@latest --save-dev
```

If you want to bump all dependencies (including major versions), use `npm-check-updates`:

```bash
npx npm-check-updates -u
npm install
```

After updates, verify everything still works:

```bash
npm run dev
npm run build
```

## How vite.config.js Works

The Vite config in this repo does two things during local development:

1. Proxies a small set of Springshare resource paths directly to the sandbox host.
2. Uses custom middleware to fetch and transform LibGuides HTML before serving it locally.

### 1) Vite server proxy rules

In [vite.config.js](vite.config.js), `server.proxy` forwards these paths to the sandbox LibGuides:

- `/process`
- `/web`
- `/lookfeel.css`

This is needed because the A-Z page requests those assets from root-relative URLs, and without proxying them, local development pages can load with missing styles/scripts.

### 2) Custom middleware request flow

The `LibApps middleware` in [vite.config.js](vite.config.js) runs on each incoming request and checks whether the URL starts with a configured prefix from [proxy-list.js](proxy-list.js):

- `/db-sandbox` -> sandbox A-Z databases path
- `/db` -> production A-Z databases path
- `/lg` -> production LibGuides path

If a prefix matches, the middleware:

1. Builds the upstream URL from the matching target + remainder of the request path.
2. Fetches the upstream HTML.
3. Removes the old header/footer. (`#header_ua`, `#header_site`, `#footer_site`).
4. Injects local mount points (`#vite-header`, `#vite-footer`).
5. Appends `<script type="module" src="/helper.js"></script>` so local helper logic runs.
6. Returns transformed HTML to the browser.

If no prefix matches, the middleware calls `next()` so normal Vite handling continues.

### Why this setup is useful

It lets you develop local front-end customizations against live/sandbox LibApps HTML while still using Vite's dev server and module workflow.
