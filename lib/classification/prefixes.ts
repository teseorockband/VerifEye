/**
 * GS1 country prefixes assigned to Israel.
 * Any EAN starting with these prefixes is registered in Israel.
 * Source: GS1 General Specifications (public)
 */
export const ISRAEL_GS1_PREFIXES = ['729'];

/**
 * Returns true if the EAN was issued by GS1 Israel (prefix 729).
 * Note: this indicates the *registrant* is Israeli, not necessarily
 * the country of manufacture. It is a strong indicator but not proof
 * of production location.
 */
export function isIsraeliPrefix(ean: string): boolean {
  return ISRAEL_GS1_PREFIXES.some((prefix) => ean.startsWith(prefix));
}

/**
 * Returns a human-readable explanation of why the prefix indicates Israel.
 */
export function getIsraeliPrefixExplanation(ean: string): string {
  const prefix = ISRAEL_GS1_PREFIXES.find((p) => ean.startsWith(p));
  if (!prefix) return '';
  return `El código de barras comienza por ${prefix}, prefijo GS1 asignado a Israel. El producto está registrado por una empresa israelí. Fuente: GS1 General Specifications.`;
}
