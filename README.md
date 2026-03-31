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
├── package.json
├── README.md
└── vite.config.js
```

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
