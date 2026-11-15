import { expect } from 'chai';
import {
  navLinks,
  navLinksDesign,
  payloadHome,
  payloadAbout,
  payloadDesignButtonPrimary,
  payloadCardFlyingTech,
} from '../mocks/route-mocks.js';
import { NavBreadcrumbContainerTraits } from '/src/app/traits/nav/nav-breadcrumb-container-traits.js';
import { NavBreadcrumbViewTraits } from '/src/app/traits/nav/nav-breadcrumb-view-traits.js';

const deriveState = (payload, props) =>
  NavBreadcrumbViewTraits.navBreadcrumbView$DeriveState(payload, props);

// A two-level route: /?pageId=…&topicId=…
const propsPage = { bcProps: ['pageId'], navLevel: 1, navLinks };
const propsCard = { bcProps: ['topicId'], navLevel: 2, navLinks };

// A three-level route: /elements/buttons/primary
const propsDesignPage = {
  bcProps: ['pageId'],
  navLevel: 1,
  navLinks: navLinksDesign,
};
const propsDesignTopic = {
  bcProps: ['topicId'],
  navLevel: 2,
  navLinks: navLinksDesign,
};
const propsDesignOption = {
  bcProps: ['optionId'],
  navLevel: 3,
  navLinks: navLinksDesign,
};

describe('navBreadcrumb$getBreadcrumbObjs', () => {
  it('should derive one breadcrumb per nav level, keyed by its first new prop', () => {
    const breadcrumbObjs =
      NavBreadcrumbContainerTraits.navBreadcrumb$getBreadcrumbObjs(navLinks);

    expect(breadcrumbObjs).to.eql([
      { navLevel: 1, bcProps: ['pageId'] },
      { navLevel: 2, bcProps: ['topicId'] },
    ]);
  });

  it('should extend to a third level and ignore malformed keys', () => {
    // navLinksDesign contains entries with a literal "undefined" key, which
    // must not become a breadcrumb prop.
    const breadcrumbObjs =
      NavBreadcrumbContainerTraits.navBreadcrumb$getBreadcrumbObjs(
        navLinksDesign,
      );

    expect(breadcrumbObjs).to.eql([
      { navLevel: 1, bcProps: ['pageId'] },
      { navLevel: 2, bcProps: ['topicId'] },
      { navLevel: 3, bcProps: ['optionId'] },
    ]);
  });
});

describe('navBreadcrumbView$DeriveState — isVisible', () => {
  it('should hide every crumb on home', () => {
    expect(deriveState(payloadHome, propsPage).isVisible).to.be.false;
    expect(deriveState(payloadHome, propsCard).isVisible).to.be.false;
  });

  it('should show only the page crumb on a one-level route', () => {
    expect(deriveState(payloadAbout, propsPage).isVisible).to.be.true;
    expect(deriveState(payloadAbout, propsCard).isVisible).to.be.false;
  });

  it('should show both crumbs on a two-level route', () => {
    expect(deriveState(payloadCardFlyingTech, propsPage).isVisible).to.be.true;
    expect(deriveState(payloadCardFlyingTech, propsCard).isVisible).to.be.true;
  });
});

describe('navBreadcrumbView$DeriveState — isActive', () => {
  it('should mark nothing active on home', () => {
    expect(deriveState(payloadHome, propsPage).isActive).to.be.false;
    expect(deriveState(payloadHome, propsCard).isActive).to.be.false;
  });

  it('should not mark the terminal crumb active', () => {
    expect(deriveState(payloadAbout, propsPage).isActive).to.be.false;
    expect(deriveState(payloadAbout, propsCard).isActive).to.be.false;
  });

  it('should mark a crumb active only when deeper levels exist', () => {
    expect(deriveState(payloadCardFlyingTech, propsPage).isActive).to.be.true;
    expect(deriveState(payloadCardFlyingTech, propsCard).isActive).to.be.false;
  });
});

describe('navBreadcrumbView$DeriveState — isSelected', () => {
  it('should select nothing on home', () => {
    expect(deriveState(payloadHome, propsPage).isSelected).to.be.false;
    expect(deriveState(payloadHome, propsCard).isSelected).to.be.false;
  });

  it('should select the crumb owning pathInnermost', () => {
    // pathInnermost is 'pageId' on a one-level route
    expect(deriveState(payloadAbout, propsPage).isSelected).to.be.true;
    expect(deriveState(payloadAbout, propsCard).isSelected).to.be.false;
  });

  it('should move selection to the deepest crumb as the route deepens', () => {
    expect(deriveState(payloadCardFlyingTech, propsPage).isSelected).to.be
      .false;
    expect(deriveState(payloadCardFlyingTech, propsCard).isSelected).to.be.true;
  });
});

