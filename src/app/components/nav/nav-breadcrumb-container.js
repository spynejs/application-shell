import { ViewStream } from 'spyne';
import { NavBreadcrumbContainerTraits } from 'traits/nav/nav-breadcrumb-container-traits.js';
import BCTmpl from './templates/nav-breadcrumb-view.tmpl.html';

export class NavBreadcrumbContainer extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'nav';
    props.class = 'breadcrumbs';
    props.template = BCTmpl;
    props.traits = [NavBreadcrumbContainerTraits];

    props.channels = ['CHANNEL_APP', 'CHANNEL_ROUTE'];
    props['aria-label'] = 'breadcrumb';
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_APP_INIT_EVENT', 'navBreadcrumb$OnAppInitEvent']];
  }

  broadcastEvents() {
    return [];
  }

  onRendered() {}
}
