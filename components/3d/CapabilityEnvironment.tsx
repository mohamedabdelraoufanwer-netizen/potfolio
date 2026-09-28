'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface CapabilityEnvironmentProps {
  /** One of: 'creative' | 'frontend' | 'motion' | 'threed' | 'backend' | 'cms' */
  activeCapability: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// DesignOrbs — Creative Direction
// Smooth gradient spheres orbiting a central attractor
// ─────────────────────────────────────────────────────────────────────────────
function DesignOrbs() {
  const ORBS = [
    { speed: 0.5, float: 0.8, r: 0.19, color: '#c8a97e', emissive: 0.25 },
    { speed: 0.8, float: 0.6, r: 0.12, color: '#bf9b7c', emissive: 0.18 },
    { speed: 0.6, float: 1.0, r: 0.15, color: '#d4b896', emissive: 0.20 },
    { speed: 1.0, float: 0.7, r: 0.09, color: '#c8a97e', emissive: 0.30 },
    { speed: 0.4, float: 0.9, r: 0.22, color: '#a88060', emissive: 0.15 },
  ]
  return (
    <group>
      {ORBS.map((o, i) => (
        <Float key={i} speed={o.speed} floatIntensity={o.float} rotationIntensity={0.2}>
          <mesh
            position={[
              Math.cos((i / ORBS.length) * Math.PI * 2) * 2.5,
              Math.sin((i / ORBS.length) * Math.PI * 2) * 1.5,
              -2,
            ]}
          >
            <sphereGeometry args={[o.r, 32, 32]} />
            <meshStandardMaterial
              color={o.color}
              metalness={0.1}
              roughness={0.3}
              emissive={o.color}
              emissiveIntensity={o.emissive}
            />
          </mesh>
        </Float>
      ))}
      {/* Central attractor */}
      <Float speed={0.3} floatIntensity={0.2}>
        <mesh position={[0, 0, -2.5]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#c8a97e" emissive="#c8a97e" emissiveIntensity={0.8} />
        </mesh>
      </Float>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CodeOrbs — Frontend Development
// Layered code-line blocks — syntax-highlighted editor excerpt
// ─────────────────────────────────────────────────────────────────────────────
function CodeOrbs() {
  const LINES = [
    { x: -2.0, y:  0.85, w: 0.55, color: '#c8a97e' },
    { x: -1.4, y:  0.85, w: 0.90, color: '#7c9cbf' },
    { x: -1.6, y:  0.67, w: 1.20, color: '#7c9cbf' },
    { x: -1.8, y:  0.49, w: 0.70, color: '#c8a97e' },
    { x: -1.2, y:  0.49, w: 0.85, color: '#9b7cbf' },
    { x: -1.6, y:  0.31, w: 1.00, color: '#2e2e32' },
    { x: -2.0, y:  0.13, w: 0.40, color: '#c8a97e' },
    { x: -1.5, y:  0.13, w: 0.60, color: '#7c9cbf' },
    { x:  1.4, y: -0.25, w: 0.70, color: '#c8a97e' },
    { x:  2.0, y: -0.45, w: 1.10, color: '#7c9cbf' },
    { x:  1.7, y: -0.65, w: 0.80, color: '#9b7cbf' },
    { x:  1.4, y: -0.85, w: 1.30, color: '#2e2e32' },
  ]
  return (
    <group>
      {LINES.map((l, i) => (
        <Float key={i} speed={0.3 + (i % 3) * 0.1} floatIntensity={0.15} rotationIntensity={0}>
          <mesh position={[l.x + l.w / 2, l.y, -2]}>
            <boxGeometry args={[l.w, 0.07, 0.04]} />
            <meshStandardMaterial
              color={l.color}
              emissive={l.color}
              emissiveIntensity={l.color === '#2e2e32' ? 0 : 0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MotionOrbs — Motion Design
// Particles tracing Lissajous-like parametric paths
// ─────────────────────────────────────────────────────────────────────────────
function MotionOrbs() {
  const COUNT = 8
  const trailRef = useRef<THREE.Group>(null)

  const params = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      ax:    1.8 + (i % 3) * 0.4,
      ay:    1.1 + (i % 2) * 0.5,
      fx:    0.4 + i * 0.08,
      fy:    0.3 + i * 0.06,
      phase: (i / COUNT) * Math.PI * 2,
      scale: 0.04 + (i % 3) * 0.02,
    })), []
  )

  useFrame((state) => {
    if (!trailRef.current) return
    const t = state.clock.elapsedTime
    trailRef.current.children.forEach((child, i) => {
      const p = params[i]
      if (!p) return
      child.position.x = Math.sin(t * p.fx + p.phase) * p.ax
      child.position.y = Math.cos(t * p.fy + p.phase) * p.ay
    })
  })

  const COLORS = ['#9b7cbf','#c8a97e','#7c9cbf','#bf9b7c','#7cbf9b','#9b7cbf','#bf7c9b','#c8a97e']

  return (
    <group ref={trailRef}>
      {params.map((p, i) => (
        <mesh key={i} position={[0, 0, -2]}>
          <sphereGeometry args={[p.scale, 10, 10]} />
          <meshStandardMaterial color={COLORS[i]} emissive={COLORS[i]} emissiveIntensity={0.7} />
        </mesh>
      ))}
      {/* Guide ellipses */}
      {([1.8, 2.2] as number[]).map((r, i) => (
        <mesh key={`ring-${i}`} position={[0, 0, -2.5]} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[r, 0.006, 6, 80]} />
          <meshStandardMaterial color="#9b7cbf" opacity={0.12} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ThreeDOrbs — 3D & WebGL
// Classic geometric primitives in wireframe + solid, slowly rotating
// ─────────────────────────────────────────────────────────────────────────────
function ThreeDOrbs() {
  const outerRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (outerRef.current) outerRef.current.rotation.y = state.clock.elapsedTime * 0.15
    if (innerRef.current) innerRef.current.rotation.x = state.clock.elapsedTime * 0.22
  })

  return (
    <group ref={outerRef}>
      <Float speed={0.8} floatIntensity={0.5}>
        <mesh position={[-1.5, 0, -2]} rotation={[0.3, 0.5, 0]}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#7cbf9b" wireframe opacity={0.6} transparent />
        </mesh>
      </Float>
      <Float speed={0.65} floatIntensity={0.4}>
        <mesh position={[1.5, 0.3, -2]} rotation={[0.5, 0.3, 0.2]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color="#7cbf9b" metalness={0.85} roughness={0.1} />
        </mesh>
      </Float>
      <group ref={innerRef}>
        <Float speed={0.4} floatIntensity={0.35}>
          <mesh position={[0, -1.2, -3]}>
            <torusKnotGeometry args={[0.35, 0.09, 80, 8, 2, 3]} />
            <meshStandardMaterial color="#7cbf9b" metalness={0.7} roughness={0.2} />
          </mesh>
        </Float>
      </group>
      <mesh position={[0, 0, -2.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.007, 4, 100]} />
        <meshStandardMaterial color="#7cbf9b" opacity={0.1} transparent />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BackendOrbs — Backend & APIs
// Cylinder nodes connected by wire edges — data flow architecture
// ─────────────────────────────────────────────────────────────────────────────
function BackendOrbs() {
  const NODES: [number, number, number][] = [
    [-2.0,  1.0, -2  ],
    [ 0.0,  0.5, -2.5],
    [ 2.0,  1.0, -2  ],
    [-1.0, -1.0, -2  ],
    [ 1.0, -1.0, -2  ],
    [ 0.0,  0.0, -1.5],  // central hub
  ]
  const EDGES: [number, number][] = [
    [0,1],[1,2],[0,3],[2,4],[3,5],[4,5],[1,5],[0,5],
  ]

  const edgeGeometries = useMemo(() =>
    EDGES.map(([a, b]) => {
      const pts = [new THREE.Vector3(...NODES[a]), new THREE.Vector3(...NODES[b])]
      return new THREE.BufferGeometry().setFromPoints(pts)
    }), []
  )

  return (
    <group>
      {NODES.map((pos, i) => (
        <Float key={i} speed={0.35 + i * 0.08} floatIntensity={0.25}>
          <mesh position={pos}>
            {i === 5
              ? <sphereGeometry args={[0.11, 16, 16]} />
              : <cylinderGeometry args={[0.065, 0.065, 0.28, 8]} />
            }
            <meshStandardMaterial
              color={i === 5 ? '#c8a97e' : '#bf9b7c'}
              metalness={0.75}
              roughness={0.25}
              emissive={i === 5 ? '#c8a97e' : '#bf9b7c'}
              emissiveIntensity={i === 5 ? 0.35 : 0.1}
            />
          </mesh>
        </Float>
      ))}
      {edgeGeometries.map((geo, i) => (
        // @ts-expect-error R3F primitive
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#bf9b7c" opacity={0.2} transparent />
        </line>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CMSOrbs — CMS & Content Strategy
// Stacked content-block rectangles — editorial layout structure
// ─────────────────────────────────────────────────────────────────────────────
function CMSOrbs() {
  const BLOCKS = [
    { pos: [-1.5,  0.85, -2] as [number,number,number], w: 1.2, h: 0.55, opacity: 0.30, color: '#bf7c9b' },
    { pos: [ 0.2,  0.85, -2] as [number,number,number], w: 0.8, h: 0.55, opacity: 0.22, color: '#bf7c9b' },
    { pos: [-1.5, -0.15, -2] as [number,number,number], w: 2.2, h: 0.38, opacity: 0.18, color: '#9b7cbf' },
    { pos: [-0.5, -0.65, -2] as [number,number,number], w: 1.4, h: 0.28, opacity: 0.15, color: '#bf7c9b' },
    { pos: [ 0.8, -0.65, -2] as [number,number,number], w: 0.6, h: 0.28, opacity: 0.12, color: '#9b7cbf' },
    { pos: [-1.0, -1.05, -2] as [number,number,number], w: 1.8, h: 0.20, opacity: 0.10, color: '#bf7c9b' },
  ]

  return (
    <group>
      {BLOCKS.map((b, i) => (
        <Float key={i} speed={0.2 + i * 0.05} floatIntensity={0.12} rotationIntensity={0.03}>
          <group position={b.pos}>
            <mesh>
              <planeGeometry args={[b.w, b.h]} />
              <meshStandardMaterial color={b.color} opacity={b.opacity} transparent />
            </mesh>
            <RoundedBox args={[b.w + 0.02, b.h + 0.02, 0.005]} radius={0.015} smoothness={2} position={[0, 0, -0.005]}>
              <meshStandardMaterial color={b.color} opacity={0.35} transparent />
            </RoundedBox>
          </group>
        </Float>
      ))}
      {/* Vertical editorial rule */}
      <mesh position={[-2.0, 0.85, -1.95]}>
        <planeGeometry args={[0.025, 1.85]} />
        <meshStandardMaterial color="#bf7c9b" emissive="#bf7c9b" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
const ENV_MAP: Record<string, React.FC> = {
  creative: DesignOrbs,
  frontend: CodeOrbs,
  motion:   MotionOrbs,
  threed:   ThreeDOrbs,
  backend:  BackendOrbs,
  cms:      CMSOrbs,
}

// ─────────────────────────────────────────────────────────────────────────────
// CapabilityEnvironment — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function CapabilityEnvironment({ activeCapability }: CapabilityEnvironmentProps) {
  const Env = activeCapability
    ? (ENV_MAP[activeCapability] ?? DesignOrbs)
    : DesignOrbs

  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 3, 2]} intensity={1.0} color="#f0ede8" />
      <directionalLight position={[-2, -1, 1]} intensity={0.3} color="#7c9cbf" />
      <pointLight position={[0, 2, 1]} intensity={0.65} color="#c8a97e" distance={7} decay={2} />
      <Env />
      <fog attach="fog" args={['#0a0a0b', 5, 14]} />
    </group>
  )
}
