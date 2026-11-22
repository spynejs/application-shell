import { SpyneTrait } from 'spyne';
import { NavBreadcrumbContainer } from 'components/nav/nav-breadcrumb-container.js';
import { Page404View } from 'components/pages/page-404-view.js';
import { PageView } from 'components/pages/page-view.js';

export class StageContainerTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'stage$';
    super(context, traitPrefix);
  }

  static stage$OnRouteEvent(e, isDeepLink = false) {
    const { pageId, is404 } = e.payload;
    const pageLookupTable = {
      404: Page404View,
    };

    let PageClass = pageLookupTable[pageId] || PageView;
    if (is404) {
      PageClass = Page404View;
    }
    const data = e.payload;
    this.appendView(new PageClass({ data, isDeepLink }), '.page-container');
  }

  // The page a link leads to is shown from its top. The page changes in the
  // same instant as the route, so the window is moved then. A move by the
  // browser's own Back or Forward is not admitted (stage-container.js): the
  // browser puts the window back where that page was left.
  static stage$ArriveAtTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  static stage$OnAppInitEvent(e) {
    this.stage$OnRouteEvent(e, true);
  }

  static stage$OnRendered() {
    this.appendView(new NavBreadcrumbContainer(), '.slot-page');
  }
}
