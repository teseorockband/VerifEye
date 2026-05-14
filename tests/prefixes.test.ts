import { describe, it, expect } from 'vitest';
import { isIsraeliPrefix, getIsraeliPrefixExplanation } from '@/lib/classification/prefixes';

describe('isIsraeliPrefix', () => {
  it('detects EANs starting with 729 as Israeli', () => {
    expect(isIsraeliPrefix('7290101342036')).toBe(true);
    expect(isIsraeliPrefix('7291234567890')).toBe(true);
    expect(isIsraeliPrefix('729')).toBe(true);
  });

  it('returns false for non-Israeli prefixes', () => {
    expect(isIsraeliPrefix('8410376043440')).toBe(false); // Spain (841)
    expect(isIsraeliPrefix('4056489112137')).toBe(false); // Germany (400-440)
    expect(isIsraeliPrefix('5000112637922')).toBe(false); // UK (500-509)
    expect(isIsraeliPrefix('8000500037560')).toBe(false); // Italy (800-839)
  });

  it('returns false for empty string', () => {
    expect(isIsraeliPrefix('')).toBe(false);
  });
});

describe('getIsraeliPrefixExplanation', () => {
  it('returns explanation for Israeli EAN', () => {
    const explanation = getIsraeliPrefixExplanation('7290101342036');
    expect(explanation).toContain('729');
    expect(explanation).toContain('GS1');
    expect(explanation).toContain('Israel');
  });

  it('returns empty string for non-Israeli EAN', () => {
    expect(getIsraeliPrefixExplanation('8410376043440')).toBe('');
  });
});
