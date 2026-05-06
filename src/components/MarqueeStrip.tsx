"use client";
import { motion } from "framer-motion";

type Props = {
  items: string[];
  duration?: number;
  outlined?: boolean;
};

/** Infinite outlined-text marquee strip — luxury brand feel. */
export default function MarqueeStrip({ items, duration = 40, outlined = true }: Props) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="relative w-full overflow-hidden bg-ink py-10 border-y border-ivory/10">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center mx-12 font-display text-5xl sm:text-6xl md:text-7xl tracking-tight">
            {outlined ? (
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px rgba(250,248,243,0.35)" }}
              >
                {item}
              </span>
            ) : (
              <span className="text-ivory">{item}</span>
            )}
            <span className="inline-block mx-8 text-gold text-3xl">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
