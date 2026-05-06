"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

// Browser posts directly to the Google Apps Script Web App URL.
// Set NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL in `.env.local` (or as a GitHub
// Actions repo secret named GOOGLE_SHEETS_WEBHOOK_URL — the workflow wires it
// into the build). See README.md for Apps Script setup.
const SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!SHEETS_URL) {
      console.warn("[contact] NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL not set — submission was:", data);
      setStatus("success");
      form.reset();
      return;
    }

    try {
      // Apps Script Web Apps don't need CORS preflight when the request is a
      // simple POST without custom headers — keep the body as text/plain.
      await fetch(SHEETS_URL, {
        method: "POST",
        body: JSON.stringify({ timestamp: new Date().toISOString(), ...data }),
        mode: "no-cors", // Apps Script doesn't return CORS headers; opaque OK
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="First Name" name="firstName" required />
        <Field label="Last Name" name="lastName" required />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Phone" name="phone" type="tel" />
      <Field
        label="Interest"
        name="interest"
        placeholder="Buying / Selling / Both"
      />
      <div>
        <label className="block font-body text-[11px] tracking-[0.25em] uppercase text-stone mb-3">
          Message<span className="text-gold ml-1">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full bg-transparent border-b border-ink/30 focus:border-gold outline-none py-3 font-body text-ink placeholder:text-stone-light/60 transition-colors resize-none"
          placeholder="Tell us a little about what you're looking for…"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center px-8 py-4 bg-ink text-ivory font-body text-[11px] tracking-[0.25em] uppercase hover:bg-gold hover:text-ink transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm text-gold pt-2"
          role="status"
          aria-live="polite"
        >
          Message sent. Luis will be in touch shortly.
        </motion.p>
      )}
      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm text-red-700 pt-2"
          role="alert"
        >
          {error || "Something went wrong. Please try again or call directly."}
        </motion.p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-body text-[11px] tracking-[0.25em] uppercase text-stone mb-3">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-ink/30 focus:border-gold outline-none py-3 font-body text-ink placeholder:text-stone-light/60 transition-colors"
      />
    </div>
  );
}
