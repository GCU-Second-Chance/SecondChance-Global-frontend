import { Transition, Variants } from "framer-motion";

/**
 * Animation preset configuration
 */
export interface AnimationConfig {
  variants: Variants;
  initial?: string;
  animate?: string;
  exit?: string;
  transition?: Transition;
}

/**
 * Stagger configuration
 */
export interface StaggerConfig {
  staggerChildren?: number;
  delayChildren?: number;
}

/**
 * Direction types for slide animations
 */
export type SlideDirection = "up" | "down" | "left" | "right";

/**
 * Animation timing presets
 */
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

/**
 * Easing presets
 */
export const EASINGS = {
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
} as const;
