import { cubicBezier, type Variants } from 'framer-motion';

/**
 * Single source of truth for the motion system.
 *
 * Previously these values were spread across App.tsx and index.css, with the
 * same Material "standard" curve written four different ways (`cubicBezier(...)`,
 * the raw `[0.4, 0, 0.2, 1]` array, and twice inline in CSS). Keep new
 * transitions pointing here — see DESIGN_SYSTEM.md §7.
 */

/* ─── Easing ─────────────────────────────────────────────────────── */
export const EASE_STANDARD = cubicBezier(0.4, 0, 0.2, 1);
export const EASE_EMPHASIZED = cubicBezier(0.2, 0, 0, 1);

/* ─── Durations (seconds) ────────────────────────────────────────── */
export const FLIP_DURATION = 0.58;
export const FLIP_EASE = EASE_STANDARD;
export const CONTENT_REVEAL_DELAY = 0.24; // starts during card expansion
export const CONTENT_STAGGER = 0.08;
export const SCRIM_DURATION = 0.22;
export const COLLAPSE_DURATION = 0.3; // accordions, cert takeaway reveal

export const flipTransition = { duration: FLIP_DURATION, ease: FLIP_EASE } as const;

/**
 * Once the opening flip has landed, height/top stop easing on their own and
 * instead track the measured content exactly, frame by frame — a section
 * that animates its own height (the education timeline) is already easing,
 * and re-easing that a second time here made the modal trail its contents.
 */
export const flipLandedTransition = {
  default: flipTransition,
  height: { duration: 0 },
  top: { duration: 0 },
} as const;

/* ─── Variants ───────────────────────────────────────────────────── */

/** Grid tiles fading up on first paint. */
export const gridContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_STANDARD } },
};

/** Modal body sections revealing in sequence once the flip is underway. */
export const modalBodyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: CONTENT_STAGGER } },
};

export const modalItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASE_EMPHASIZED },
  },
};

/** How long one timeline step takes, shared by the entry slide and
 *  the stage's height change so they land together. Matches `--dur-slow`. */
export const TIMELINE_STEP_DURATION = 0.45;

export const timelineStepTransition = {
  duration: TIMELINE_STEP_DURATION,
  ease: EASE_STANDARD,
} as const;

/**
 * Timeline entries sliding as a filmstrip: the outgoing entry is pushed out
 * of frame in the direction of travel while the incoming one arrives from the
 * opposite edge. `custom` carries the step direction: +1 moving forward
 * through the timeline, -1 moving back.
 *
 * The vertical variant pushes along the y axis to match the timeline running
 * down the left-hand side — stepping forward sends the outgoing entry up and
 * brings the incoming one in from below. Offsets are percentages of the
 * entry's own height, so the push always clears the frame however tall the
 * entry is.
 */
export const timelineEntryVariants: Variants = {
  hidden: (direction: number) => ({ opacity: 0, y: direction >= 0 ? '100%' : '-100%' }),
  visible: { opacity: 1, y: '0%', transition: timelineStepTransition },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction >= 0 ? '-100%' : '100%',
    transition: timelineStepTransition,
  }),
};

/** Project detail pane, re-running on every project switch. */
export const projectContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const projectItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
};

/** Height-collapse used by the accordions and the cert hover reveal. */
export const collapseTransition = {
  duration: COLLAPSE_DURATION,
  ease: EASE_STANDARD,
} as const;
