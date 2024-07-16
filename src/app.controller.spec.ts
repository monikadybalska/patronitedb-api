import { parseNumber } from './lib/utils';

describe('Number parsing', () => {
  it('should parse correctly', () => {
    expect(parseNumber('7112')).toBe(7112);
    expect(parseNumber('112430 zł')).toBe(112430);
    expect(parseNumber('4.23 mln zł')).toBe(4230000);
    expect(parseNumber('40 mln zł')).toBe(40000000);
    expect(parseNumber('197 tys. zł')).toBe(197000);
    expect(parseNumber('')).toBe(-1);
  });
});
