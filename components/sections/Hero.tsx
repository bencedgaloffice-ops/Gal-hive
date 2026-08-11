import Reveal from "@/components/Reveal";

/** Hero sits over the living apiary — transparent, with a subtle text scrim. */
export default function Hero() {
  return (
    <Reveal id="hero" className="hero stage">
      <div className="scrim-hero" aria-hidden="true" />
      <div className="wrap">
        <p className="eyebrow mono">2025-ös szüret · Diósd, Magyarország</p>
        <h2 className="hero__title display">
          Nyers méz,
          <br />
          semmi <em className="brass">más</em>.
        </h2>
        <div className="rule" aria-hidden="true" />
        <p className="hero__lede lede">
          Egyszármazású, hidegen pörgetett méz Diósd kaptáraiból — nyomon
          követhető az első csepptől.
        </p>
        <div className="hero__actions">
          <a href="#products" className="btn">
            Termékek megtekintése
          </a>
          <a href="#story" className="link-underline">
            A történetünk
          </a>
        </div>
      </div>
    </Reveal>
  );
}
