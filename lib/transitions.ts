'use client'

import { gsap } from '@/lib/gsap'

export function createProjectTransition(
  overlay: HTMLElement,
  onComplete: () => void
) {
  const tl = gsap.timeline({
    onComplete,
  })

  tl.set(overlay, { opacity: 0, display: 'flex' })
    .to(overlay, {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.inOut',
    })
    .to(overlay, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.1,
    })

  return tl
}

export function createPageEnterTransition(elements: HTMLElement[]) {
  const tl = gsap.timeline()

  tl.from(elements, {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
  })

  return tl
}

export function createTextReveal(chars: HTMLElement[]) {
  return gsap.from(chars, {
    yPercent: 110,
    opacity: 0,
    duration: 0.9,
    stagger: 0.015,
    ease: 'power4.out',
  })
}
