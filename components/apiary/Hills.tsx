"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeRng } from "@/lib/world";

/**
 * Distant rolling landscape — a few large, low, flattened mounds far behind the
 * tree line. Heavy fog blends them into the haze so they read as countryside,
 * not geometry.
 */
export default function Hills() {
  const hills = useMemo(() => {
    const rng = makeRng(4127);
    const arr: { pos: [number, number, number]; scale: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const x = (rng() - 0.5) * 260;
      const z = -150 - rng() * 60;
      const w = 70 + rng() * 90;
      arr.push({
        pos: [x, -14 - rng() * 6, z],
        scale: [w, 22 + rng() * 14, w],
        color: rng() > 0.5 ? "#8f9a72" : "#7f8b69",
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {hills.map((h, i) => (
        <mesh key={i} position={h.pos} scale={h.scale}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={h.color} roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
