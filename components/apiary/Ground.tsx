"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeGroundTexture } from "@/lib/textures";

/** The apiary clearing — a large mottled grass/soil plane that fog carries to
 *  the horizon. */
export default function Ground() {
  const tex = useMemo(() => makeGroundTexture(), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} receiveShadow>
      <planeGeometry args={[600, 600, 1, 1]} />
      <meshStandardMaterial map={tex} color="#8a9166" roughness={1} metalness={0} />
    </mesh>
  );
}
