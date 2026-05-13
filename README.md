# LibApps customizations

This repository houses customizations and workflows for the University of Arizona Libraries Springshare/LibApps instance. It is used for the purpose of version controlling assets and templates in a system that does not support version control. Assets (CSS/JS/images) are deployed to an S3 bucket for use in LibApps, while HTML templates are tracked solely for version control purposes.

## Project Structure

This project uses [Vite](https://vite.dev/) as its build and development tool.

```text
ualibraries-libapps/
├── src/
│   ├── main.js
│   └── global_styles.css
├── html/
|   |–– global_footer.html
|   |–– global_header.html
|   |–– libanswers
|   |–– libcal
|   └── libguides
|       |–– az_database
|       └── groups           # Directories for group-specific HTML
├── helper.js                # Helper functions to load local html files to the mount points
├── package.json
├── proxy-list.js            # Fetch live Springshare pages for local development
├── README.md
└── vite.config.js
```

### Global, system, and group assets

LibApps supports system & group styles. Springshare also supplies default styles for their apps, but we are intentionally excluding these styles (using JavaScript) in order to reduce the amount of CSS customizations that are required, and to depend directly on default Arizona Bootstrap styles.

#### System styles

**System** styles apply to all content within a given app (LibCal, LibAnswers, or LibGuides).
System styles are housed in the `ualibraries-libapps/src/<app_name>` folder, and are prefixed with the system's name.
For example, LibGuides system styles would be housed in:

```txt
ualibraries-libapps/
├── src/
|   |–– libanswers
|   |–– libcal
|   └── libguides
|       └── libguides_styles.css
```

#### Group styles

**Group** styles only apply to content that belongs to that specific group.
Group styles are housed in the `ualibraries-libapps/src/<app_name>/groups` folder, and follow the naming convention: `group__group-name.css`.
For example, group styles for a groups titled "Special Collections" and "HSL" within LibGuides would be housed in:

```txt
ualibraries-libapps/
├── src/
|   |–– libanswers
|   |–– libcal
|   └── libguides
|       └── groups
|           └── group__special-collections.css
|           └── group__hsl.css
```

#### Global styles

**Global** styles apply to all systems across LibApps. LibApps does not support truly "global" styles that apply to all content within LibApps. For our own purposes, we identify "global" styles as styles we are utilizing across LibApps.
Global styles are housed in the `ualibraries-libapps/src` folder, and are prefixed with `global_`.

For example:

```txt
ualibraries-libapps/
├── src/
|   └── global_styles.css
```

## Local development

### Before you begin

- Node.js version 22.12+ is required (upgrade your `node` version if necessary)

### How to use Vite in this repo

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

This command bundles `src/main.js` to:

```txt
dist/ualibraries-libapps.css
dist/ualibraries-libapps.js
```

Use it on external pages with:

```html
<link
  rel="stylesheet"
  href="https://<your-bucket-or-host>/ualibraries-libapps.css"
/>
<script src="https://<your-bucket-or-host>/ualibraries-libapps.js"></script>
```

Deploy production artifacts and image assets in one command (uploads files in `dist/` and `images/`):

```bash
npm run deploy
```

This runs `npm run build` and then:

```bash
aws s3 sync dist s3://ualibraries-libapps-sandbox
aws s3 sync images s3://ualibraries-libapps-sandbox/images
```

## Visual regression testing with Playwright

Visual snapshot tests are configured in `tests/visual.spec.js`.

Install Playwright browsers (first time only):

```bash
npx playwright install chromium
```

Create or update baseline snapshots:

```bash
npm run test:visual:update
```

Run visual regression checks against existing snapshots:

```bash
npm run test:visual
```

Open the HTML report after a run:

```bash
npm run test:visual:report
```

## CircleCI deployment on main

This repository includes a CircleCI pipeline in `.circleci/config.yml`.

- Trigger: every push to the `main` branch (including merge commits).
- Steps: checkout -> install dependencies -> install Playwright Chromium -> update visual snapshots -> build -> deploy `dist/`, `images/`, and visual baseline snapshots to S3.

These environment variables need to be set in the CircleCI project settings:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (defaults to `us-west-2` in the config)
- `S3_BUCKET` (defaults to `ualibraries-libapps-sandbox` in the config)
- `SNAPSHOT_PREFIX` (optional, defaults to `visual-baselines`)

The deployment uses:

```bash
aws s3 sync dist s3://$S3_BUCKET --delete
aws s3 sync images s3://$S3_BUCKET/images --delete
aws s3 sync tests/visual.spec.js-snapshots s3://$S3_BUCKET/$SNAPSHOT_PREFIX --delete
```

## Updating Vite and related dependencies

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

## How vite.config.js works

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
4. Injects local mount points (`#ualibraries-header`, `#ualibraries-footer`).
5. Appends `<script type="module" src="/helper.js"></script>` so local helper logic runs.
6. Returns transformed HTML to the browser.

If no prefix matches, the middleware calls `next()` so normal Vite handling continues.

### Why this setup is useful

It lets you develop local front-end customizations against live/sandbox LibApps HTML while still using Vite's dev server and module workflow.
