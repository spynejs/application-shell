import { expect } from 'chai';
import { DomElementTemplate, SpyneApp } from 'spyne';
import IconGridTmpl from '/src/app/components/page-items/templates/icon-grid.tmpl.html';
import { ICON_SHAPES } from '/src/app/traits/utils/icon-shapes.js';
import { PageItemCoreTraits } from '/src/app/traits/page/page-item-core-traits.js';

// The icon grid: a template and the data it is given, after the page-item core has
// put each icon's shape beside its name. What is held here is what the template
// draws from that data.

// A template is drawn through the app's sanitizer, which the app sets up as it
// starts.
before(() => {
  SpyneApp.init({ debug: false });
});

const render = (data) => {
  const el = document.createElement('div');
  const shaped = PageItemCoreTraits.pageItemCore$PlaceIcons(data);

  el.appendChild(new DomElementTemplate(IconGridTmpl, shaped).renderDocFrag());

  return el;
};

const textOf = (el, selector) =>
  [...el.querySelectorAll(selector)].map((node) => node.textContent.trim());

describe('icon grid page item', () => {
  const data = {
    title: 'Why riders come back',
    subtitle: 'A small workshop that does the job properly.',
    items: [
      {
        icon: 'build',
        name: 'Repairs while you wait',
        text: 'Most punctures and brake jobs are done within the hour.',
      },
      {
        icon: 'verified',
        name: 'Work guaranteed',
        text: 'Every repair is covered for ninety days.',
      },
      {
        icon: 'directions_bike',
        name: 'Loan bikes',
        text: 'Borrow one of ours while yours is in the stand.',
      },
    ],
    ctaText: 'See our services',
    attrPageId: 'services',
    attrTopicId: '',
    attrCtaHref: '/services',
  };

  it('should draw an item for each thing, in order, with its name and its line', () => {
    const el = render(data);

    expect(el.querySelectorAll('.icon-grid-item').length).to.eq(3);
    expect(textOf(el, '.icon-grid-name')).to.deep.eq([
      'Repairs while you wait',
      'Work guaranteed',
      'Loan bikes',
    ]);
    expect(textOf(el, '.icon-grid-text')).to.deep.eq([
      'Most punctures and brake jobs are done within the hour.',
      'Every repair is covered for ninety days.',
      'Borrow one of ours while yours is in the stand.',
    ]);
  });

  it('should draw each item’s icon as the shape of the name it was given', () => {
    const el = render(data);
    const shapes = [...el.querySelectorAll('.icon-grid-icon path')].map(
      (path) => path.getAttribute('d'),
    );

    expect(shapes).to.deep.eq([
      ICON_SHAPES.build,
      ICON_SHAPES.verified,
      ICON_SHAPES.directions_bike,
    ]);
  });

  it('should draw an icon in Google’s box, as an icon, hidden from assistive technology', () => {
    const el = render(data);

    el.querySelectorAll('.icon-grid-icon').forEach((svg) => {
      expect(svg.getAttribute('viewBox')).to.eq('0 -960 960 960');
      expect(svg.classList.contains('icon')).to.be.true;
      expect(svg.getAttribute('aria-hidden')).to.eq('true');
    });
  });

  it('should draw nothing in the icon of a name that is not in the set', () => {
    const el = render({
      ...data,
      items: [{ icon: 'no_such_icon', name: 'A name', text: 'A line.' }],
    });

    expect(
      el.querySelector('.icon-grid-icon path').getAttribute('d') ?? '',
    ).to.eq('');
    expect(textOf(el, '.icon-grid-name')).to.deep.eq(['A name']);
  });

  it('should draw its title and subtitle, and leave an absent subtitle empty', () => {
    const el = render(data);

    expect(textOf(el, '.icon-grid-title')).to.deep.eq(['Why riders come back']);
    expect(textOf(el, '.icon-grid-subtitle')).to.deep.eq([
      'A small workshop that does the job properly.',
    ]);
    expect(
      textOf(render({ ...data, subtitle: '' }), '.icon-grid-subtitle'),
    ).to.deep.eq(['']);
  });

  it('should make its button a route link to the page its data names', () => {
    const el = render(data);
    const { channel, eventPreventDefault, pageId, topicId, endRoute } =
      el.querySelector('.icon-grid-cta').dataset;

    expect({
      channel,
      eventPreventDefault,
      pageId,
      topicId,
      endRoute,
    }).to.deep.eq({
      channel: 'ROUTE',
      eventPreventDefault: 'true',
      pageId: 'services',
      topicId: '',
      endRoute: 'true',
    });
    expect(textOf(el, '.icon-grid-cta')).to.deep.eq(['See our services']);
    expect(el.querySelector('.icon-grid-cta').getAttribute('href')).to.eq(
      '/services',
    );
  });

  it('should give a button with nowhere to go an empty page id, which is not drawn', () => {
    const el = render({
      ...data,
      ctaText: '',
      attrPageId: '',
      attrTopicId: '',
      attrCtaHref: '',
    });

    expect(el.querySelector('.icon-grid-cta').dataset.pageId).to.eq('');
    expect(el.querySelector('.icon-grid-cta').classList.contains('btn')).to.be
      .true;
  });
});
