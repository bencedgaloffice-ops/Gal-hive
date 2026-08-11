"use client";

import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useCallback, useMemo } from "react";
import * as THREE from "three";
import type { QualitySettings } from "@/lib/quality";
import { HIVES, entranceOf, generateFlowers, makeRng } from "@/lib/world";
import { usePointerNDC } from "@/lib/usePointerNDC";
import CameraRig from "./CameraRig";
import Ground from "./Ground";
import Hills from "./Hills";
import TreeLine from "./TreeLine";
import Grass from "./Grass";
import Flowers from "./Flowers";
import Hives from "./Hives";
import Bees from "./Bees";
import Pollen from "./Pollen";
import Effects from "./Effects";

interface Props {
  quality: QualitySettings;
  animate: boolean;
  active: boolean;
  onReady: () => void;
}

const FOG_COLOR = "#cfc6ad";
const SUN_DIR: [number, number, number] = [-30, 24, -58];

/**
 * The living apiary. A fixed, full-bleed R3F canvas composed in depth layers:
 * sky + haze → hills → tree line → field → hives (midground) → grass/flowers →
 * bees + pollen (foreground). The render loop pauses when the hero scrolls
 * away, and collapses to a single static frame under reduced-motion.
 */
export default function Scene({ quality, animate, active, onReady }: Props) {
  const pointer = usePointerNDC();

  // deterministic shared layout so bees land on real entrances and flowers
  const entrances = useMemo(() => HIVES.map(entranceOf), []);
  const flowers = useMemo(() => generateFlowers(quality.flowerCount, makeRng(1717)), [quality.flowerCount]);

  const frameloop = animate ? (active ? "always" : "never") : "demand";
  const interactive = animate && active;

  const onCreated = useCallback(
    ({ gl, scene }: { gl: THREE.WebGLRenderer; scene: THREE.Scene }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      gl.setClearColor(new THREE.Color(FOG_COLOR), 1);
      scene.fog = new THREE.FogExp2(new THREE.Color(FOG_COLOR), 0.015);
      onReady();
    },
    [onReady],
  );

  return (
    <Canvas
      dpr={quality.dpr}
      frameloop={frameloop}
      shadows={quality.shadows}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 1.5, 9], fov: 42, near: 0.1, far: 400 }}
      onCreated={onCreated}
    >
      <Sky
        distance={4000}
        sunPosition={SUN_DIR}
        turbidity={8}
        rayleigh={1.1}
        mieCoefficient={0.006}
        mieDirectionalG={0.9}
      />

      {/* lighting */}
      <hemisphereLight args={["#cfe0f0", "#54502f", 0.55]} />
      <ambientLight intensity={0.14} color="#fff2dd" />
      <directionalLight
        position={SUN_DIR}
        intensity={2.4}
        color="#fff3df"
        castShadow={quality.shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />

      {/* world, front to back */}
      <Hills />
      <TreeLine count={quality.treeCount} />
      <Ground />
      <Hives interactive={interactive} />
      <Grass count={quality.grassCount} animate={animate} />
      <Flowers flowers={flowers} />
      <Bees count={quality.beeCount} animate={animate} entrances={entrances} flowers={flowers} />
      <Pollen count={quality.pollenCount} animate={animate} />

      <CameraRig animate={animate} pointer={pointer} />

      {quality.postprocessing && <Effects depthOfField={quality.depthOfField} />}
    </Canvas>
  );
}
