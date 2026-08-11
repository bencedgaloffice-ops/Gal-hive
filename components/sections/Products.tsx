import Reveal from "@/components/Reveal";

const PRODUCTS = [
  {
    name: "Akácméz",
    variety: "Acacia · Lot A14",
    desc: "Világos, lágy, a kristályosodásnak sokáig ellenáll.",
    tag: "Elérhető",
    limited: false,
  },
  {
    name: "Hársméz",
    variety: "Linden · Lot L07",
    desc: "Mentolos, hűvös utóízzel, borostyán árnyalattal.",
    tag: "Elérhető",
    limited: false,
  },
  {
    name: "Vadvirágméz",
    variety: "Wildflower · Lot W22",
    desc: "Teljes testű, évszakról évszakra változó karakter.",
    tag: "Korlátozott",
    limited: true,
  },
];

export default function Products() {
  return (
    <Reveal id="products" className="products stage-solid">
      <div className="wrap">
        <p className="eyebrow eyebrow--wine mono">Termékek</p>
        <h3 className="section-title section-title--dark display">
          Idei tételek, <em className="wine-em">korlátozott</em> mennyiségben.
        </h3>

        <div className="cards">
          {PRODUCTS.map((p) => (
            <article className="card" key={p.name}>
              <div className="orb orb--card" aria-hidden="true" />
              <h4 className="card__name display">{p.name}</h4>
              <p className="card__variety mono">{p.variety}</p>
              <p className="card__desc">{p.desc}</p>
              <span className={`card__tag mono ${p.limited ? "card__tag--limited" : ""}`}>
                {p.tag}
              </span>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
