"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, MapPin, Handshake, KeyRound } from "lucide-react";

const steps = [
  {
    icon: Search,
    label: "01 / Discover",
    title: "Curated to your life.",
    desc: "We listen first. Lifestyle, schools, commute, taste. Then we hand-pick — no MLS dumps, no spam.",
  },
  {
    icon: MapPin,
    label: "02 / Tour",
    title: "Visit on your terms.",
    desc: "Private showings scheduled around you, with deep neighborhood briefings before you walk in.",
  },
  {
    icon: Handshake,
    label: "03 / Negotiate",
    title: "Strategy over pressure.",
    desc: "Data-led offers and counter-offers. We protect your position so the deal lands on your terms.",
  },
  {
    icon: KeyRound,
    label: "04 / Close",
    title: "Keys in hand.",
    desc: "Inspection coordination, lender follow-through, and a closing day that actually feels like one.",
  },
];

export default function JourneyScroll() {
  return (
    <section className="bg-ink text-ivory py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            The Journey
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight max-w-3xl">
            Four steps from <span className="italic text-gold">first call</span> to first night.
          </h2>
        </motion.div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-12">
        {steps.map((s, i) => (
          <Step key={i} step={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Step({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const Icon = step.icon;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.95, 1, 1, 0.97]);

  return (
    <div
      ref={ref}
      className="sticky top-24 mb-32 last:mb-0"
      style={{ zIndex: 10 + index }}
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="bg-ink-soft border border-ivory/10 p-10 sm:p-14 rounded-sm relative overflow-hidden"
      >
        {/* Subtle corner accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative grid sm:grid-cols-[auto,1fr] gap-8 sm:gap-12 items-start">
          <div className="flex flex-col items-start gap-6">
            <div className="w-16 h-16 border border-gold/40 flex items-center justify-center bg-ink">
              <Icon className="text-gold" size={26} />
            </div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-gold">
              {step.label}
            </span>
          </div>
          <div>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight mb-5">
              {step.title}
            </h3>
            <p className="font-body text-ivory/70 text-base sm:text-lg leading-relaxed max-w-xl">
              {step.desc}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
