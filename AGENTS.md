# AGENTS.md — application-shell

This is a SpyneJS application. **Before writing or modifying any SpyneJS code in this repo, read `node_modules/@spynejs/grammar/AGENTS.md`** — it is the working contract for the SpyneJS Grammar installed with this project (`@spynejs/grammar`, stackVersion v50-r11): the fetch discipline, the ambient rules, and the task-recognition table that routes a task to the cards and records that govern it. The Grammar itself lives under `node_modules/@spynejs/grammar/grammar/` — `trees.md` routes a task, `cards/` are the operations, `records/` are the constructions, `01-mental-model.md` is what kind of thing everything is; `manifest.json` at the package root is the machine-readable index.

If `node_modules/@spynejs/grammar` is missing, run `npm install` first — the Grammar is a declared devDependency, and SpyneJS code should not be authored without it.

## This repo specifically

- All page content lives in `src/static/data/app.model.json`; the route tree lives in `config.channels.ROUTE` in `src/index.js`. Adding a page is a data edit (see the Grammar's `author-app-model-node` card), not a new view class.
- `npm start` — dev server; `npm test` — web-test-runner suite; `npm run build` — production build.
