/**
 * DETERMINISTIC COVER GRADIENTS FOR 30 UNIVERSITIES
 * Pure algorithm based on university code hash.
 */

export interface CoverGradient {
  from: string;
  to: string;
  accent: string;
  watermark: string;
}

export const UNI_COVER_GRADIENTS: CoverGradient[] = [
  { from: '#1E1B4B', to: '#4338CA', accent: '#818CF8', watermark: 'INDIGO' }, // Indigo Deep
  { from: '#022C22', to: '#059669', accent: '#34D399', watermark: 'EMERALD' }, // Emerald Forest (PXU)
  { from: '#0B1120', to: '#1D4ED8', accent: '#60A5FA', watermark: 'NAVY' }, // Navy Electric
  { from: '#3B0764', to: '#9333EA', accent: '#C084FC', watermark: 'PURPLE' }, // Purple Glow
  { from: '#4C0519', to: '#E11D48', accent: '#FB7185', watermark: 'ROSE' }, // Crimson Rose
  { from: '#042F2E', to: '#0D9488', accent: '#2DD4BF', watermark: 'TEAL' }, // Teal Aurora
  { from: '#431407', to: '#EA580C', accent: '#FB923C', watermark: 'AMBER' }, // Amber Fire
  { from: '#0F172A', to: '#0284C7', accent: '#38BDF8', watermark: 'CYAN' }, // Slate Cyan
];

export function getUniCoverGradient(code: string): CoverGradient {
  const clean = (code || '').toUpperCase().trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) & 0xffffffff;
  }
  const idx = Math.abs(hash) % UNI_COVER_GRADIENTS.length;
  return UNI_COVER_GRADIENTS[idx];
}
