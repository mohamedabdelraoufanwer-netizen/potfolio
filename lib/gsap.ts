'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase)
  CustomEase.create('cinematic', '0.16, 1, 0.3, 1')
  CustomEase.create('power4.inOut', '0.76, 0, 0.24, 1')
}

export { gsap, ScrollTrigger, CustomEase }
export default gsap
