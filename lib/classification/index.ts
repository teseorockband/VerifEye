import type { LinkLevel, Relationship } from '@/lib/supabase/types';

/**
 * Link level priority — higher index = higher severity.
 * Used to determine the effective link level from multiple relationships.
 */
export const LINK_LEVEL_PRIORITY: Record<LinkLevel, number> = {
  none: 0,
  indirect: 1,
  direct: 2,
  produced_in_israel: 3,
  produced_in_settlements: 4,
};

/**
 * Returns the most severe link level from a list of relationships.
 * If no relationships are provided, returns 'none'.
 */
export function resolveEffectiveLinkLevel(
  relationships: Pick<Relationship, 'link_type'>[],
): LinkLevel {
  if (relationships.length === 0) return 'none';

  return relationships.reduce<LinkLevel>((current, rel) => {
    return LINK_LEVEL_PRIORITY[rel.link_type] > LINK_LEVEL_PRIORITY[current]
      ? rel.link_type
      : current;
  }, 'none');
}

/**
 * Returns the Tailwind color class pair for a given link level.
 */
export function getLinkLevelStyle(level: LinkLevel): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case 'none':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
    case 'indirect':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
    case 'direct':
      return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' };
    case 'produced_in_israel':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
    case 'produced_in_settlements':
      return { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-500' };
  }
}

/**
 * Returns true if a product with this link level should show an enhanced warning.
 */
export function requiresWarning(level: LinkLevel): boolean {
  return LINK_LEVEL_PRIORITY[level] >= LINK_LEVEL_PRIORITY['direct'];
}

/**
 * Validates that a relationship has a verifiable source.
 * Without a source, the relationship must not be published.
 */
export function hasVerifiableSource(
  relationship: Pick<Relationship, 'source_id'>,
): boolean {
  return !!relationship.source_id && relationship.source_id.trim().length > 0;
}

/**
 * Sorts relationships from most to least severe.
 */
export function sortRelationshipsBySeverity(
  relationships: Pick<Relationship, 'link_type'>[],
): typeof relationships {
  return [...relationships].sort(
    (a, b) => LINK_LEVEL_PRIORITY[b.link_type] - LINK_LEVEL_PRIORITY[a.link_type],
  );
}
