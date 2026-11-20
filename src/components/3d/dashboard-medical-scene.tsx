
"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function HumanAnatomy() {
  const { scene } = useGLTF("/models/human.glb");
  const group = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const cloned = scene.clone(true);

    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    bounds.getSize(size);
    bounds.getCenter(center);

    cloned.position.sub(center);

    const scale = 4.15 / Math.max(size.y, 0.001);
    cloned.scale.setScalar(scale);

    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const updatedMaterials = materials.map((original) => {
        const material = original.clone();

        if (material instanceof THREE.MeshStandardMaterial) {
          material.transparent = true;
          material.opacity = 0.88;
          material.roughness = 0.48;
          material.metalness = 0.12;
          material.emissive = new THREE.Color("#075b70");
          material.emissiveIntensity = 0.16;
          material.depthWrite = true;
          material.needsUpdate = true;
        }

        return material;
      });

      object.material = Array.isArray(object.material)
        ? updatedMaterials
        : updatedMaterials[0];
    });

    return cloned;
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.22) * 0.12;

    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.65) * 0.045;
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <primitive object={model} />
    </group>
  );
}

function MedicalRings() {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (inner.current) {
      inner.current.rotation.x += delta * 0.16;
      inner.current.rotation.y += delta * 0.22;
    }

    if (outer.current) {
      outer.current.rotation.y -= delta * 0.09;
      outer.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group position={[0, 0, -0.7]}>
      <mesh ref={inner} rotation={[1.1, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.009, 8, 140]} />
        <meshBasicMaterial
          color="#31b6c5"
          transparent
          opacity={0.48}
        />
      </mesh>

      <mesh ref={outer} rotation={[0.5, 0.8, 0.4]}>
        <torusGeometry args={[2.42, 0.012, 8, 160]} />
        <meshBasicMaterial
          color="#176b91"
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh rotation={[1.3, 0.3, 0.7]}>
        <torusGeometry args={[2.75, 0.007, 8, 160]} />
        <meshBasicMaterial
          color="#31b6c5"
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

function ChestPulse() {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulse.current) return;

    const scale =
      1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.1;

    pulse.current.scale.setScalar(scale);
  });

  return (
    <group position={[0.13, 0.52, 0.48]}>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.105, 24, 24]} />
        <meshBasicMaterial
          color="#31b6c5"
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial
          color="#31b6c5"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.7} />
      <directionalLight
        position={[4, 7, 6]}
        intensity={2.1}
        color="#ffffff"
      />
      <pointLight
        position={[-3, 1, 3]}
        intensity={2}
        color="#31b6c5"
      />

      <MedicalRings />

      <Float
        speed={1.1}
        rotationIntensity={0.08}
        floatIntensity={0.16}
      >
        <HumanAnatomy />
        <ChestPulse />
      </Float>
    </>
  );
}

function LoadingScene() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.7, 2]} />
      <meshBasicMaterial
        color="#31b6c5"
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

export default function DashboardMedicalScene() {
  return (
    <div
      className="relative h-[310px] w-full sm:h-[370px] xl:h-[440px]"
      aria-label="3D medical anatomy visualization"
    >
      <div className="pointer-events-none absolute inset-[15%] rounded-full bg-[#31b6c5]/15 blur-[65px]" />

      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 37 }}
        dpr={[1, 1.35]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        }}
      >
        <Suspense fallback={<LoadingScene />}>
          <Scene />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#cce8eb] bg-white/80 px-4 py-2 text-[9px] font-semibold tracking-[0.17em] text-[#328d9b] shadow-sm backdrop-blur-md">
        MEDI · PERSONAL HEALTH
      </div>
    </div>
  );
}

useGLTF.preload("/models/human.glb");
