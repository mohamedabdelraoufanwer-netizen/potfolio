'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Float } from '@react-three/drei'
import * as THREE from 'three'

interface HeroEnvironmentProps {
  mouseX?: number
  mouseY?: number
  scrollVelocity?: number
}

// ---------------------------------------------------------------------------
// BrowserFrame — represents real web projects in the portfolio
// ---------------------------------------------------------------------------
interface BrowserFrameProps {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

function BrowserFrame({ position, rotation, scale }: BrowserFrameProps) {
  const meshRef = useRef<THREE.Group>(null)

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Browser chrome body */}
      <RoundedBox args={[2.8, 1.9, 0.06]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#141415" metalness={0.3} roughness={0.7} />
      </RoundedBox>

      {/* URL / address bar background */}
      <mesh position={[0, 0.74, 0.04]}>
        <planeGeometry args={[2.4, 0.16]} />
        <meshStandardMaterial color="#1f1f21" />
      </mesh>

      {/* Traffic lights */}
      <mesh position={[-1.18, 0.74, 0.05]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color="#ff5f57" />
      </mesh>
      <mesh position={[-1.07, 0.74, 0.05]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color="#febc2e" />
      </mesh>
      <mesh position={[-0.96, 0.74, 0.05]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial color="#28c840" />
      </mesh>

      {/* Viewport / screen area */}
      <mesh position={[0, -0.06, 0.04]}>
        <planeGeometry args={[2.6, 1.42]} />
        <meshStandardMaterial color="#0d0d0f" opacity={0.9} transparent />
      </mesh>

      {/* Simulated UI content lines */}
      {([-0.45, -0.2, 0.05, 0.3] as number[]).map((y, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -0.3 : 0.2, y, 0.05]}>
          <planeGeometry args={[i % 2 === 0 ? 1.4 : 0.8, 0.025]} />
          <meshStandardMaterial
            color={i === 0 ? '#c8a97e' : '#2a2a2e'}
            opacity={0.8}
            transparent
          />
        </mesh>
      ))}

      {/* Bottom accent bar */}
      <mesh position={[0, -0.89, 0.04]}>
        <planeGeometry args={[2.6, 0.018]} />
        <meshStandardMaterial color="#c8a97e" emissive="#c8a97e" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

// ---------------------------------------------------------------------------
// CodeStructure — represents engineering / backend work
// ---------------------------------------------------------------------------
interface CodeStructureProps {
  position: [number, number, number]
}

function CodeStructure({ position }: CodeStructureProps) {
  const lines = useMemo(() => {
    const widths  = [0.9, 1.6, 0.6, 1.3, 0.5, 1.1, 0.8, 1.4]
    const indents = [0, 0.15, 0.15, 0, 0.3, 0.15, 0, 0.15]
    const colors  = [
      '#c8a97e', '#2a2a2e', '#2a2a2e', '#7c9cbf',
      '#2a2a2e', '#2a2a2e', '#c8a97e', '#2a2a2e',
    ]
    return widths.map((w, i) => ({
      width:  w,
      y:      -0.42 + i * 0.13,
      indent: indents[i],
      color:  colors[i],
    }))
  }, [])

  return (
    <group position={position}>
      {/* Editor chrome */}
      <RoundedBox args={[1.9, 1.2, 0.04]} radius={0.04} smoothness={3} position={[0.05, 0, 0]}>
        <meshStandardMaterial color="#141415" metalness={0.2} roughness={0.8} />
      </RoundedBox>
      {/* Line-number gutter */}
      <mesh position={[-0.82, 0, 0.025]}>
        <planeGeometry args={[0.18, 1.1]} />
        <meshStandardMaterial color="#0d0d0f" opacity={0.9} transparent />
      </mesh>
      {/* Code lines */}
      {lines.map((line, i) => (
        <mesh key={i} position={[-0.2 + line.indent, line.y, 0.03]}>
          <planeGeometry args={[line.width, 0.022]} />
          <meshStandardMaterial color={line.color} opacity={0.75} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// DataNode — represents connected systems / APIs
// ---------------------------------------------------------------------------
interface DataNodeProps {
  position: [number, number, number]
  color: string
}

function DataNode({ position, color }: DataNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.35
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.22
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  )
}

// ---------------------------------------------------------------------------
// ConnectionLine — edges in the system graph
// ---------------------------------------------------------------------------
interface ConnectionLineProps {
  start: [number, number, number]
  end:   [number, number, number]
  opacity?: number
}

function ConnectionLine({ start, end, opacity = 0.15 }: ConnectionLineProps) {
  const geometry = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [start, end])

  return (
    // @ts-expect-error R3F primitive
    <line geometry={geometry}>
      <lineBasicMaterial color="#c8a97e" opacity={opacity} transparent />
    </line>
  )
}

// ---------------------------------------------------------------------------
// GridPlane — ground reference
// ---------------------------------------------------------------------------
function GridPlane() {
  const ref = useRef<THREE.GridHelper>(null)
  return (
    <gridHelper
      ref={ref}
      args={[30, 30, '#1f1f21', '#141415']}
      position={[0, -3.5, 0]}
    />
  )
}

// ---------------------------------------------------------------------------
// Particles — ambient star field
// ---------------------------------------------------------------------------
function Particles({ count = 120 }: { count?: number }) {
  const posArray = useMemo(() => {
    const arr = new Float32Array(count * 3)
    const randomAt = (seed: number) => {
      const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
      return value - Math.floor(value)
    }

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (randomAt(i * 3 + 1) - 0.5) * 24
      arr[i * 3 + 1] = (randomAt(i * 3 + 2) - 0.5) * 12
      arr[i * 3 + 2] = -4 - randomAt(i * 3 + 3) * 10
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#c8a97e" opacity={0.35} transparent sizeAttenuation />
    </points>
  )
}

// ---------------------------------------------------------------------------
// HeroEnvironment — main export
// ---------------------------------------------------------------------------
const NODE_POSITIONS: [number, number, number][] = [
  [-3,   1,   -2  ],
  [ 3,  -0.5, -1.5],
  [-2,  -1,   -3  ],
  [ 2.5, 1.5, -2.5],
  [ 0,   2,   -4  ],
  [ 1,  -2,   -1  ],
]

const NODE_COLORS = ['#c8a97e', '#7c9cbf', '#9b7cbf', '#7cbf9b', '#bf9b7c', '#c8a97e']

const CONNECTIONS: [number, number, number?][] = [
  [0, 2],
  [1, 4],
  [2, 5],
  [3, 0, 0.08],
  [4, 5, 0.10],
  [1, 3, 0.07],
]

export default function HeroEnvironment({ mouseX, mouseY, scrollVelocity }: HeroEnvironmentProps) {
  const groupRef = useRef<THREE.Group>(null)
  const camera = useThree((state) => state.camera)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const smoothMouse = useRef({ x: 0, y: 0 })
  const lastScrollY = useRef(0)

  useEffect(() => {
    cameraRef.current = camera
  }, [camera])

  useFrame((state) => {
    if (!groupRef.current) return

    // Read normalized mouse directly from R3F state.pointer (0 React re-renders)
    const rawX = mouseX !== undefined ? mouseX : state.pointer.x
    const rawY = mouseY !== undefined ? mouseY : state.pointer.y

    smoothMouse.current.x += (rawX - smoothMouse.current.x) * 0.05
    smoothMouse.current.y += (rawY - smoothMouse.current.y) * 0.05

    // Smooth mouse-driven camera parallax
    const targetX = smoothMouse.current.x * 0.4
    const targetY = -smoothMouse.current.y * 0.2 + 0.5
    const activeCamera = cameraRef.current
    if (activeCamera) {
      activeCamera.position.x += (targetX - activeCamera.position.x) * 0.03
      activeCamera.position.y += (targetY - activeCamera.position.y) * 0.03
      activeCamera.lookAt(0, 0, 0)
    }

    // Scroll delta calculation without React state
    let scrollVel = scrollVelocity ?? 0
    if (scrollVelocity === undefined && typeof window !== 'undefined') {
      scrollVel = (window.scrollY - lastScrollY.current) * 0.02
      lastScrollY.current = window.scrollY
    }

    // Slow ambient rotation of whole scene
    groupRef.current.rotation.y =
      state.clock.elapsedTime * 0.015 + smoothMouse.current.x * 0.03
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.05 - scrollVel * 0.008
  })

  return (
    <group ref={groupRef}>
      {/* Lighting without costly shadow-map calculation passes */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 3]} intensity={1.5} color="#f0ede8" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#c8a97e" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#c8a97e" distance={8} decay={2} />
      <pointLight position={[3, -1, 1]} intensity={0.3} color="#7c9cbf" distance={6} decay={2} />

      {/* Ground + stars */}
      <GridPlane />
      <Particles />

      {/* Browser windows */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <BrowserFrame position={[-2.2, 0.3, -1]} rotation={[0.05, 0.3, 0]} scale={0.7} />
      </Float>
      <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.25}>
        <BrowserFrame position={[2, -0.2, -2]} rotation={[-0.05, -0.25, 0.02]} scale={0.55} />
      </Float>
      <Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.2}>
        <BrowserFrame position={[0.3, 1.8, -3.5]} rotation={[0.1, 0.1, -0.03]} scale={0.45} />
      </Float>

      {/* Code panels */}
      <Float speed={0.7} rotationIntensity={0.06} floatIntensity={0.2}>
        <CodeStructure position={[-3.5, -0.5, -2]} />
      </Float>
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.18}>
        <CodeStructure position={[3.2, 1.2, -3]} />
      </Float>

      {/* System graph nodes */}
      {NODE_POSITIONS.map((pos, i) => (
        <DataNode key={i} position={pos} color={NODE_COLORS[i]} />
      ))}

      {/* Graph edges */}
      {CONNECTIONS.map(([a, b, op], i) => (
        <ConnectionLine
          key={i}
          start={NODE_POSITIONS[a as number]}
          end={NODE_POSITIONS[b as number]}
          opacity={(op as number | undefined) ?? 0.15}
        />
      ))}

      {/* Decorative torus rings */}
      <Float speed={0.5} floatIntensity={0.4}>
        <mesh position={[0, -0.5, -1]} rotation={[0.3, 0.8, 0.2]}>
          <torusGeometry args={[1.2, 0.012, 8, 80]} />
          <meshStandardMaterial color="#c8a97e" opacity={0.12} transparent metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
      <Float speed={0.35} floatIntensity={0.25}>
        <mesh position={[0, 0.2, -2.5]} rotation={[1.1, 0.2, 0.5]}>
          <torusGeometry args={[1.8, 0.008, 6, 80]} />
          <meshStandardMaterial color="#7c9cbf" opacity={0.07} transparent metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0a0a0b', 8, 18]} />
    </group>
  )
}
