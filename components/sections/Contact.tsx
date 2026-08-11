"use client";

import { FormEvent, useState } from "react";
import Reveal from "@/components/Reveal";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [note, setNote] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !isEmail(form.email) || !form.message.trim()) {
      setNote("Kérjük, töltse ki mindhárom mezőt érvényesen.");
      return;
    }
    setNote("Köszönjük az üzenetet — hamarosan válaszolunk.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Reveal id="contact" className="contact stage-solid">
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <p className="eyebrow mono">Kapcsolat</p>
          <h3 className="section-title display">
            Nagykereskedelmi <em className="brass">érdeklődés</em>?
          </h3>
          <p className="contact__prompt">
            Egyedi kérés, viszonteladás vagy exportlehetőség — írjon néhány
            sort, és jelentkezünk.
          </p>
        </div>

        <form className="contact__form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="contactName" className="mono">
              Név
            </label>
            <input
              type="text"
              id="contactName"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contactEmail" className="mono">
              E-mail
            </label>
            <input
              type="email"
              id="contactEmail"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="contactMessage" className="mono">
              Üzenet
            </label>
            <textarea
              id="contactMessage"
              name="message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn">
            Küldés
          </button>
          <p className="form__note" role="status" aria-live="polite">
            {note}
          </p>
        </form>
      </div>
    </Reveal>
  );
}
