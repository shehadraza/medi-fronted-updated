
"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function HeartModel() {
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
    const scale = 2.25 / Math.max(size.x, size.y, size.z);

    return { model, center, scale };
  }, [scene]);

  const root = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!root.current) return;

    const t = clock.elapsedTime;
    const beat = Math.pow(Math.max(0, Math.sin(t * 3.1)), 9);

    root.current.scale.setScalar(1 + beat * 0.035);
    root.current.rotation.y = Math.sin(t * 0.3) * 0.12;
  });

  return (
    <group ref={root}>
      <group
        scale={heart.scale}
        position={[
          -heart.center.x * heart.scale,
          -heart.center.y * heart.scale,
          -heart.center.z * heart.scale,
        ]}
      >
        <primitive object={heart.model} />
      </group>
    </group>
  );
}

function OrbitSystem() {
  const first = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  const third = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (first.current) {
      first.current.rotation.x = 0.55 + t * 0.16;
      first.current.rotation.y = t * 0.24;
    }

    if (second.current) {
      second.current.rotation.x = 1.15;
      second.current.rotation.z = -t * 0.18;
    }

    if (third.current) {
      third.current.rotation.y = t * 0.12;
      third.current.rotation.z = t * 0.1;
    }
  });

  return (
    <>
      <group ref={first}>
        <mesh>
          <torusGeometry args={[2.05, 0.012, 8, 180]} />
          <meshBasicMaterial color="#38d9ed" transparent opacity={0.8} />
        </mesh>
      </group>

      <group ref={second}>
        <mesh>
          <torusGeometry args={[2.35, 0.009, 8, 180]} />
          <meshBasicMaterial color="#718bff" transparent opacity={0.65} />
        </mesh>
      </group>

      <group ref={third}>
        <mesh>
          <torusGeometry args={[2.65, 0.007, 8, 180]} />
          <meshBasicMaterial color="#36e5c2" transparent opacity={0.5} />
        </mesh>
      </group>
    </>
  );
}

function HolographicGlobe() {
  const globe = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!globe.current) return;

    globe.current.rotation.y = clock.elapsedTime * 0.1;
    globe.current.rotation.x =
      Math.sin(clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <mesh ref={globe} position={[0, 0, -1]}>
      <icosahedronGeometry args={[2.85, 2]} />
      <meshBasicMaterial
        color="#31c9e8"
        wireframe
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[4, 5, 5]}
        intensity={2.5}
        color="#d8faff"
      />

      <pointLight
        position={[-3, 2, 3]}
        intensity={3}
        color="#00cfff"
      />

      <pointLight
        position={[3, -2, -2]}
        intensity={2}
        color="#637cff"
      />

      <HolographicGlobe />
      <OrbitSystem />

      <Float
        speed={1.1}
        rotationIntensity={0.08}
        floatIntensity={0.15}
      >
        <HeartModel />
      </Float>

      <Sparkles
        count={100}
        scale={[7, 6, 6]}
        size={2}
        speed={0.35}
        color="#65eaff"
        opacity={0.7}
      />

      <Sparkles
        count={35}
        scale={[5, 4, 5]}
        size={2.5}
        speed={0.2}
        color="#8795ff"
        opacity={0.5}
      />
    </>
  );
}

export default function ResetPasswordVisual() {
  return (
    <div className="relative h-[340px] w-full sm:h-[430px] lg:h-[540px]">
      <div className="absolute inset-[15%] rounded-full bg-cyan-400/15 blur-[90px]" />

      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-[2%] top-[18%] rounded-xl border border-cyan-300/20 bg-slate-950/55 px-4 py-3 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
        <p className="text-[9px] font-semibold tracking-[0.22em] text-cyan-300">
          CARDIAC SYSTEM
        </p>
        <p className="mt-1 text-xs font-medium text-white/90">
          Heart monitoring
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-[15%] right-[2%] rounded-xl border border-blue-300/20 bg-slate-950/55 px-4 py-3 shadow-xl shadow-blue-950/20 backdrop-blur-xl">
        <p className="text-[9px] font-semibold tracking-[0.22em] text-blue-300">
          MEDI SECURITY
        </p>
        <p className="mt-1 text-xs font-medium text-white/90">
          Protected experience
        </p>
      </div>
    </div>
  );
}
