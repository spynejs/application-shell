import path from 'path';
import { readFile } from 'fs/promises';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';

// Must mirror resolve.alias in webpack.config.js. Source files import through
// these prefixes, so without them the app builds but every test fails to
// resolve. `alias` is not a @web/dev-server option — resolution goes through a
// plugin's resolveImport hook.
const aliases = {
  components: '/src/app/components',
  traits: '/src/app/traits',
  channels: '/src/app/channels',
  plugins: '/src/plugins',
  core: '/src/_core',
  css: '/src/css',
  data: '/src/static/data',
  imgs: '/src/static/imgs',
  svgs: '/src/static/imgs/svgs',
  fonts: '/src/static/fonts',
  iframes: '/src/static/iframes',
};

const aliasPlugin = {
  name: 'resolve-webpack-aliases',
  resolveImport({ source }) {
    const prefix = Object.keys(aliases).find(
      (key) => source === key || source.startsWith(`${key}/`),
    );
    return prefix ? source.replace(prefix, aliases[prefix]) : undefined;
  },
};

// ViewStreams import their markup (`import Tmpl from './x.tmpl.html'`). Webpack
// resolves that through html-loader; the test runner would otherwise serve the
// file as an HTML document and the importing module fails to load.
const htmlTemplatePlugin = {
  name: 'html-template-modules',
  async serve(context) {
    if (!context.path.endsWith('.tmpl.html')) return undefined;
    const filePath = path.join(process.cwd(), context.path.split('?')[0]);
    const html = await readFile(filePath, 'utf-8');
    return { body: `export default ${JSON.stringify(html)};`, type: 'js' };
  },
};

export default {
  files: ['src/tests/unit-tests/**/*.test.js'],
  nodeResolve: true,
  plugins: [aliasPlugin, htmlTemplatePlugin],

  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 2000,
    },
  },
  reporters: [
    defaultReporter({
      // Turn on test result reporting in the console
      reportTestResults: true,
      reportTestProgress: true,
    }),
    junitReporter({
      outputPath: './src/tests/results/unit-test-results.xml',
      reportLogs: true,
    }),
  ],

  // Any other options...
};
