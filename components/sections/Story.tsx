import Reveal from "@/components/Reveal";

export default function Story() {
  return (
    <Reveal id="story" className="story stage-solid">
      <div className="wrap story__grid">
        <div className="story__copy">
          <p className="eyebrow mono">A történet</p>
          <h3 className="section-title display">
            Egy dombon, három <em className="brass">generáció</em> óta.
          </h3>
          <p>
            A diósdi domb ugyanaz maradt, mint amikor nagyapánk az első kaptárt
            kitette 1962-ben. A méhek ugyanazokat a hársakat és akácokat járják,
            mi pedig ugyanúgy dolgozunk: türelemmel, keveretlen mézzel, sietség
            nélkül.
          </p>
          <p>
            Nem keverünk tételeket, nem hőkezelünk, és nem hígítunk. Ami a
            kaptárban készült, az kerül az üvegbe.
          </p>
        </div>
        <div className="story__figures">
          <div className="figure">
            <span className="figure__num display">1962</span>
            <span className="figure__cap mono">Az első kaptár</span>
          </div>
          <div className="figure">
            <span className="figure__num display">38</span>
            <span className="figure__cap mono">Kaptár a diósdi dombon</span>
          </div>
          <div className="figure">
            <span className="figure__num display">100%</span>
            <span className="figure__cap mono">Nyers, keveretlen méz</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
