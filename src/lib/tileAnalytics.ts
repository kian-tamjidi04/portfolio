import { trackEvent } from '../utils/analytics';

/**
 * GA4 labels per tile. Deliberately separate from the card's `label`/`title`
 * copy so analytics dimensions stay stable if the visible wording changes.
 */
const TILE_METADATA: Record<string, { tile_name: string; tile_category: string }> = {
  about: { tile_name: 'About Me', tile_category: 'cta' },
  social: { tile_name: 'Social Links', tile_category: 'social' },
  experience: { tile_name: 'Experience', tile_category: 'cta' },
  education: { tile_name: 'Education', tile_category: 'cta' },
  certifications: { tile_name: 'Certifications', tile_category: 'cta' },
  skills: { tile_name: 'Skills', tile_category: 'cta' },
  projects: { tile_name: 'Projects', tile_category: 'project' },
  vision: { tile_name: 'Vision', tile_category: 'cta' },
};

export function trackTileClick(cardId: string) {
  const meta = TILE_METADATA[cardId];
  if (meta) trackEvent('tile_click', meta);
}
