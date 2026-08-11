"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { makeRng } from "@/lib/world";

interface Props {
  count: number;
  animate: boolean;
}

const BLADE_HEIGHT = 0.4;

/**
 * Instanced grass with GPU wind. Blade transforms are written once; the sway
 * lives entirely in a vertex-shader injection driven by a single time uniform,
 * so thousands of blades cost almost nothing per frame. Wind bends blades from
 * the tip (height-weighted) with a travelling gust, in world space so
 * neighbouring blades move together like a real field.
 */
export default function Grass({ count, animate }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uWind: { value: 0.14 }, uBladeH: { value: BLADE_HEIGHT } }),
    [],
  );

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.03, BLADE_HEIGHT, 1, 4);
    g.translate(0, BLADE_HEIGHT / 2, 0); // pivot at the base
    return g;
  }, []);

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uWind = uniforms.uWind;
      shader.uniforms.uBladeH = uniforms.uBladeH;
      shader.vertexShader =
        "uniform float uTime;\nuniform float uWind;\nuniform float uBladeH;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float bladeF = clamp(transformed.y / uBladeH, 0.0, 1.0);
        vec4 wp = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        float sway = sin(uTime * 1.1 + wp.x * 0.7 + wp.z * 0.6);
        float gust = sin(uTime * 0.32 + wp.x * 0.12 + wp.z * 0.09) * 0.5 + 0.5;
        transformed.x += bladeF * bladeF * uWind * (0.55 + gust) * sway;
        transformed.z += bladeF * bladeF * uWind * 0.45 * cos(uTime * 0.9 + wp.z * 0.5);
        `,
      );
    };
    return m;
  }, [uniforms]);

  const blades = useMemo(() => {
    const rng = makeRng(2024);
    return Array.from({ length: count }, () => {
      // bias density toward the foreground (closer to camera, larger z)
      const z = -14 + Math.pow(rng(), 0.65) * 21; // -14 .. 7
      const spread = z > 0 ? 15 : 11;
      const x = (rng() - 0.5) * 2 * spread;
      const h = 0.6 + rng() * 0.9;
      const rot = rng() * Math.PI;
      const tilt = (rng() - 0.5) * 0.3;
      // green shades, never oversaturated
      const shade = 0.4 + rng() * 0.4;
      return { x, z, h, rot, tilt, shade };
    });
  }, [count]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    blades.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.rotation.set(b.tilt, b.rot, b.tilt * 0.5);
      dummy.scale.set(1, b.h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      color.setRGB(0.28 * b.shade + 0.14, 0.4 * b.shade + 0.16, 0.14 * b.shade + 0.06);
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blades]);

  useFrame((state) => {
    if (animate) uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
  );
}
