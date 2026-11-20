
"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  useGLTF,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

function RealHeart() {
  const { scene } = useGLTF("/models/human-heart.glb");

  const heart = useMemo(() => {
    const model = scene.clone(true);

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    return {
      model,
      center,
      scale: 2.35 / maxDimension,
    };
  }, [scene]);

  const root = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!root.current) return;

    const t = clock.elapsedTime;
    const beat = Math.pow(Math.max(0, Math.sin(t * 3.1)), 9);

    const pulse = 1 + beat * 0.035;

    root.current.scale.setScalar(pulse);
    root.current.rotation.y = Math.sin(t * 0.35) * 0.12;
  });

  return (
    <group ref={root}>
      <group scale={heart.scale} position={[
        -heart.center.x * heart.scale,
        -heart.center.y * heart.scale,
        -heart.center.z * heart.scale,
      ]}>
        <primitive object={heart.model} />
      </group>
    </group>
  );
}

function OrbitRings() {
  const ring1 = useRef<THREE.Group>(null!);
  const ring2 = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (ring1.current) {
      ring1.current.rotation.x = t * 0.25;
      ring1.current.rotation.y = t * 0.3;
    }

    if (ring2.current) {
      ring2.current.rotation.x = 1.2;
      ring2.current.rotation.z = -t * 0.22;
    }
  });

  return (
    <>
      <group ref={ring1}>
        <mesh>
          <torusGeometry args={[1.65, 0.009, 8, 160]} />
          <meshBasicMaterial color="#42ddff" />
        </mesh>
      </group>

      <group ref={ring2}>
        <mesh>
          <torusGeometry args={[1.82, 0.008, 8, 160]} />
          <meshBasicMaterial
            color="#9b83ff"
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </>
  );
}


function AnimatedBackground() {
  const globe = useRef<THREE.Mesh>(null!);
  const ringA = useRef<THREE.Group>(null!);
  const ringB = useRef<THREE.Group>(null!);
  const particles = useRef<THREE.Points>(null!);
  const nodes = useRef<THREE.Group>(null!);

  const particleGeometry = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 3.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] =
        Math.sin(angle) * radius - 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    return geometry;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (globe.current) {
      globe.current.rotation.y = t * 0.12;
      globe.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }

    if (ringA.current) {
      ringA.current.rotation.x = t * 0.18;
      ringA.current.rotation.y = t * 0.28;
    }

    if (ringB.current) {
      ringB.current.rotation.y = -t * 0.2;
      ringB.current.rotation.z = t * 0.14;
    }

    if (particles.current) {
      particles.current.rotation.y = t * 0.025;
      particles.current.rotation.x = Math.sin(t * 0.1) * 0.04;
    }

    if (nodes.current) {
      nodes.current.rotation.y = t * 0.32;
      nodes.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Deep holographic globe */}

      <mesh ref={globe} position={[0, 0, -1.2]}>
        <icosahedronGeometry args={[2.15, 2]} />
        <meshBasicMaterial
          color="#1cbfe8"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Outer energy rings */}

      <group ref={ringA} position={[0, 0, -0.8]}>
        <mesh rotation={[0.5, 0, 0]}>
          <torusGeometry args={[2.05, 0.009, 8, 180]} />
          <meshBasicMaterial color="#25dfff" transparent opacity={0.7} />
        </mesh>

        <mesh rotation={[1.1, 0.5, 0]}>
          <torusGeometry args={[2.35, 0.007, 8, 180]} />
          <meshBasicMaterial color="#668dff" transparent opacity={0.55} />
        </mesh>
      </group>

      <group ref={ringB} position={[0, 0, -1]}>
        <mesh rotation={[0, 0.8, 0.5]}>
          <torusGeometry args={[2.55, 0.006, 8, 180]} />
          <meshBasicMaterial color="#ff528b" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Floating orbital nodes */}

      <group ref={nodes}>
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const radius = 2.55;

          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.8,
                Math.sin(angle) * radius - 1,
              ]}
            >
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#ff5680" : "#56eaff"}
              />
            </mesh>
          );
        })}
      </group>

      {/* Deep space particles */}

      <points ref={particles} geometry={particleGeometry}>
        <pointsMaterial
          color="#74eaff"
          size={0.025}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Atmospheric light */}

      <Sparkles
        count={110}
        scale={[6, 5, 5]}
        size={2}
        speed={0.45}
        color="#45ddff"
        opacity={0.65}
      />

      <Sparkles
        count={35}
        scale={[4, 3, 4]}
        size={3}
        speed={0.25}
        color="#ff527c"
        opacity={0.45}
      />

      {/* Perspective floor */}

      <gridHelper
        args={[16, 32, "#155d80", "#12354a"]}
        position={[0, -2.4, -1]}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#030b16"]} />
      <fog attach="fog" args={["#030b16", 7, 15]} />

      <ambientLight intensity={1.3} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.8}
        color="#d8f8ff"
      />

      <pointLight
        position={[-3, 1, 3]}
        intensity={3}
        color="#00cfff"
      />

      <pointLight
        position={[2, -2, -2]}
        intensity={3}
        color="#ff285c"
      />

      <AnimatedBackground />

      <Float
        speed={1}
        rotationIntensity={0.08}
        floatIntensity={0.16}
      >
        <RealHeart />
      </Float>
    </>
  );
}


function LoadingHeart() {
  return null;
}

export default function MedicalOrb() {
  return (
    <div className="relative mx-auto h-[390px] w-full max-w-[480px] md:h-[530px]">
      <div className="absolute inset-[10%] rounded-full bg-cyan-400/10 blur-[85px]" />

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<LoadingHeart />}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-0 top-[22%] rounded-xl border border-cyan-300/20 bg-slate-950/75 px-3 py-2 backdrop-blur-md">
        <p className="text-[9px] tracking-[0.2em] text-cyan-300">
          CARDIAC SYSTEM
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-[18%] right-0 rounded-xl border border-rose-300/20 bg-slate-950/75 px-3 py-2 backdrop-blur-md">
        <p className="text-[9px] tracking-[0.2em] text-rose-300">
          MEDI 
        </p>
        <p className="mt-1 text-xs font-semibold text-white">
          
        </p>
      </div>
    </div>
  );
}

useGLTF.preload("/models/human-heart.glb");
