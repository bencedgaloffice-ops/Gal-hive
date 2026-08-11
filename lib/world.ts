import * as THREE from "three";

/**
 * Deterministic apiary layout shared by the hive, flower and bee systems so
 * bees actually cluster at real hive entrances and settle on real flowers.
 */

/** Small, fast seeded RNG (mulberry32) — stable layout across renders. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Physical hive box dimensions (metres, roughly to real Langstroth scale). */
export const HIVE_DIMS = {
  width: 0.46,
  depth: 0.42,
  boxHeight: 0.24,
  standHeight: 0.18,
};

export interface HiveSpec {
  id: number;
  /** ground position (x, z) */
  position: [number, number];
  rotationY: number;
  /** number of stacked hive bodies (supers) */
  boxes: number;
  /** painted / natural wood tone — muted, never saturated */
  tone: string;
  /** subtle weathering amount 0..1 */
  wear: number;
}

/**
 * Five hives, deliberately uneven — different tones, positions and rotations.
 * Mostly natural or muted painted wood, no bright colours.
 */
export const HIVES: HiveSpec[] = [
  { id: 0, position: [-3.2, -1.6], rotationY: 0.16, boxes: 2, tone: "#b7c0ad", wear: 0.55 },
  { id: 1, position: [-1.0, -2.7], rotationY: -0.09, boxes: 3, tone: "#c8bd9e", wear: 0.4 },
  { id: 2, position: [1.5, -1.9], rotationY: 0.05, boxes: 2, tone: "#a9b6c1", wear: 0.6 },
  { id: 3, position: [3.7, -3.2], rotationY: -0.22, boxes: 2, tone: "#b9ab8f", wear: 0.7 },
  { id: 4, position: [0.5, -4.7], rotationY: 0.12, boxes: 3, tone: "#b3a487", wear: 0.5 },
];

/** World-space position of a hive's front entrance (where bees come and go). */
export function entranceOf(hive: HiveSpec): THREE.Vector3 {
  const localZ = HIVE_DIMS.depth / 2 + 0.03;
  const localY = HIVE_DIMS.standHeight + 0.07;
  const cos = Math.cos(hive.rotationY);
  const sin = Math.sin(hive.rotationY);
  // rotate local (0, y, z) about Y
  const x = hive.position[0] + sin * localZ;
  const z = hive.position[1] + cos * localZ;
  return new THREE.Vector3(x, localY, z);
}

export interface Flower {
  position: [number, number, number];
  color: string;
  scale: number;
}

const FLOWER_COLORS = ["#f4efe4", "#f6e39c", "#e7c6e2", "#f8f4ea", "#efd27a"];

/**
 * Scatter wildflowers/clover across the foreground and midground, denser near
 * the camera. Returns stable positions for the flower mesh and as bee targets.
 */
export function generateFlowers(count: number, rng: () => number): Flower[] {
  const flowers: Flower[] = [];
  for (let i = 0; i < count; i++) {
    // bias toward the foreground (larger z, closer to camera)
    const z = -8 + Math.pow(rng(), 0.7) * 15; // -8 .. 7
    const spread = z > 0 ? 11 : 8;
    const x = (rng() - 0.5) * 2 * spread;
    const y = 0.06 + rng() * 0.05;
    flowers.push({
      position: [x, y, z],
      color: FLOWER_COLORS[(rng() * FLOWER_COLORS.length) | 0],
      scale: 0.6 + rng() * 0.8,
    });
  }
  return flowers;
}
