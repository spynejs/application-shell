import { expect } from 'chai';
import {
  ICON_SHAPES,
  ICON_VIEW_BOX,
} from '/src/app/traits/utils/icon-shapes.js';
import { iconPath, hasIcon } from '/src/app/traits/utils/icons.js';
import { PageItemCoreTraits } from '/src/app/traits/page/page-item-core-traits.js';

const placeIcons = (data) => PageItemCoreTraits.pageItemCore$PlaceIcons(data);

describe('ICON_SHAPES', () => {
  it('should hold the set of 73', () => {
    expect(Object.keys(ICON_SHAPES)).to.have.lengthOf(73);
  });

  it('should give every name a shape that is path data and nothing else', () => {
    Object.entries(ICON_SHAPES).forEach(([name, shape]) => {
      expect(name).to.match(/^[a-z][a-z0-9_]*$/);
      expect(shape, name).to.match(/^[Mm][MmZzLlHhVvCcSsQqTtAa0-9 .,-]+$/);
    });
  });

  it('should hold the two icons the header already draws', () => {
    expect(ICON_SHAPES).to.include.keys('light_mode', 'dark_mode');
  });

  it('should not be changed by the code that reads it', () => {
    expect(Object.isFrozen(ICON_SHAPES)).to.eq(true);
  });

  it('should draw in the box Google draws its symbols in', () => {
    expect(ICON_VIEW_BOX).to.eq('0 -960 960 960');
  });
});

describe('iconPath', () => {
  it('should give the shape of an icon in the set', () => {
    expect(iconPath('schedule')).to.eq(ICON_SHAPES.schedule);
    expect(hasIcon('schedule')).to.eq(true);
  });

  it('should give an empty path for a name that is not in the set', () => {
    expect(iconPath('no_such_icon')).to.eq('');
    expect(hasIcon('no_such_icon')).to.eq(false);
  });

  it('should give an empty path for what every object has, and for what is not a name', () => {
    expect(iconPath('constructor')).to.eq('');
    expect(iconPath('toString')).to.eq('');
    expect(iconPath(undefined)).to.eq('');
    expect(iconPath(null)).to.eq('');
    expect(iconPath(7)).to.eq('');
    expect(iconPath('')).to.eq('');
  });
});

describe('pageItemCore$PlaceIcons', () => {
  it('should put a shape beside the icon of each item of a list', () => {
    const shaped = placeIcons({
      title: 'Why riders come back',
      items: [
        { icon: 'build', name: 'Repairs while you wait' },
        { icon: 'verified', name: 'Work guaranteed' },
      ],
    });

    expect(shaped.items.map((item) => item.attrIconPath)).to.deep.eq([
      ICON_SHAPES.build,
      ICON_SHAPES.verified,
    ]);
  });

  it('should put a shape beside an icon the data itself names', () => {
    const shaped = placeIcons({ icon: 'call', label: 'Call us' });

    expect(shaped.attrIconPath).to.eq(ICON_SHAPES.call);
  });

  it('should leave the authored keys as they are', () => {
    const data = {
      title: 'Find us',
      items: [{ icon: 'location_on', name: 'Astoria', text: 'By the park.' }],
    };
    const shaped = placeIcons(data);

    expect(shaped.title).to.eq('Find us');
    expect(shaped.items[0]).to.include({
      icon: 'location_on',
      name: 'Astoria',
      text: 'By the park.',
    });
    expect(data.items[0]).to.not.have.property('attrIconPath');
  });

  it('should give a name that is not in the set an empty path', () => {
    const shaped = placeIcons({
      items: [{ icon: 'no_such_icon', name: 'Nothing to draw' }],
    });

    expect(shaped.items[0].attrIconPath).to.eq('');
  });

  it('should give an item of a list no path where it names no icon', () => {
    const shaped = placeIcons({
      items: [{ icon: 'eco', name: 'Low waste' }, { name: 'No icon here' }],
    });

    expect(shaped.items[0].attrIconPath).to.eq(ICON_SHAPES.eco);
    expect(shaped.items[1]).to.not.have.property('attrIconPath');
  });

  it('should hand back data that names no icon as it came', () => {
    const data = {
      title: 'Weekly classes',
      rows: [{ when: 'Monday, 6:30am', name: 'Fundamentals' }],
      paragraphs: ['One.', 'Two.'],
    };

    expect(placeIcons(data)).to.eq(data);
  });

  it('should hand back what is not data as it came', () => {
    expect(placeIcons(undefined)).to.eq(undefined);
    expect(placeIcons(null)).to.eq(null);
    expect(placeIcons('words')).to.eq('words');
  });
});
