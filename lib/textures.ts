import * as THREE from "three";

/**
 * Procedural CanvasTextures — no external image assets. They give wood real
 * grain + weathering and the ground mottled soil/grass variation, so nothing
 * reads as a flat plastic surface.
 */

function canvas(size: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

/** Weathered painted-wood plank texture in a given tone. */
export function makeWoodTexture(tone: string, seed = 1): THREE.CanvasTexture {
  const { c, ctx } = canvas(256);
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, 256, 256);

  // vertical grain streaks
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 256;
    const w = 0.5 + Math.random() * 2;
    const shade = Math.random() * 0.16;
    ctx.strokeStyle = `rgba(40,30,18,${shade})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 8, 85,
      x + (Math.random() - 0.5) * 8, 170,
      x + (Math.random() - 0.5) * 6, 256,
    );
    ctx.stroke();
  }

  // plank seams (horizontal boards)
  ctx.strokeStyle = "rgba(25,18,10,0.35)";
  ctx.lineWidth = 2;
  for (let y = 64; y < 256; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.random() - 0.5) * 3);
    ctx.lineTo(256, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  // weathering blotches + faded paint
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 14;
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? "60,48,30" : "232,226,208"},${Math.random() * 0.06})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // fine scratches
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(30,22,12,${0.05 + Math.random() * 0.08})`;
    ctx.lineWidth = 0.6;
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/** Mottled ground: grass green with soil patches, dust and pollen flecks. */
export function makeGroundTexture(): THREE.CanvasTexture {
  const { c, ctx } = canvas(512);

  // base gradient — a touch warmer toward the middle
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#5c6b3c");
  g.addColorStop(0.5, "#586638");
  g.addColorStop(1, "#4c5a30");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);

  // soil / bare patches
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 12 + Math.random() * 60;
    const soil = ctx.createRadialGradient(x, y, 0, x, y, r);
    soil.addColorStop(0, `rgba(96,74,48,${0.18 + Math.random() * 0.22})`);
    soil.addColorStop(1, "rgba(96,74,48,0)");
    ctx.fillStyle = soil;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // grass-tone mottling
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 3;
    const light = Math.random() > 0.5;
    ctx.fillStyle = light
      ? `rgba(120,138,78,${Math.random() * 0.28})`
      : `rgba(40,52,26,${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}
