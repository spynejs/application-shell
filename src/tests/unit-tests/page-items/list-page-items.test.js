import { expect } from 'chai';
import { DomElementTemplate, SpyneApp } from 'spyne';
import TimetableTmpl from '/src/app/components/page-items/templates/timetable.tmpl.html';
import PriceListTmpl from '/src/app/components/page-items/templates/price-list.tmpl.html';

// The two page items that are lists of rows: a timetable and a price list. Each is
// a template and the data it is given, nothing else, so what is held here is what
// the template draws from that data.

// A template is drawn through the app's sanitizer, which the app sets up as it
// starts.
before(() => {
  SpyneApp.init({ debug: false });
});

const render = (template, data) => {
  const el = document.createElement('div');

  el.appendChild(new DomElementTemplate(template, data).renderDocFrag());

  return el;
};

const textOf = (el, selector) =>
  [...el.querySelectorAll(selector)].map((node) => node.textContent.trim());

const buttonOf = (el, selector) => {
  const { channel, eventPreventDefault, pageId, topicId, endRoute } =
    el.querySelector(selector).dataset;

  return { channel, eventPreventDefault, pageId, topicId, endRoute };
};

describe('timetable page item', () => {
  const data = {
    title: 'Weekly classes',
    subtitle: 'All classes run 60 minutes.',
    rows: [
      {
        when: 'Monday, 6:30am',
        name: 'Fundamentals',
        detail: 'All levels',
        note: 'Drop-in $20',
      },
      {
        when: 'Every Saturday, 9am–12pm',
        name: 'Open sparring',
        detail: '',
        note: '',
      },
    ],
    footnote: 'No classes on public holidays.',
    ctaText: 'Book a class',
    attrPageId: 'about',
    attrTopicId: 'contact-us',
    attrCtaHref: '/about/contact-us',
  };

  it('should draw a row for each session, in order', () => {
    const el = render(TimetableTmpl, data);

    expect(el.querySelectorAll('.timetable-row').length).to.eq(2);
    expect(textOf(el, '.timetable-when')).to.deep.eq([
      'Monday, 6:30am',
      'Every Saturday, 9am–12pm',
    ]);
    expect(textOf(el, '.timetable-name')).to.deep.eq([
      'Fundamentals',
      'Open sparring',
    ]);
  });

  it('should leave the words a row does not have empty, not left out', () => {
    const el = render(TimetableTmpl, data);

    expect(textOf(el, '.timetable-detail')).to.deep.eq(['All levels', '']);
    expect(textOf(el, '.timetable-note')).to.deep.eq(['Drop-in $20', '']);
  });

  it('should draw its title, subtitle and footnote', () => {
    const el = render(TimetableTmpl, data);

    expect(textOf(el, '.timetable-title')).to.deep.eq(['Weekly classes']);
    expect(textOf(el, '.timetable-subtitle')).to.deep.eq([
      'All classes run 60 minutes.',
    ]);
    expect(textOf(el, '.timetable-footnote')).to.deep.eq([
      'No classes on public holidays.',
    ]);
  });

  it('should make its button a route link to the page its data names', () => {
    const el = render(TimetableTmpl, data);

    expect(buttonOf(el, '.timetable-cta')).to.deep.eq({
      channel: 'ROUTE',
      eventPreventDefault: 'true',
      pageId: 'about',
      topicId: 'contact-us',
      endRoute: 'true',
    });
    expect(textOf(el, '.timetable-cta')).to.deep.eq(['Book a class']);
    expect(el.querySelector('.timetable-cta').getAttribute('href')).to.eq(
      '/about/contact-us',
    );
  });

  it('should give a button with nowhere to go an empty page id, which is not drawn', () => {
    const el = render(TimetableTmpl, {
      ...data,
      ctaText: '',
      attrPageId: '',
      attrTopicId: '',
      attrCtaHref: '',
    });

    expect(el.querySelector('.timetable-cta').dataset.pageId).to.eq('');
    expect(el.querySelector('.timetable-cta').classList.contains('btn')).to.be
      .true;
  });
});

describe('price list page item', () => {
  const data = {
    title: 'Workshop services',
    subtitle: 'Parts are extra.',
    items: [
      {
        name: 'Full tune-up',
        desc: 'Gears, brakes, wheels trued.',
        price: '$85',
        unit: '',
      },
      { name: 'Wheel build', desc: '', price: 'from $60', unit: 'per wheel' },
      { name: 'Puncture repair', desc: '', price: '$12', unit: '' },
    ],
    footnote: 'Prices include tax.',
    ctaText: 'Book a repair',
    attrPageId: 'contact',
    attrTopicId: '',
    attrCtaHref: '/contact',
  };

  it('should draw an item for each thing with a price, in order', () => {
    const el = render(PriceListTmpl, data);

    expect(el.querySelectorAll('.price-list-item').length).to.eq(3);
    expect(textOf(el, '.price-list-name')).to.deep.eq([
      'Full tune-up',
      'Wheel build',
      'Puncture repair',
    ]);
    expect(textOf(el, '.price-list-price')).to.deep.eq([
      '$85',
      'from $60',
      '$12',
    ]);
  });

  it('should leave the words an item does not have empty, not left out', () => {
    const el = render(PriceListTmpl, data);

    expect(textOf(el, '.price-list-desc')).to.deep.eq([
      'Gears, brakes, wheels trued.',
      '',
      '',
    ]);
    expect(textOf(el, '.price-list-unit')).to.deep.eq(['', 'per wheel', '']);
  });

  it('should draw its title, subtitle and footnote', () => {
    const el = render(PriceListTmpl, data);

    expect(textOf(el, '.price-list-title')).to.deep.eq(['Workshop services']);
    expect(textOf(el, '.price-list-subtitle')).to.deep.eq(['Parts are extra.']);
    expect(textOf(el, '.price-list-footnote')).to.deep.eq([
      'Prices include tax.',
    ]);
  });

  it('should make its button a route link to the page its data names', () => {
    const el = render(PriceListTmpl, data);

    expect(buttonOf(el, '.price-list-cta')).to.deep.eq({
      channel: 'ROUTE',
      eventPreventDefault: 'true',
      pageId: 'contact',
      topicId: '',
      endRoute: 'true',
    });
    expect(textOf(el, '.price-list-cta')).to.deep.eq(['Book a repair']);
    expect(el.querySelector('.price-list-cta').getAttribute('href')).to.eq(
      '/contact',
    );
  });
});
