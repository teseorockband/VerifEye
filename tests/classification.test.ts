import { describe, it, expect } from 'vitest';
import {
  resolveEffectiveLinkLevel,
  getLinkLevelStyle,
  requiresWarning,
  hasVerifiableSource,
  sortRelationshipsBySeverity,
  LINK_LEVEL_PRIORITY,
} from '@/lib/classification';

describe('resolveEffectiveLinkLevel', () => {
  it('returns none for empty relationships', () => {
    expect(resolveEffectiveLinkLevel([])).toBe('none');
  });

  it('returns the single level when only one relationship', () => {
    expect(resolveEffectiveLinkLevel([{ link_type: 'indirect' }])).toBe('indirect');
    expect(resolveEffectiveLinkLevel([{ link_type: 'produced_in_settlements' }])).toBe('produced_in_settlements');
  });

  it('returns the highest severity when multiple relationships exist', () => {
    const rels = [
      { link_type: 'indirect' as const },
      { link_type: 'direct' as const },
      { link_type: 'none' as const },
    ];
    expect(resolveEffectiveLinkLevel(rels)).toBe('direct');
  });

  it('returns produced_in_settlements as the highest level', () => {
    const rels = [
      { link_type: 'produced_in_israel' as const },
      { link_type: 'produced_in_settlements' as const },
      { link_type: 'direct' as const },
    ];
    expect(resolveEffectiveLinkLevel(rels)).toBe('produced_in_settlements');
  });

  it('distinguishes produced_in_israel from produced_in_settlements', () => {
    expect(LINK_LEVEL_PRIORITY['produced_in_israel']).toBeLessThan(
      LINK_LEVEL_PRIORITY['produced_in_settlements'],
    );
  });
});

describe('getLinkLevelStyle', () => {
  it('returns green styles for none', () => {
    const style = getLinkLevelStyle('none');
    expect(style.bg).toContain('green');
    expect(style.text).toContain('green');
  });

  it('returns yellow styles for indirect', () => {
    const style = getLinkLevelStyle('indirect');
    expect(style.bg).toContain('yellow');
  });

  it('returns orange styles for direct', () => {
    const style = getLinkLevelStyle('direct');
    expect(style.bg).toContain('orange');
  });

  it('returns red styles for produced_in_israel', () => {
    const style = getLinkLevelStyle('produced_in_israel');
    expect(style.bg).toContain('red');
  });

  it('returns darker red for produced_in_settlements than for produced_in_israel', () => {
    const settlements = getLinkLevelStyle('produced_in_settlements');
    const israel = getLinkLevelStyle('produced_in_israel');
    expect(settlements.border).not.toBe(israel.border);
  });
});

describe('requiresWarning', () => {
  it('does not require warning for none and indirect', () => {
    expect(requiresWarning('none')).toBe(false);
    expect(requiresWarning('indirect')).toBe(false);
  });

  it('requires warning for direct and above', () => {
    expect(requiresWarning('direct')).toBe(true);
    expect(requiresWarning('produced_in_israel')).toBe(true);
    expect(requiresWarning('produced_in_settlements')).toBe(true);
  });
});

describe('hasVerifiableSource', () => {
  it('returns true when source_id is a non-empty string', () => {
    expect(hasVerifiableSource({ source_id: 'abc-123' })).toBe(true);
  });

  it('returns false when source_id is empty', () => {
    expect(hasVerifiableSource({ source_id: '' })).toBe(false);
    expect(hasVerifiableSource({ source_id: '   ' })).toBe(false);
  });

  it('returns false when source_id is null or undefined', () => {
    expect(hasVerifiableSource({ source_id: null as unknown as string })).toBe(false);
    expect(hasVerifiableSource({ source_id: undefined as unknown as string })).toBe(false);
  });
});

describe('sortRelationshipsBySeverity', () => {
  it('sorts from most to least severe', () => {
    const rels = [
      { link_type: 'none' as const },
      { link_type: 'produced_in_settlements' as const },
      { link_type: 'indirect' as const },
      { link_type: 'direct' as const },
    ];
    const sorted = sortRelationshipsBySeverity(rels);
    expect(sorted[0].link_type).toBe('produced_in_settlements');
    expect(sorted[1].link_type).toBe('direct');
    expect(sorted[2].link_type).toBe('indirect');
    expect(sorted[3].link_type).toBe('none');
  });

  it('does not mutate the original array', () => {
    const rels = [{ link_type: 'none' as const }, { link_type: 'direct' as const }];
    const sorted = sortRelationshipsBySeverity(rels);
    expect(rels[0].link_type).toBe('none'); // original unchanged
    expect(sorted[0].link_type).toBe('direct');
  });
});
