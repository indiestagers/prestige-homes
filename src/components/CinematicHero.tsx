"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import CursorGlow from "./CursorGlow";
import { ArrowDown } from "lucide-react";

// =============================================================================
// HERO VIDEO SEQUENCE
// -----------------------------------------------------------------------------
// A 4-clip narrative: home → around the home → love → daytime toast.
// All clips are warm, residential, daylight — no NYE party hats, no traffic.
// Each clip auto-advances to the next with a 1s opacity crossfade.
// Replace any clip by overwriting the corresponding file in /public/hero/.
// -----------------------------------------------------------------------------
// `basePath` is auto-applied to raw <video src=...> attributes (Next.js does
// NOT auto-prefix these like it does for next/image and next/link). Without
// this prefix, videos 404 on GitHub Pages and the poster shows instead.
// =============================================================================
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const HERO_CLIPS = [
  `${BASE_PATH}/hero/01-home.mp4`,     // aerial of a lakeside home, autumn warm tones
  `${BASE_PATH}/hero/02-backyard.mp4`, // sunlit backyard / pool — life around the home
  `${BASE_PATH}/hero/03-couple.mp4`,   // couple at home — warm sunlit interior
  `${BASE_PATH}/hero/04-toast.mp4`,    // outdoor daytime champagne pour & cheers
];
// Max seconds per clip before crossfading to the next (clips are trimmed live).
const CLIP_SECONDS = 5;
const HERO_POSTER =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2400&q=85";

export default function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-ink text-ivory"
    >
      <CursorGlow color="rgba(201,169,97,0.10)" />

      {/* ------------------------------------------------------------- */}
      {/* Background: 4-clip crossfading video sequence                 */}
      {/* ------------------------------------------------------------- */}
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <VideoSequence clips={HERO_CLIPS} poster={HERO_POSTER} />

        {/* Warm cinematic color grade */}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,15,10,0.45) 0%, rgba(14,17,20,0.30) 45%, rgba(14,17,20,0.88) 100%)",
          }}
        />
        {/* Warm gold wash */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse at 25% 65%, rgba(201,169,97,0.45), transparent 70%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Subtle film grain */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </motion.div>

      {/* Floating warm light motes */}
      <FloatingMotes />

      {/* ------------------------------------------------------------- */}
      {/* Foreground content — bottom-left agency style                  */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 min-h-screen flex flex-col justify-end px-6 lg:px-12 max-w-7xl mx-auto pt-32 pb-24 lg:pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-10 h-px bg-gold" />
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            Prestige Florida Homes Realty
          </span>
        </motion.div>

        <h1 className="font-display leading-[0.92] tracking-[-0.02em] text-[clamp(3rem,8.5vw,7.5rem)] font-medium mb-8 max-w-5xl">
          <SplitReveal text="Where Florida" delay={0.5} />
          <br />
          <SplitReveal text="Feels Like Home." delay={0.85} highlightLast />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="font-body text-ivory/85 max-w-xl text-base sm:text-lg leading-relaxed mb-10"
        >
          Curated luxury homes across the Sarasota corridor — guided by Luis
          Matos and a team that treats every family like their own.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton href="/listings" variant="primary">
            View Listings <span className="transition-transform group-hover:translate-x-1">→</span>
          </MagneticButton>
          <MagneticButton href="/#contact" variant="outline">
            Book Consultation
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.1 }}
          className="mt-14 flex flex-wrap gap-x-12 gap-y-6 max-w-xl"
        >
          {[
            { num: "$50M+", label: "Sold" },
            { num: "200+", label: "Families" },
            { num: "15+", label: "Years" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl text-ivory">{s.num}</div>
              <div className="font-body text-[10px] tracking-[0.25em] uppercase text-ivory/55 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-ivory/55 flex flex-col items-center gap-2"
        >
          <span className="font-body text-[10px] tracking-[0.3em] uppercase">
            Scroll
          </span>
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------- */
/* Ken Burns crossfade between hero photos                       */
/* ------------------------------------------------------------- */
function VideoSequence({
  clips,
  poster,
  maxSeconds = CLIP_SECONDS,
}: {
  clips: string[];
  poster: string;
  maxSeconds?: number;
}) {
  const [idx, setIdx] = useState(0);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const advancingRef = useRef(false);

  const advance = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setIdx((p) => (p + 1) % clips.length);
    // tiny lock so onTimeUpdate + onEnded don't double-fire
    setTimeout(() => {
      advancingRef.current = false;
    }, 250);
  };

  // Play active clip from start; pause others.
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) {
        v.currentTime = 0;
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [idx]);

  return (
    <>
      {/* Poster shows behind everything until first frame paints */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          muted
          playsInline
          preload="auto"
          poster={i === 0 ? poster : undefined}
          onEnded={advance}
          onTimeUpdate={(e) => {
            if (i === idx && e.currentTarget.currentTime >= maxSeconds) {
              advance();
            }
          }}
          src={src}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------- */
/* Floating warm light motes (subtle atmosphere)                 */
/* ------------------------------------------------------------- */
function FloatingMotes() {
  const motes = [
    { x: "8%", y: "25%", size: 6, dur: 22, delay: 0 },
    { x: "72%", y: "18%", size: 4, dur: 28, delay: 5 },
    { x: "30%", y: "70%", size: 8, dur: 24, delay: 2 },
    { x: "88%", y: "55%", size: 5, dur: 26, delay: 8 },
    { x: "55%", y: "35%", size: 4, dur: 20, delay: 3 },
    { x: "20%", y: "55%", size: 6, dur: 30, delay: 11 },
    { x: "65%", y: "75%", size: 5, dur: 25, delay: 6 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      {motes.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.65, 0.4, 0], y: [0, -120, -200, -260] }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute rounded-full bg-gold blur-[1.5px]"
          style={{
            left: m.x,
            top: m.y,
            width: m.size,
            height: m.size,
            boxShadow: "0 0 12px rgba(201,169,97,0.6)",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- */
/* Word-by-word mask reveal headline                             */
/* ------------------------------------------------------------- */
function SplitReveal({
  text,
  delay = 0,
  highlightLast = false,
}: {
  text: string;
  delay?: number;
  highlightLast?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap gap-x-4">
      {words.map((w, wi) => {
        const isLast = highlightLast && wi === words.length - 1;
        return (
          <span key={wi} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={`inline-block ${isLast ? "italic text-gold" : ""}`}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.9,
                delay: delay + wi * 0.08,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