describe('navBreadcrumbView$DeriveState — navLink', () => {
  it('should resolve no link when the crumb is hidden', () => {
    expect(deriveState(payloadHome, propsPage).navLink).to.be.undefined;
    expect(deriveState(payloadHome, propsCard).navLink).to.be.undefined;
  });

  it('should resolve the page link on a one-level route', () => {
    expect(deriveState(payloadAbout, propsPage).navLink.title).to.eq('ABOUT');
    expect(deriveState(payloadAbout, propsCard).navLink).to.be.undefined;
  });

  it('should resolve a link per level on a two-level route', () => {
    expect(deriveState(payloadCardFlyingTech, propsPage).navLink.title).to.eq(
      'FLYING CARS',
    );
    expect(deriveState(payloadCardFlyingTech, propsCard).navLink.title).to.eq(
      'FLYING TECH',
    );
  });
});

describe('navBreadcrumbView$DeriveState — three-level routes', () => {
  it('should show all three crumbs', () => {
    expect(deriveState(payloadDesignButtonPrimary, propsDesignPage).isVisible)
      .to.be.true;
    expect(deriveState(payloadDesignButtonPrimary, propsDesignTopic).isVisible)
      .to.be.true;
    expect(deriveState(payloadDesignButtonPrimary, propsDesignOption).isVisible)
      .to.be.true;
  });

  it('should mark the two ancestors active and the terminal crumb not', () => {
    expect(deriveState(payloadDesignButtonPrimary, propsDesignPage).isActive).to
      .be.true;
    expect(deriveState(payloadDesignButtonPrimary, propsDesignTopic).isActive)
      .to.be.true;
    expect(deriveState(payloadDesignButtonPrimary, propsDesignOption).isActive)
      .to.be.false;
  });

  it('should select only the innermost crumb', () => {
    expect(deriveState(payloadDesignButtonPrimary, propsDesignPage).isSelected)
      .to.be.false;
    expect(deriveState(payloadDesignButtonPrimary, propsDesignTopic).isSelected)
      .to.be.false;
    expect(
      deriveState(payloadDesignButtonPrimary, propsDesignOption).isSelected,
    ).to.be.true;
  });

  it('should resolve a link at each level', () => {
    expect(
      deriveState(payloadDesignButtonPrimary, propsDesignPage).navLink.title,
    ).to.eq('ELEMENTS');
    expect(
      deriveState(payloadDesignButtonPrimary, propsDesignTopic).navLink.title,
    ).to.eq('BUTTONS');
    expect(
      deriveState(payloadDesignButtonPrimary, propsDesignOption).navLink.title,
    ).to.eq('PRIMARY');
  });
});

describe('navBreadcrumbView$UpdateLink — only ancestor crumbs are live links', () => {
  // Drives the DOM-applying method against real elements, with the view
  // context it expects (props.el, el$, link$) supplied by hand.
  const makeCrumb = (props) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.dataset.channel = 'ROUTE';
    li.appendChild(a);

    const context = {
      props: {
        ...props,
        el: li,
        el$: { setClass: (className) => (li.className = className) },
        link$: { el: a },
      },
      navBreadcrumbView$DeriveState: (payload) =>
        NavBreadcrumbViewTraits.navBreadcrumbView$DeriveState(
          payload,
          context.props,
        ),
    };
    const update = (payload) =>
      NavBreadcrumbViewTraits.navBreadcrumbView$UpdateLink.call(context, {
        payload,
      });

    return { li, a, update };
  };

  it('should leave the current page crumb without an href on a one-level route', () => {
    const page = makeCrumb(propsPage);
    page.update(payloadAbout);

    expect(page.a.innerText).to.eq('ABOUT');
    expect(page.a.hasAttribute('href')).to.be.false;
    expect(page.li.classList.contains('breadcrumb-item--inactive')).to.be.true;
    expect(page.li.getAttribute('aria-current')).to.eq('page');
  });

  it('should link the ancestor and not the current page on a two-level route', () => {
    const page = makeCrumb(propsPage);
    const card = makeCrumb(propsCard);
    page.update(payloadCardFlyingTech);
    card.update(payloadCardFlyingTech);

    expect(page.a.hasAttribute('href')).to.be.true;
    expect(page.li.classList.contains('breadcrumb-item--active')).to.be.true;

    expect(card.a.innerText).to.eq('FLYING TECH');
    expect(card.a.hasAttribute('href')).to.be.false;
    expect(card.li.classList.contains('breadcrumb-item--inactive')).to.be.true;
  });

  it('should restore and drop the href as the route moves down and back up', () => {
    const page = makeCrumb(propsPage);

    page.update(payloadAbout);
    expect(page.a.hasAttribute('href')).to.be.false;

    page.update(payloadCardFlyingTech);
    expect(page.a.hasAttribute('href')).to.be.true;

    page.update(payloadAbout);
    expect(page.a.hasAttribute('href')).to.be.false;
  });

  it('should keep the anchor a dataset ROUTE link in every state', () => {
    const page = makeCrumb(propsPage);
    page.update(payloadAbout);
    expect(page.a.dataset.channel).to.eq('ROUTE');
    page.update(payloadCardFlyingTech);
    expect(page.a.dataset.channel).to.eq('ROUTE');
  });
});
