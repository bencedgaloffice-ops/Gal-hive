"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { makeRng } from "@/lib/world";

interface Props {
  count: number;
  animate: boolean;
}

const BOUNDS = { x: 9, yMin: 0.1, yMax: 4.2, zMin: 1, zMax: 8.5 };

/** Tiny warm pollen motes drifting near the camera — additive, barely-there,
 *  just enough to make the air feel alive. */
export default function Pollen({ count, animate }: Props) {
  const pointsRef = useRef<THREE.Points>(null);

  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(255,244,205,1)");
    g.addColorStop(1, "rgba(255,244,205,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const { geometry, velocities } = useMemo(() => {
    const rng = makeRng(3131);
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 2 * BOUNDS.x;
      positions[i * 3 + 1] = BOUNDS.yMin + rng() * (BOUNDS.yMax - BOUNDS.yMin);
      positions[i * 3 + 2] = BOUNDS.zMin + rng() * (BOUNDS.zMax - BOUNDS.zMin);
      vel[i] = 0.05 + rng() * 0.12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities: vel };
  }, [count]);

  useFrame((state, delta) => {
    if (!animate || !pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + velocities[i] * delta;
      const x = pos.getX(i) + Math.sin(t * 0.6 + i) * 0.002;
      if (y > BOUNDS.yMax) y = BOUNDS.yMin;
      pos.setX(i, x);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        map={sprite}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#f4e8bf"
      />
    </points>
  );
}
