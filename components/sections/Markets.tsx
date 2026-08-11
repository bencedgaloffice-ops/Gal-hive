import Reveal from "@/components/Reveal";

const MARKETS = [
  { code: "HU", line: "Diósd és Budapest, közvetlen kiszállítással." },
  { code: "US", line: "Válogatott csemegeüzletek a keleti parton." },
  { code: "JP", line: "Tokiói prémium importőrökön keresztül." },
];

export default function Markets() {
  return (
    <Reveal id="markets" className="markets stage-solid">
      <div className="wrap">
        <p className="eyebrow mono">Piacok</p>
        <h3 className="section-title display">
          Három ország, egy <em className="brass">tétel</em>.
        </h3>

        <div className="markets__row">
          {MARKETS.map((m) => (
            <div className="market" key={m.code}>
              <span className="market__code mono">{m.code}</span>
              <p className="market__line">{m.line}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
