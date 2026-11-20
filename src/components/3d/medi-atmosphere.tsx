
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleField() {
  const group = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(240 * 3);

    for (let i = 0; i < 240; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 48;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }

    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.018;
    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.16) * 0.3;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#31b6c5"
          size={0.075}
          transparent
          opacity={0.65}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function MedicalStructure() {
  const structure = useRef<THREE.Group>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const outerRing = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (structure.current) {
      structure.current.rotation.y += delta * 0.035;
      structure.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
    }

    if (innerRing.current) {
      innerRing.current.rotation.x += delta * 0.08;
      innerRing.current.rotation.y += delta * 0.12;
    }

    if (outerRing.current) {
      outerRing.current.rotation.x -= delta * 0.035;
      outerRing.current.rotation.z += delta * 0.055;
    }
  });

  return (
    <group ref={structure} position={[8, 0, -9]}>
      <mesh>
        <icosahedronGeometry args={[5.2, 2]} />
        <meshBasicMaterial
          color="#31b6c5"
          wireframe
          transparent
          opacity={0.075}
        />
      </mesh>

      <mesh ref={innerRing}>
        <torusGeometry args={[6.4, 0.012, 8, 180]} />
        <meshBasicMaterial
          color="#176b91"
          transparent
          opacity={0.2}
        />
      </mesh>

      <mesh ref={outerRing} rotation={[1.1, 0.3, 0.5]}>
        <torusGeometry args={[8, 0.018, 8, 180]} />
        <meshBasicMaterial
          color="#31b6c5"
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh rotation={[0.8, 0.4, 0.2]}>
        <torusGeometry args={[9.5, 0.009, 8, 180]} />
        <meshBasicMaterial
          color="#176b91"
          transparent
          opacity={0.13}
        />
      </mesh>
    </group>
  );
}

function FloatingNodes() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        position: [
          Math.sin(i * 2.4) * (7 + (i % 4) * 2),
          Math.cos(i * 1.7) * (4 + (i % 3) * 2),
          -4 - (i % 5) * 3,
        ] as [number, number, number],
        size: 0.045 + (i % 3) * 0.025,
      })),
    []
  );

  useFrame((state) => {
    if (!group.current) return;

    group.current.children.forEach((child, i) => {
      child.position.y =
        nodes[i].position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.25;
    });
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 12, 12]} />
          <meshBasicMaterial
            color={i % 2 ? "#31b6c5" : "#176b91"}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function AtmosphereScene() {
  return (
    <>
      <ambientLight intensity={1} />
      <ParticleField />
      <MedicalStructure />
      <FloatingNodes />
    </>
  );
}

export default function MediAtmosphere() {
  return (
    <div className="medi-atmosphere" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        dpr={[1, 1.4]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        }}
      >
        <AtmosphereScene />
      </Canvas>
    </div>
  );
}
