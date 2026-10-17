// dev-tools.js
import { SpyneApp } from 'spyne';
import { SpynePluginConsole } from 'spyne-plugin-console';
import { SpyneCmsPlugin } from '@spynejs/cms';
import { CmsReadyNullView } from 'components/ui-elements/null-views/cms-ready-null-view.js';

const cmsPluginConfig = {
  position: ['bottom', 'right'],
  openOnLoad: true,
  darkMode: true,
  maximize: true,
};

export const devToolsReady = new Promise((resolve) => {
  const spyneCmsPlugin = new SpyneCmsPlugin(cmsPluginConfig);
  SpyneApp.registerPlugin(spyneCmsPlugin);

  SpyneApp.registerPlugin(
    new SpynePluginConsole({
      position: ['bottom', 'left'],
      minimize: false,
    }),
  );

  /**
   * Resolve once the CMS has settled: its registry lookup
   * (CHANNEL_FETCH_REGISTRY_INFO) has answered. Data channels registered
   * before that answer race it — whichever localhost server replies first
   * decides whether the fetched data is proxified, and a lost race renders
   * the page with no editable items until a refresh re-rolls it.
   * The timeout keeps the app booting when the adapter is not running.
   */
  const fallback = setTimeout(resolve, 5000);
  const onReady = () => {
    clearTimeout(fallback);
    resolve();
  };
  new CmsReadyNullView({ onReady }).appendToNull();
});
