"use client";

import { FormEvent, useState } from "react";
import Reveal from "@/components/Reveal";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setNote("Kérjük, adjon meg egy érvényes e-mail címet.");
      return;
    }
    setNote("Köszönjük — hamarosan jelentkezünk a kedvezménnyel.");
    setEmail("");
  };

  return (
    <Reveal id="signup" className="signup stage-solid">
      <div className="wrap signup__inner">
        <div className="signup__text">
          <p className="eyebrow mono">Feliratkozás</p>
          <h3 className="signup__title display">
            10% az első <em className="brass">tételre</em>.
          </h3>
        </div>
        <form className="signup__form" onSubmit={onSubmit} noValidate>
          <div className="field field--inline">
            <label htmlFor="signupEmail" className="sr-only">
              E-mail cím
            </label>
            <input
              type="email"
              id="signupEmail"
              name="email"
              placeholder="e-mail cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-text mono">
              Feliratkozom <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="form__note" role="status" aria-live="polite">
            {note}
          </p>
        </form>
      </div>
    </Reveal>
  );
}
