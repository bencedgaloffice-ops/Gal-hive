"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, MutableRefObject } from "react";
import * as THREE from "three";

interface Props {
  animate: boolean;
  pointer: MutableRefObject<{ x: number; y: number }>;
}

/**
 * "Expensive documentary camera": an extremely subtle drift + breathing motion,
 * plus a gentle parallax response to the pointer. Everything is lerped so it
 * feels like a heavy rig, never a game camera. When animation is off the camera
 * simply holds a composed static frame.
 */
export default function CameraRig({ animate, pointer }: Props) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.85, -2));
  const desired = useRef(new THREE.Vector3());
  const lookTmp = useRef(new THREE.Vector3());

  const base = { x: 0, y: 1.5, z: 9 };

  useFrame((state, delta) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp factor

    // slow cinematic drift + breathing
    const driftX = Math.sin(t * 0.06) * 0.5 + Math.sin(t * 0.13) * 0.14;
    const driftY = Math.sin(t * 0.05) * 0.12 + Math.sin(t * 0.017) * 0.05;
    const driftZ = Math.cos(t * 0.045) * 0.35;

    // subtle pointer parallax
    const px = pointer.current.x * 0.55;
    const py = pointer.current.y * 0.28;

    desired.current.set(
      base.x + driftX + px,
      base.y + driftY - py * 0.35,
      base.z + driftZ,
    );
    camera.position.lerp(desired.current, k);

    // parallax the look target too, so foreground/background separate naturally
    lookTmp.current.set(px * 0.5, 0.85 + py * 0.25, -2);
    target.current.lerp(lookTmp.current, k);
    camera.lookAt(target.current);
  });

  return null;
}
