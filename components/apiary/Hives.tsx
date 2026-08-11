"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HIVES, HIVE_DIMS, HiveSpec } from "@/lib/world";
import { makeWoodTexture } from "@/lib/textures";

interface Props {
  interactive: boolean;
  onHiveClick?: (id: number) => void;
}

const { width: W, depth: D, boxHeight: BH, standHeight: SH } = HIVE_DIMS;

function hiveIdOf(o: THREE.Object3D | null): number | null {
  let cur: THREE.Object3D | null = o;
  while (cur) {
    const id = cur.userData?.hiveId;
    if (typeof id === "number") return id;
    cur = cur.parent;
  }
  return null;
}

interface HiveMaterials {
  wood: THREE.MeshStandardMaterial;
  lid: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
}

function HiveMesh({
  hive,
  mats,
  innerRef,
}: {
  hive: HiveSpec;
  mats: HiveMaterials;
  innerRef: (el: THREE.Group | null) => void;
}) {
  const boxes = Array.from({ length: hive.boxes });
  const stackTop = SH + 0.03 + hive.boxes * BH;

  return (
    <group
      ref={innerRef}
      position={[hive.position[0], 0, hive.position[1]]}
      rotation={[0, hive.rotationY, 0]}
      userData={{ hiveId: hive.id }}
    >
      {/* stand rails */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.05), SH / 2, 0]} castShadow receiveShadow material={mats.dark}>
          <boxGeometry args={[0.06, SH, D * 1.05]} />
        </mesh>
      ))}
      {/* bottom board */}
      <mesh position={[0, SH + 0.015, 0]} castShadow receiveShadow material={mats.wood}>
        <boxGeometry args={[W + 0.05, 0.03, D + 0.03]} />
      </mesh>
      {/* landing board (protrudes at the front, +z) */}
      <mesh position={[0, SH + 0.01, D / 2 + 0.08]} castShadow receiveShadow material={mats.wood}>
        <boxGeometry args={[W * 0.82, 0.02, 0.18]} />
      </mesh>
      {/* hive bodies */}
      {boxes.map((_, k) => (
        <mesh key={k} position={[0, SH + 0.03 + BH / 2 + k * BH, 0]} castShadow receiveShadow material={mats.wood}>
          <boxGeometry args={[W, BH, D]} />
        </mesh>
      ))}
      {/* entrance slot */}
      <mesh position={[0, SH + 0.03 + 0.05, D / 2 + 0.004]} material={mats.dark}>
        <boxGeometry args={[W * 0.62, 0.035, 0.02]} />
      </mesh>
      {/* telescoping lid */}
      <mesh position={[0, stackTop + 0.03, 0]} castShadow receiveShadow material={mats.lid}>
        <boxGeometry args={[W + 0.08, 0.06, D + 0.08]} />
      </mesh>
    </group>
  );
}

/**
 * The five hives. Each has weathered procedural wood, a stand, landing board,
 * stacked supers, a dark entrance and a telescoping lid. Hovering a hive very
 * subtly lifts it (scale + a faint brass emissive) — a quiet affordance that a
 * click could later open into the Gál Hive command centre.
 */
export default function Hives({ interactive, onHiveClick }: Props) {
  const { camera } = useThree();
  const rootRef = useRef<THREE.Group>(null);
  const groupRefs = useRef<Record<number, THREE.Group | null>>({});
  const [hovered, setHovered] = useState<number | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const materials = useMemo(() => {
    const map: Record<number, HiveMaterials> = {};
    HIVES.forEach((h) => {
      const wood = new THREE.MeshStandardMaterial({
        map: makeWoodTexture(h.tone, h.id + 1),
        color: h.tone,
        roughness: 0.8 - h.wear * 0.1,
        metalness: 0,
      });
      wood.emissive = new THREE.Color("#c9a34c");
      wood.emissiveIntensity = 0;
      const lidColor = new THREE.Color(h.tone).offsetHSL(0, -0.02, -0.06);
      const lid = new THREE.MeshStandardMaterial({
        map: makeWoodTexture(`#${lidColor.getHexString()}`, h.id + 40),
        color: lidColor,
        roughness: 0.7,
        metalness: 0.05,
      });
      const dark = new THREE.MeshStandardMaterial({ color: "#1a1108", roughness: 0.9, metalness: 0 });
      map[h.id] = { wood, lid, dark };
    });
    return map;
  }, []);

  // hover + click picking via window (canvas layer is pointer-events:none)
  useEffect(() => {
    if (!interactive) {
      setHovered(null);
      return;
    }
    const ndc = new THREE.Vector2();
    const pick = (e: PointerEvent | MouseEvent): number | null => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      raycaster.setFromCamera(ndc, camera);
      const root = rootRef.current;
      if (!root) return null;
      const hits = raycaster.intersectObjects(root.children, true);
      return hits.length ? hiveIdOf(hits[0].object) : null;
    };
    const onMove = (e: PointerEvent) => setHovered(pick(e));
    const onClick = (e: MouseEvent) => {
      const id = pick(e);
      if (id != null) onHiveClick?.(id);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [interactive, camera, raycaster, onHiveClick]);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, delta);
    HIVES.forEach((h) => {
      const g = groupRefs.current[h.id];
      const isHot = hovered === h.id;
      if (g) {
        const targetScale = isHot ? 1.03 : 1;
        g.scale.x += (targetScale - g.scale.x) * k;
        g.scale.y = g.scale.z = g.scale.x;
      }
      const wood = materials[h.id].wood;
      const targetE = isHot ? 0.22 : 0;
      wood.emissiveIntensity += (targetE - wood.emissiveIntensity) * k;
    });
  });

  return (
    <group ref={rootRef}>
      {HIVES.map((h) => (
        <HiveMesh
          key={h.id}
          hive={h}
          mats={materials[h.id]}
          innerRef={(el) => (groupRefs.current[h.id] = el)}
        />
      ))}
    </group>
  );
}
