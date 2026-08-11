"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { makeRng, type Flower } from "@/lib/world";

interface Props {
  count: number;
  animate: boolean;
  entrances: THREE.Vector3[];
  flowers: Flower[];
}

type Mode = "hive" | "flower" | "cross";

interface Bee {
  mode: Mode;
  ax: number;
  ay: number;
  az: number;
  radius: number;
  speed: number;
  p0: number;
  p1: number;
  p2: number;
  size: number;
  dir: number;
}

/**
 * Instanced bees. Motion is deliberately non-uniform: each bee owns its own
 * anchor, radius, speed and phase offsets, so no two flight paths match and the
 * swarm never reads like a particle grid.
 *
 *  - hive bees orbit an entrance with a radius that swells and shrinks
 *    (approaching, then leaving the hive)
 *  - flower bees hover low over a specific flower
 *  - cross bees drift across the foreground close to the camera (these get the
 *    depth-of-field blur, reinforcing real depth)
 *
 * Bees never steer toward the cursor — the brief is explicit about that.
 */
export default function Bees({ count, animate, entrances, flowers }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(0.03, 6, 5);
    g.scale(1.9, 0.85, 0.85); // elongated body
    return g;
  }, []);

  const bees = useMemo<Bee[]>(() => {
    const rng = makeRng(777);
    const arr: Bee[] = [];
    const ents = entrances.length ? entrances : [new THREE.Vector3(0, 0.3, -2)];
    for (let i = 0; i < count; i++) {
      const roll = rng();
      let mode: Mode = "hive";
      if (roll > 0.82) mode = "cross";
      else if (roll > 0.66) mode = "flower";

      if (mode === "hive") {
        const e = ents[(rng() * ents.length) | 0];
        arr.push({
          mode,
          ax: e.x, ay: e.y, az: e.z,
          radius: 0.15 + rng() * 0.6,
          speed: 0.6 + rng() * 1.4,
          p0: rng() * Math.PI * 2, p1: rng() * Math.PI * 2, p2: rng() * Math.PI * 2,
          size: 0.7 + rng() * 0.5,
          dir: rng() > 0.5 ? 1 : -1,
        });
      } else if (mode === "flower" && flowers.length) {
        const f = flowers[(rng() * flowers.length) | 0];
        arr.push({
          mode,
          ax: f.position[0], ay: f.position[1] + 0.12, az: f.position[2],
          radius: 0.08 + rng() * 0.22,
          speed: 0.8 + rng() * 1.2,
          p0: rng() * Math.PI * 2, p1: rng() * Math.PI * 2, p2: rng() * Math.PI * 2,
          size: 0.7 + rng() * 0.4,
          dir: rng() > 0.5 ? 1 : -1,
        });
      } else {
        // cross the foreground, near the camera (occasional close pass)
        arr.push({
          mode: "cross",
          ax: (rng() - 0.5) * 16, ay: 0.5 + rng() * 1.6, az: 3.2 + rng() * 3.6,
          radius: 6 + rng() * 4,
          speed: 0.22 + rng() * 0.38,
          p0: rng() * Math.PI * 2, p1: rng() * Math.PI * 2, p2: rng() * Math.PI * 2,
          size: 0.85 + rng() * 0.6,
          dir: rng() > 0.5 ? 1 : -1,
        });
      }
    }
    return arr;
  }, [count, entrances, flowers]);

  const place = (t: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < bees.length; i++) {
      const b = bees[i];
      let x: number, y: number, z: number, yaw: number;

      if (b.mode === "cross") {
        // sweep across x, wrapping, with vertical bob
        const span = b.radius * 2;
        const phase = (t * b.speed * b.dir + b.p0) % 1;
        const f = phase < 0 ? phase + 1 : phase;
        x = b.ax + (f - 0.5) * span;
        y = b.ay + Math.sin(t * 3.0 + b.p1) * 0.12;
        z = b.az + Math.sin(t * 0.7 + b.p2) * 0.6;
        yaw = b.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        const swell = b.mode === "hive" ? 0.45 + 0.55 * (Math.sin(t * 0.3 * b.speed + b.p0) * 0.5 + 0.5) : 1;
        const R = b.radius * swell;
        const ang = t * b.speed * b.dir + b.p1;
        x = b.ax + Math.cos(ang) * R + Math.sin(t * 1.9 + b.p2) * 0.04;
        z = b.az + Math.sin(ang) * R * 0.7;
        y = b.ay + R * 0.35 + Math.sin(t * 2.4 + b.p2) * 0.05;
        yaw = ang + Math.PI / 2;
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.sin(t * 2 + b.p2) * 0.2, yaw, 0);
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  // colours: dark bee bodies with a little amber variation
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rng = makeRng(555);
    const color = new THREE.Color();
    for (let i = 0; i < bees.length; i++) {
      const amber = rng() > 0.6;
      if (amber) color.setRGB(0.34, 0.22, 0.07);
      else color.setRGB(0.14, 0.1, 0.05);
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    place(0.4); // initial (and only, when animation is off) placement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bees]);

  useFrame((state) => {
    if (animate) place(state.clock.elapsedTime);
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.6} metalness={0} />
    </instancedMesh>
  );
}
