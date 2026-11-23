import { path } from 'ramda';
import { SpyneTrait, ChannelPayloadFilter } from 'spyne';

export class ChannelMenuDrawerTraits extends SpyneTrait {
  constructor(context) {
    let traitPrefix = 'channelMenuDrawer$';
    super(context, traitPrefix);
  }

  static channelMenuDrawer$OnRegistered() {
    const breakPointFilter = new ChannelPayloadFilter({
      mediaQueryName: 'showMenuDrawer',
    });

    const menuDrawerBtnFilter = new ChannelPayloadFilter({
      propFilters: {
        eventType: 'menuDrawer',
      },
    });

    const appInitFilter = new ChannelPayloadFilter({
      action: 'CHANNEL_APP_INIT_EVENT',
    });

    const routeChangeFilter = new ChannelPayloadFilter({
      action: 'CHANNEL_ROUTE_CHANGE_EVENT',
    });

    this.getChannel('CHANNEL_WINDOW', breakPointFilter).subscribe(
      this.channelMenuDrawer$OnWindowEvent.bind(this),
    );

    this.getChannel('CHANNEL_UI', menuDrawerBtnFilter).subscribe(
      this.channelMenuDrawer$OnUiClick.bind(this),
    );

    this.getChannel('CHANNEL_APP', appInitFilter).subscribe(
      this.channelMenuDrawer$OnMenuDrawerInit.bind(this),
    );

    // Going to another page closes the drawer. Its links are ROUTE anchors, so a
    // click on one is sent to CHANNEL_ROUTE and never reaches CHANNEL_UI, where the
    // filter above listens: the drawer used to stay open over the page it had just
    // led to, and on a phone it covers most of that page.
    this.getChannel('CHANNEL_ROUTE', routeChangeFilter).subscribe(
      this.channelMenuDrawer$OnRouteChange.bind(this),
    );
  }

  static channelMenuDrawer$OnRouteChange() {
    this.channelMenuDrawer$SendMenuDrawerEvent(false);
  }

  static channelMenuDrawer$OnMenuDrawerInit(e) {
    const { initData } = e.payload;
    const { isDeepLink, routeData } = initData;
    const action = 'CHANNEL_MENU_DRAWER_INIT_EVENT';

    this.sendChannelPayload(action, {
      initData,
      isDeepLink,
      routeData,
    });
  }

  static channelMenuDrawer$OnUiClick(e) {
    const { isHamburger } = e.payload;
    const checkBurgerClassFn = path(['srcElement', 'el', 'classList'], e);
    const isHamburgerBtn = isHamburger === 'true';
    const showBurgerBool = checkBurgerClassFn?.contains('open') === false;

    if (isHamburgerBtn === true) {
      this.channelMenuDrawer$SendMenuDrawerEvent(showBurgerBool);
    } else {
      this.channelMenuDrawer$SendMenuDrawerEvent(false);
    }
  }

  static channelMenuDrawer$SendMenuDrawerEvent(b = true) {
    const action =
      b === true
        ? 'CHANNEL_MENU_DRAWER__SHOW_EVENT'
        : 'CHANNEL_MENU_DRAWER__HIDE_EVENT';
    this.sendChannelPayload(action, { action });
  }

  static channelMenuDrawer$OnWindowEvent() {
    this.channelMenuDrawer$SendMenuDrawerEvent(false);
  }
}
