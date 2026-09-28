'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Html } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingBrowserProps {
  /** URL loaded inside the iframe preview */
  url: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  /** Accent strip colour — defaults to portfolio gold */
  accentColor?: string
}

// Physical browser dimensions (Three.js units)
const W      = 3.6   // total width
const H      = 2.4   // total height
const D      = 0.08  // depth / thickness
const BAR_H  = 0.22  // top-bar height
const SCREEN_H = H - BAR_H - 0.08  // viewport height

export default function FloatingBrowser({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  accentColor = '#c8a97e',
}: FloatingBrowserProps) {
  const groupRef = useRef<THREE.Group>(null)
  const initY    = useRef(position[1])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y =
      initY.current + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.08
  })

  const trafficLights: [string, number][] = [
    ['#ff5f57', -W / 2 + 0.22],
    ['#febc2e', -W / 2 + 0.34],
    ['#28c840', -W / 2 + 0.46],
  ]

  const screenTop    = H / 2 - BAR_H - 0.04
  const screenCenterY = screenTop - SCREEN_H / 2

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>

      {/* Browser body */}
      <RoundedBox args={[W, H, D]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#141415" metalness={0.4} roughness={0.6} />
      </RoundedBox>

      {/* Top bar */}
      <mesh position={[0, H / 2 - BAR_H / 2, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.04, BAR_H]} />
        <meshStandardMaterial color="#0d0d0f" />
      </mesh>

      {/* Traffic lights */}
      {trafficLights.map(([color, x], i) => (
        <mesh key={i} position={[x, H / 2 - BAR_H / 2, D / 2 + 0.005]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* URL / address bar */}
      <RoundedBox
        args={[2.0, 0.14, 0.01]}
        radius={0.025}
        smoothness={2}
        position={[0.15, H / 2 - BAR_H / 2, D / 2 + 0.01]}
      >
        <meshStandardMaterial color="#1f1f21" />
      </RoundedBox>

      {/* Screen / viewport */}
      <mesh position={[0, screenCenterY, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.04, SCREEN_H]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      {/* Live iframe preview via Html portal */}
      <Html
        position={[0, screenCenterY, D / 2 + 0.01]}
        transform
        distanceFactor={3}
        style={{
          width:         '480px',
          height:        `${Math.round((SCREEN_H / W) * 480)}px`,
          overflow:      'hidden',
          borderRadius:  '2px',
          pointerEvents: 'none',
          background:    '#090909',
        }}
        zIndexRange={[1, 2]}
      >
        <iframe
          src={url}
          width={1440}
          height={900}
          style={{
            transform:       'scale(0.333)',
            transformOrigin: 'top left',
            border:          'none',
            pointerEvents:   'none',
          }}
          title="Project preview"
          sandbox="allow-same-origin"
        />
      </Html>

      {/* Accent bottom strip */}
      <mesh position={[0, -H / 2 + 0.013, D / 2 + 0.002]}>
        <planeGeometry args={[W - 0.04, 0.025]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* Subtle backlight */}
      <pointLight
        position={[0, 0, -D]}
        intensity={0.4}
        color={accentColor}
        distance={2}
        decay={2}
      />
    </group>
  )
}
