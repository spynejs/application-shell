import { expect } from 'chai';
import { AppSettingsTraits } from '/src/app/traits/app/app-settings-traits.js';

const resolve = (v) => AppSettingsTraits.appSettings$ResolveTheme(v);
const next = (v) => AppSettingsTraits.appSettings$NextTheme(v);

describe('appSettings$ResolveTheme', () => {
  it('should keep dark as dark', () => {
    expect(resolve('dark')).to.eq('dark');
  });

  it('should keep light as light', () => {
    expect(resolve('light')).to.eq('light');
  });

  it('should conform the storageConfig default and unknown values to light', () => {
    // the CSS only knows [data-theme='dark']; everything else renders light
    expect(resolve('auto')).to.eq('light');
    expect(resolve(undefined)).to.eq('light');
    expect(resolve('')).to.eq('light');
  });
});

describe('appSettings$NextTheme', () => {
  it('should flip dark to light', () => {
    expect(next('dark')).to.eq('light');
  });

  it('should flip light to dark', () => {
    expect(next('light')).to.eq('dark');
  });

  it('should flip the first-visit default (auto) to dark', () => {
    // the first click must visibly change the page: auto renders light
    expect(next('auto')).to.eq('dark');
  });

  it('should round-trip', () => {
    expect(next(next('dark'))).to.eq('dark');
    expect(next(next('light'))).to.eq('light');
  });
});
