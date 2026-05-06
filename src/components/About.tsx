"use client";
import { motion } from "framer-motion";
import StatCounter from "./StatCounter";

const stats: { value: number; prefix?: string; suffix?: string; label: string }[] = [
  { value: 50, prefix: "$", suffix: "M+", label: "Lifetime Sales Volume" },
  { value: 200, suffix: "+", label: "Families Served" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            About
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight">
            A boutique<br />
            brokerage with<br />
            <span className="italic text-gold">global standards.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-7 space-y-6 font-body text-stone text-base sm:text-lg leading-relaxed"
        >
          <p>
            Prestige Florida Homes Realty is a full-service brokerage founded by
            Luis Matos. We represent buyers and sellers across the North Port
            and Sarasota corridor with a discipline reserved for the world's
            most premium markets.
          </p>
          <p>
            From luxury waterfront estates to family-first homes, every listing
            is treated as a craft — researched, marketed, and negotiated with
            the patience and intent that today's discerning client expects.
          </p>
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 pt-10 border-t border-[color:var(--color-border-warm)]">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 * i }}
              >
                <StatCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="font-display text-3xl sm:text-4xl text-ink mb-2 block"
                />
                <div className="font-body text-[11px] tracking-[0.2em] uppercase text-stone-light">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
