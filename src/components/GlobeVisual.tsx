import * as React from "react";
import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

const DETAIL = 32;
const GLOBE_COLOR = "#E5E7EB";

interface MeridianLineProps {
  delay: number;
  angle: number;
  ref: React.RefObject<THREE.Mesh<
    THREE.BufferGeometry,
    THREE.ShaderMaterial
  > | null>;
  color: string;
}

function MeridianLine({ ref, angle, color, delay }: MeridianLineProps) {
  const points = [];

  // Create points along a full meridian from south to north pole
  for (let j = 0; j <= 32; j++) {
    const lat = (j / 32) * Math.PI - Math.PI / 2;
    const x = Math.cos(lat) * Math.cos(angle);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, z));
  }

  // Create a curve from the points
  const curve = new THREE.CatmullRomCurve3(points);

  // Create tube geometry with visible thickness
  const geometry = new THREE.TubeGeometry(
    curve,
    DETAIL * 2, // tubular segments
    0.001, // radius (thickness)
    8, // radial segments
    false, // closed
  );

  // Create custom shader material for animated gradient
  const material = new THREE.ShaderMaterial({
    vertexShader: `
  varying float vPosition;
  
  void main() {
    // Calculate normalized position along the tube (0 to 1)
    vPosition = (position.y + 1.0) * 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,
    fragmentShader: `
  uniform float uTime;
  uniform float uDelay;
  uniform vec3 uBaseColor;
  uniform vec3 uHighlightColor;
  uniform float uGradientSpeed;
  
  varying float vPosition;
  
  void main() {
    float gradientPosition = mod(vPosition - (uTime + uDelay) * uGradientSpeed, 1.0);
    // Shorter gradient: tighter smoothstep range creates a more compact highlight
    float gradientIntensity = smoothstep(0.78, 0.80, gradientPosition) * smoothstep(0.82, 0.80, gradientPosition);
    vec3 finalColor = mix(uBaseColor, uHighlightColor, clamp(gradientIntensity, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`,
    uniforms: {
      uTime: { value: 0 },
      uDelay: { value: delay },
      uBaseColor: { value: new THREE.Color(GLOBE_COLOR) },
      uHighlightColor: { value: new THREE.Color(color) },
      uGradientSpeed: { value: 0.2 },
    },
    toneMapped: false,
    transparent: false,
    // blending: THREE.AdditiveBlending,
  });

  return <primitive ref={ref} object={new THREE.Mesh(geometry, material)} />;
}

function MeridianLines() {
  const groupRef = React.useRef<THREE.Group>(null);
  const timeRef = React.useRef(0);
  const [lineRefs, setLineRefs] = React.useState<
    React.RefObject<THREE.Mesh<
      THREE.BufferGeometry,
      THREE.ShaderMaterial
    > | null>[]
  >([]);

  React.useEffect(() => {
    setLineRefs(() =>
      Array.from({ length: DETAIL })
        .fill(null)
        .map(() => React.createRef()),
    );
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    lineRefs.forEach((line) => {
      if (line.current) {
        line.current.material.uniforms.uTime.value = timeRef.current;
      }
    });
  });

  const lines = DETAIL / 2;

  return (
    <group ref={groupRef}>
      {Array.from({ length: lines })
        .fill(null)
        .map((_, i) => (
          <MeridianLine
            ref={lineRefs[i]}
            angle={(i / lines) * Math.PI * 2}
            key={`meridian-${i}`}
            color={i % 2 === 0 ? "#22C55E" : "#0EA5E9"}
            delay={Math.random() * 2}
          />
        ))}
    </group>
  );
}

function GlobeScene() {
  const sceneTimeRef = React.useRef(0);
  const meshRef = React.useRef<THREE.Group>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera>(null);

  const radius = 1; // Globe radius is 1, so diameter is 2

  useFrame(() => {
    sceneTimeRef.current += 0.008;
    if (meshRef.current) {
      meshRef.current.rotation.y = sceneTimeRef.current * 0.1;
      console.log(meshRef.current.rotation.x);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={75}
        zoom={8}
        position={[0, 0, 1.8]}
        near={0.1}
        far={20}
      />

      <ambientLight intensity={0.5} color="#fff" />

      <group position={[0, -0.88, 0]} ref={meshRef} rotation={[-0.05, 0, 0]}>
        <mesh geometry={new THREE.IcosahedronGeometry(radius, DETAIL)}>
          <meshStandardMaterial
            color={GLOBE_COLOR}
            wireframe={true}
            toneMapped={false}
            opacity={0.1}
            transparent={true}
          />
        </mesh>
        <MeridianLines />
      </group>
    </>
  );
}

// Main export component - safe for SSR
export function GlobeVisual() {
  return (
    <div className="h-48 w-full mask-b-from-50% mask-b-to-transparent">
      <Canvas>
        <GlobeScene />
      </Canvas>
    </div>
  );
}

export default GlobeVisual;
