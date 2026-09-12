import { SpyneTrait } from 'spyne';
import { UIHeaderView } from 'components/ui-elements/ui-header-view.js';
import { UIMenuDrawerView } from 'components/ui-elements/ui-menu-drawer-view.js';
import { StageContainer } from 'components/stage-container.js';
import { UIFooterView } from 'components/ui-elements/ui-footer-view.js';
import { LocalStorageNullView } from 'components/ui-elements/null-views/local-storage-null-view.js';

export class AppContainerTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'app$';
    super(context, traitPrefix);
  }

  static app$SetTheme(theme = 'dark', props = this.props) {
    props.el.dataset.theme = theme;
  }

  static app$OnLocalStorageEvent(e) {
    const { theme } = e.payload;
    this.app$SetTheme(theme);
  }

  static app$OnSettingsEvent(e) {
    const { settingsType, settingsValue } = e.payload;

    // CHANNEL_APP holds the mode; this view only applies it. Flipping the
    // attribute locally would drift from what the storage channel persisted.
    if (settingsType === 'theme') {
      this.app$SetTheme(settingsValue);
    }
  }

  static app$OnAppViewRendered() {
    this.appendView(new UIHeaderView());
    this.appendView(new UIMenuDrawerView());
    this.appendView(new StageContainer());
    this.appendView(new UIFooterView());
    new LocalStorageNullView().appendToNull();
  }
}
