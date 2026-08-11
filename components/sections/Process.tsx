import Reveal from "@/components/Reveal";

const STEPS = [
  { n: "01", title: "Ellenőrzés", body: "Minden kaptárt kézzel, egyenként vizsgálunk." },
  { n: "02", title: "Pörgetés", body: "Hidegen, hőkezelés nélkül pörgetjük ki." },
  { n: "03", title: "Vizsgálat", body: "Laboratóriumi tisztaság- és eredetvizsgálat." },
  { n: "04", title: "Palackozás", body: "Kis tételben, kézzel, tételszámmal." },
];

export default function Process() {
  return (
    <Reveal id="process" className="process stage-solid">
      <div className="wrap">
        <p className="eyebrow mono">Folyamat</p>
        <h3 className="section-title display">
          Négy lépés, egy <em className="brass">tétel</em>.
        </h3>

        <ol className="steps">
          {STEPS.map((s) => (
            <li className="step" key={s.n}>
              <span className="step__num mono">{s.n}</span>
              <h4 className="step__title">{s.title}</h4>
              <p className="step__body">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="lot">
          <span className="lot__label mono">Minta tételkód</span>
          <span className="lot__code mono">DM · 2025 · A14 · HU</span>
        </div>
      </div>
    </Reveal>
  );
}
