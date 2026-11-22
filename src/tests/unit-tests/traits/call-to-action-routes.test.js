import { expect } from 'chai';
import {
  contactRouteOf,
  isRouteOf,
  routeCallsToAction,
} from '/src/app/traits/utils/call-to-action-routes.js';

const form = { props: { template: 'contact-us.tmpl.html', data: {} } };
const hrefOf = ({ pageId, topicId }) =>
  topicId ? `/${pageId}/${topicId}` : `/${pageId}`;

// An app whose contact form is on a sub-page of About.
const appWithContactSubPage = () => ({
  content: [
    { pageId: 'home' },
    { pageId: 'classes', content: [{ topicId: 'boxing' }] },
    {
      pageId: 'about',
      content: [
        { topicId: 'coaches' },
        { pageId: 'about', topicId: 'contact-us', pageItems: [form] },
      ],
    },
  ],
});

// An app whose contact form is on the About page itself.
const appWithContactPage = () => ({
  content: [{ pageId: 'home' }, { pageId: 'about', pageItems: [form] }],
});

const heroOf = (hero, at = { pageId: 'home' }) => ({ ...at, hero });

describe('contactRouteOf', () => {
  it('should find the sub-page that holds the contact form', () => {
    expect(contactRouteOf(appWithContactSubPage())).to.deep.eq({
      pageId: 'about',
      topicId: 'contact-us',
    });
  });

  it('should find the page that holds it, where no sub-page does', () => {
    expect(contactRouteOf(appWithContactPage())).to.deep.eq({
      pageId: 'about',
      topicId: '',
    });
  });

  it('should be null for an app with no contact form', () => {
    expect(contactRouteOf({ content: [{ pageId: 'home' }] })).to.eq(null);
    expect(contactRouteOf(undefined)).to.eq(null);
  });
});

describe('isRouteOf', () => {
  const model = appWithContactSubPage();

  it('should know a page and a sub-page of the app', () => {
    expect(isRouteOf(model, 'classes')).to.eq(true);
    expect(isRouteOf(model, 'classes', 'boxing')).to.eq(true);
    expect(isRouteOf(model, 'home', '')).to.eq(true);
  });

  it('should not know what the app has not got', () => {
    expect(isRouteOf(model, 'booking')).to.eq(false);
    expect(isRouteOf(model, 'classes', 'yoga')).to.eq(false);
    expect(isRouteOf(model, '')).to.eq(false);
    expect(isRouteOf(model, undefined)).to.eq(false);
  });
});

describe('routeCallsToAction', () => {
  it('should leave a call to action that names a page of the app', () => {
    const node = heroOf({
      ctaText: 'See the classes',
      attrPageId: 'classes',
      attrTopicId: 'boxing',
      attrCtaHref: '/classes/boxing',
    });

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    expect(node.hero).to.deep.eq({
      ctaText: 'See the classes',
      attrPageId: 'classes',
      attrTopicId: 'boxing',
      attrCtaHref: '/classes/boxing',
    });
  });

  it('should send one that names nothing to the contact page', () => {
    const node = heroOf({ ctaText: 'Start today' });

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    expect(node.hero.attrPageId).to.eq('about');
    expect(node.hero.attrTopicId).to.eq('contact-us');
    expect(node.hero.attrCtaHref).to.eq('/about/contact-us');
    expect(node.hero.ctaText).to.eq('Start today');
  });

  it('should send one that names no page of the app to the contact page', () => {
    const node = heroOf({ ctaText: 'Book', attrPageId: 'booking' });

    routeCallsToAction(node, appWithContactPage(), hrefOf);

    expect(node.hero.attrPageId).to.eq('about');
    expect(node.hero.attrTopicId).to.eq('');
    expect(node.hero.attrCtaHref).to.eq('/about');
  });

  it('should keep the page where only the sub-page is not one', () => {
    const node = heroOf({
      ctaText: 'Classes',
      attrPageId: 'classes',
      attrTopicId: 'yoga',
    });

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    expect(node.hero.attrPageId).to.eq('classes');
    expect(node.hero.attrTopicId).to.eq('');
    expect(node.hero.attrCtaHref).to.eq('/classes');
  });

  it('should give one nowhere to go on the contact page itself', () => {
    const node = heroOf(
      { ctaText: 'Get in touch', attrPageId: 'booking' },
      { pageId: 'about', topicId: 'contact-us' },
    );

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    expect(node.hero.attrPageId).to.eq('');
    expect(node.hero.attrTopicId).to.eq('');
    expect(node.hero.attrCtaHref).to.eq('');
    // its words are the author's, and are not taken away
    expect(node.hero.ctaText).to.eq('Get in touch');
  });

  it('should give one nowhere to go in an app with no contact form', () => {
    const node = heroOf({ ctaText: 'Start today' });

    routeCallsToAction(node, { content: [{ pageId: 'home' }] }, hrefOf);

    expect(node.hero.attrPageId).to.eq('');
    expect(node.hero.attrCtaHref).to.eq('');
  });

  it('should leave a hero with no words for its button as it is', () => {
    const node = heroOf({ ctaText: '', headline: 'Welcome' });

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    expect(node.hero).to.deep.eq({ ctaText: '', headline: 'Welcome' });
  });

  it("should route a banner, and a split feature's rows by their own key", () => {
    const node = {
      pageId: 'home',
      pageItems: [
        { props: { data: { ctaText: 'Join', attrPageId: 'apply' } } },
        {
          props: {
            data: {
              rows: [
                {
                  ctaText: 'Classes',
                  attrPageId: 'classes',
                  ctaHref: '/classes',
                },
                { ctaText: 'Reserve', ctaHref: '' },
                { ctaText: '', ctaHref: '' },
              ],
            },
          },
        },
      ],
    };

    routeCallsToAction(node, appWithContactSubPage(), hrefOf);

    const [banner, split] = node.pageItems.map((item) => item.props.data);

    expect(banner.attrPageId).to.eq('about');
    expect(banner.attrCtaHref).to.eq('/about/contact-us');
    expect(split.rows[0]).to.deep.eq({
      ctaText: 'Classes',
      attrPageId: 'classes',
      ctaHref: '/classes',
    });
    expect(split.rows[1].attrPageId).to.eq('about');
    expect(split.rows[1].attrTopicId).to.eq('contact-us');
    expect(split.rows[1].ctaHref).to.eq('/about/contact-us');
    expect(split.rows[1].attrCtaHref).to.eq(undefined);
    expect(split.rows[2]).to.deep.eq({ ctaText: '', ctaHref: '' });
  });

  it('should not touch the contact form itself, or a page with nothing to route', () => {
    const node = {
      pageId: 'about',
      pageItems: [
        {
          props: {
            template: 'contact-us.tmpl.html',
            data: { ctaText: 'Send' },
          },
        },
      ],
    };

    routeCallsToAction(node, appWithContactPage(), hrefOf);

    expect(node.pageItems[0].props.data).to.deep.eq({ ctaText: 'Send' });
    expect(routeCallsToAction({}, appWithContactPage(), hrefOf)).to.deep.eq({});
  });
});
