// Shared animation primitives for the landing page.
// Keep all easing/duration decisions here so every section moves consistently.

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

/**
 * Returns a stagger container variant. Use on a parent motion element with
 * initial="hidden" and animate/whileInView="visible"; children using fadeUp
 * or scaleIn will animate in sequence.
 */
export function stagger(staggerChildren = 0.1, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}