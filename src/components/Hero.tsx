"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[680px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&q=85)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink/85" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 lg:px-12 max-w-7xl mx-auto"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-body text-[11px] tracking-[0.4em] text-gold uppercase mb-6"
        >
          Prestige Florida Homes Realty
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-ivory leading-[0.95] tracking-[-0.02em] text-[clamp(2.75rem,8.5vw,7.5rem)] font-medium mb-8 max-w-5xl"
        >
          Where Florida<br />
          Homes Meet<br />
          <span className="italic text-gold">Distinction.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-ivory/85 max-w-xl text-base sm:text-lg leading-relaxed mb-10"
        >
          Curated luxury properties across the Sarasota corridor — guided by
          Luis Matos and a team built on craft, discretion, and results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
        >
          <Link
            href="/listings"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-ink font-body text-xs tracking-[0.2em] uppercase hover:bg-ivory transition-colors duration-300"
          >
            View Listings
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-ivory/40 text-ivory font-body text-xs tracking-[0.2em] uppercase hover:bg-ivory hover:text-ink transition-colors duration-300"
          >
            Book Consultation
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-ivory/60"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
