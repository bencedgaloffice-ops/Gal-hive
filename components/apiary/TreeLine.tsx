"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { makeRng } from "@/lib/world";

interface Props {
  count: number;
}

/**
 * A band of trees along the far edge of the field. Instanced trunks + foliage
 * blobs; low detail on purpose because distance + fog do the rest.
 */
export default function TreeLine({ count }: Props) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const foliageRef = useRef<THREE.InstancedMesh>(null);

  const trees = useMemo(() => {
    const rng = makeRng(9001);
    return Array.from({ length: count }, () => {
      const x = (rng() - 0.5) * 150;
      const z = -72 - rng() * 26;
      const h = 5 + rng() * 5;
      const spread = 2.4 + rng() * 2.2;
      const tone = 0.5 + rng() * 0.5;
      return { x, z, h, spread, tone };
    });
  }, [count]);

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    trees.forEach((t, i) => {
      // trunk
      dummy.position.set(t.x, t.h * 0.32, t.z);
      dummy.scale.set(0.5, t.h * 0.7, 0.5);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      trunkRef.current?.setMatrixAt(i, dummy.matrix);

      // foliage
      dummy.position.set(t.x, t.h * 0.72, t.z);
      dummy.scale.set(t.spread, t.spread * 1.15, t.spread);
      dummy.updateMatrix();
      foliageRef.current?.setMatrixAt(i, dummy.matrix);
      // slightly varied desaturated greens
      color.setRGB(0.22 * t.tone + 0.06, 0.3 * t.tone + 0.12, 0.16 * t.tone + 0.05);
      foliageRef.current?.setColorAt(i, color);
    });

    if (trunkRef.current) trunkRef.current.instanceMatrix.needsUpdate = true;
    if (foliageRef.current) {
      foliageRef.current.instanceMatrix.needsUpdate = true;
      if (foliageRef.current.instanceColor) foliageRef.current.instanceColor.needsUpdate = true;
    }
  }, [trees]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, count]} castShadow={false}>
        <cylinderGeometry args={[0.35, 0.5, 1, 5]} />
        <meshStandardMaterial color="#4a3b2a" roughness={1} metalness={0} />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[undefined, undefined, count]} castShadow={false}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} metalness={0} flatShading />
      </instancedMesh>
    </group>
  );
}
