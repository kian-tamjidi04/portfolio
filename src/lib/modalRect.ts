import type { CardType } from '../content';

/** Gap left between the modal and the viewport edge, per side. */
const VIEWPORT_PADDING = 42;

interface ModalSizing {
  maxWidth: number;
  maxHeight: number;
  /**
   * When true the modal always uses its full computed height instead of
   * shrinking to fit its content. The projects modal needs this because its
   * split view is internally scrollable.
   */
  fillsHeight: boolean;
}

const DEFAULT_SIZING: ModalSizing = { maxWidth: 900, maxHeight: 760, fillsHeight: false };

/**
 * Per-type modal bounds. Previously inlined as a chain of ternaries plus a
 * separate `card.type === 'projects'` check in three other places.
 */
const MODAL_SIZING: Partial<Record<CardType, ModalSizing>> = {
  // Figma nodes 168:4442 and 168:269 both draw the projects modal at 1023px.
  // It used to take the grid's full 1320px because the old split view needed
  // the width for a sidebar beside the detail pane; with the deck that reason
  // is gone, and 1320 stretched the index cards to ~408px against a designed
  // 309px. Every width here stays under `.portfolio-grid-surface`'s own
  // 1320px, so a modal is still never wider than the grid it flew out of
  // (DESIGN_SYSTEM.md F20).
  projects: { maxWidth: 1023, maxHeight: 640, fillsHeight: true },
  about: { maxWidth: 1300, maxHeight: Infinity, fillsHeight: false },
};

export function getModalSizing(type?: CardType): ModalSizing {
  return (type && MODAL_SIZING[type]) || DEFAULT_SIZING;
}

export interface ModalRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function getModalRect(type?: CardType): ModalRect {
  const { maxWidth, maxHeight } = getModalSizing(type);
  const width = Math.min(maxWidth, window.innerWidth - VIEWPORT_PADDING * 2);
  const height = Math.min(maxHeight, window.innerHeight - VIEWPORT_PADDING * 2);
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
}
