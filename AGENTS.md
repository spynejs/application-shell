# AGENTS.md — application-shell

This is a SpyneJS application. **Before writing or modifying any SpyneJS code in this repo, read `node_modules/@spynejs/kb/AGENTS.md`** — it is the working contract (fetch discipline, ambient rules, task-recognition table) for the SpyneJS Knowledge Base installed with this project (`@spynejs/kb`, stackVersion v50-r10). The knowledge itself lives under `node_modules/@spynejs/kb/kb/`; `node_modules/@spynejs/kb/manifest.json` is the machine-readable index.

If `node_modules/@spynejs/kb` is missing, run `npm install` first — the kit is a declared devDependency, and SpyneJS code should not be authored without it.

## This repo specifically

- All page content lives in `src/static/data/app.model.json`; the route tree lives in `config.channels.ROUTE` in `src/index.js`. Adding a page is a data edit (see kb card `author-app-model-node`), not a new view class.
- `npm start` — dev server; `npm test` — web-test-runner suite; `npm run build` — production build.
