import { ViewStream } from 'spyne';
import { NavBreadcrumbViewTraits } from 'traits/nav/nav-breadcrumb-view-traits.js';
import BreadcrumbTmpl from './templates/nav-breadcrumb-item.tmpl.html';
export class NavBreadcrumbView extends ViewStream {
  constructor(props = {}) {
    props.tagName = 'li';
    props.class = 'breadcrumb-item';
    props.traits = [NavBreadcrumbViewTraits];
    props.channels = ['CHANNEL_ROUTE'];
    props.template = BreadcrumbTmpl;
    super(props);
  }

  addActionListeners() {
    return [['CHANNEL_ROUTE_.*_EVENT', 'navBreadcrumbView$UpdateLink']];
  }

  broadcastEvents() {
    return [['a', 'click']];
  }

  onRendered() {
    this.navBreadcrumbView$UIBreadcrumbOnRendered();
  }
}
