"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Flower } from "@/lib/world";

interface Props {
  flowers: Flower[];
}

/**
 * Wildflower / clover heads scattered through the grass. Instanced, tinted per
 * flower, sitting still among the swaying blades (flower heads barely move).
 */
export default function Flowers({ flowers }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.055, 0), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    flowers.forEach((f, i) => {
      dummy.position.set(f.position[0], f.position[1], f.position[2]);
      dummy.scale.setScalar(f.scale);
      dummy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.set(f.color);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [flowers]);

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, flowers.length]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.7} metalness={0} />
    </instancedMesh>
  );
}
