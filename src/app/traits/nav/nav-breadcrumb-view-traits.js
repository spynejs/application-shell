import { SpyneTrait } from 'spyne';

export class NavBreadcrumbViewTraits extends SpyneTrait {
  constructor(context) {
    super(context, 'navBreadcrumbView$');
  }

  /**
   * Pure derivation: everything this crumb needs to render, computed from
   * the route payload plus this view's own coordinates (bcProps, navLevel).
   *
   *  isVisible  — route's active paths include any of this crumb's keys (and not home)
   *  isActive   — deeper path levels exist beyond this crumb (it links "up")
   *  isSelected — this crumb owns pathInnermost: the terminal crumb (aria-current)
   */
  static navBreadcrumbView$DeriveState(payload, props = this.props) {
    const { bcProps, navLevel, navLinks } = props;
    const { paths = [], pathInnermost, routeData = {} } = payload;

    const isHome = routeData.pageId === 'home';
    const onCurrentPath = bcProps.some((p) => paths.includes(p));

    const isVisible = !isHome && onCurrentPath;
    const isSelected = isVisible && bcProps.includes(pathInnermost);
    const isActive = isVisible && paths.length > navLevel;

    if (!isVisible) return { isVisible, isActive, isSelected };

    const navLink = navLinks.find(
      (link) =>
        link.navLevel === navLevel &&
        bcProps.every((p) => link[p] === routeData[p]),
    );

    return { isVisible, isActive, isSelected, navLink };
  }

  static navBreadcrumbView$UpdateLink(e) {
    const { payload } = e;
    const { isVisible, isActive, isSelected, navLink } =
      this.navBreadcrumbView$DeriveState(payload);

    this.props.el$.setClass(
      [
        'breadcrumb-item',
        !isVisible && 'breadcrumb-item--hidden',
        isActive ? 'breadcrumb-item--active' : 'breadcrumb-item--inactive',
      ]
        .filter(Boolean)
        .join(' '),
    );

    // aria-current marks the terminal crumb only; hidden/terminal leave the tab order
    if (isSelected) {
      this.props.el.setAttribute('aria-current', 'page');
    } else {
      this.props.el.removeAttribute('aria-current');
    }
    this.props.el.tabIndex = isSelected || !isVisible ? -1 : 0;

    if (!isVisible || navLink === undefined) {
      this.props.link$.el.innerText = '';
      return;
    }

    this.props.link$.el.innerText = navLink.title;
    this.props.link$.el.href = navLink.href;

    // Write this link's route coordinates into its dataset — dataset reads are
    // live, so the crumb remains a correct ROUTE link as the app navigates.
    for (const key of payload.paths) {
      if (navLink[key] !== undefined) {
        this.props.link$.el.dataset[key] = navLink[key];
      }
    }
  }

  navBreadcrumbView$UIBreadcrumbOnRendered() {
    this.props.link$ = this.props.el$('a');
    if (this.props.initPayload) {
      this.navBreadcrumbView$UpdateLink({ payload: this.props.initPayload });
    }
  }
}
