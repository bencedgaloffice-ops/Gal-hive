/**
 * Non-WebGL / low-end / reduced-motion fallback: a warm, layered CSS landscape
 * (sky → haze → rolling ground) so the page still opens on an apiary mood
 * rather than a flat colour. No canvas, no JS animation loop.
 */
export default function StaticFallback() {
  return <div className="apiary-fallback" aria-hidden="true" />;
}
