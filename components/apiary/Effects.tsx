"use client";

import { EffectComposer, Bloom, Vignette, Noise, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

interface Props {
  depthOfField: boolean;
}

/**
 * Restrained cinematic grade: a soft depth-of-field (high tier only) that keeps
 * the hives sharp and melts the background, a whisper of bloom on the brightest
 * highlights, a gentle vignette, and fine film grain. Nothing exaggerated — no
 * lens flare, no heavy bloom.
 */
export default function Effects({ depthOfField }: Props) {
  return (
    <EffectComposer multisampling={0}>
      {depthOfField ? (
        <DepthOfField focusDistance={0.011} focalLength={0.025} bokehScale={2.2} height={480} />
      ) : (
        <></>
      )}
      <Bloom intensity={0.16} luminanceThreshold={0.9} luminanceSmoothing={0.5} mipmapBlur />
      <Vignette eskil={false} offset={0.28} darkness={0.62} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.028} />
    </EffectComposer>
  );
}
