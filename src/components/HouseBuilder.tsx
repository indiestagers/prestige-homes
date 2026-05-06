"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Animated isometric "blueprint → real" house.
 * Draws the structure line by line on view, then fills surfaces, then
 * lights up windows. Loops subtle "breathing" while idle.
 */
export default function HouseBuilder() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Stroke draw transition
  const draw = (delay = 0, duration = 1.1) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: inView ? { pathLength: 1, opacity: 1 } : {},
    transition: {
      pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] },
      opacity: { duration: 0.2, delay },
    },
  });
  const fill = (delay: number) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : {},
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  });

  return (
    <div ref={ref} className="relative w-full h-full flex items-center justify-center select-none">
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.5, delay: 4 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(201,169,97,0.18), transparent 60%)",
        }}
      />

      {/* Floating motion */}
      <motion.svg
        viewBox="0 0 600 500"
        className="relative w-full h-full max-w-[640px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        animate={
          inView
            ? { y: [0, -6, 0] }
            : {}
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <defs>
          <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1D21" />
            <stop offset="100%" stopColor="#0E1114" />
          </linearGradient>
          <linearGradient id="frontWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FAF8F3" />
            <stop offset="100%" stopColor="#E5E1D8" />
          </linearGradient>
          <linearGradient id="sideWall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D7D2C5" />
            <stop offset="100%" stopColor="#B8B2A3" />
          </linearGradient>
          <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4B574" />
            <stop offset="100%" stopColor="#C9A961" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(201,169,97,0)" />
            <stop offset="50%" stopColor="rgba(201,169,97,0.4)" />
            <stop offset="100%" stopColor="rgba(201,169,97,0)" />
          </linearGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(201,169,97,0.07)" strokeWidth="0.5" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blueprint grid background */}
        <motion.rect
          x="0" y="0" width="600" height="500"
          fill="url(#grid)"
          {...fill(0.1)}
        />

        {/* Ground line */}
        <motion.line
          x1="40" y1="430" x2="560" y2="430"
          stroke="url(#ground)"
          strokeWidth="1.5"
          {...draw(0.3, 0.8)}
        />

        {/* ============ FILLS (appear after lines draw) ============ */}
        {/* Side wall fill */}
        <motion.path
          d="M 380 200 L 520 240 L 520 410 L 380 430 Z"
          fill="url(#sideWall)"
          {...fill(3.6)}
        />
        {/* Front wall fill */}
        <motion.path
          d="M 130 200 L 380 200 L 380 430 L 130 430 Z"
          fill="url(#frontWall)"
          {...fill(3.4)}
        />
        {/* Roof front fill */}
        <motion.path
          d="M 110 210 L 255 90 L 400 210 L 380 200 L 130 200 Z"
          fill="url(#roof)"
          {...fill(3.8)}
        />
        {/* Roof side fill */}
        <motion.path
          d="M 400 210 L 255 90 L 540 250 L 520 240 Z"
          fill="url(#roof)"
          opacity="0.85"
          {...fill(3.9)}
        />

        {/* ============ STRUCTURAL LINES (drawn first) ============ */}
        {/* Foundation outline */}
        <motion.line x1="130" y1="430" x2="380" y2="430" stroke="#C9A961" strokeWidth="1.5" {...draw(0.5)} />
        <motion.line x1="380" y1="430" x2="520" y2="410" stroke="#C9A961" strokeWidth="1.5" {...draw(0.7)} />

        {/* Front wall outline */}
        <motion.line x1="130" y1="430" x2="130" y2="200" stroke="#C9A961" strokeWidth="1.5" {...draw(0.9)} />
        <motion.line x1="380" y1="430" x2="380" y2="200" stroke="#C9A961" strokeWidth="1.5" {...draw(1.0)} />
        <motion.line x1="130" y1="200" x2="380" y2="200" stroke="#C9A961" strokeWidth="1.5" {...draw(1.2)} />

        {/* Side wall outline */}
        <motion.line x1="380" y1="200" x2="520" y2="240" stroke="#C9A961" strokeWidth="1.5" {...draw(1.4)} />
        <motion.line x1="520" y1="240" x2="520" y2="410" stroke="#C9A961" strokeWidth="1.5" {...draw(1.6)} />

        {/* Roof front (gable) */}
        <motion.line x1="110" y1="210" x2="255" y2="90" stroke="#C9A961" strokeWidth="1.5" {...draw(1.8)} />
        <motion.line x1="255" y1="90" x2="400" y2="210" stroke="#C9A961" strokeWidth="1.5" {...draw(1.9)} />
        <motion.line x1="110" y1="210" x2="400" y2="210" stroke="#C9A961" strokeWidth="1" opacity="0.5" {...draw(2.1)} />

        {/* Roof side ridge */}
        <motion.line x1="400" y1="210" x2="540" y2="250" stroke="#C9A961" strokeWidth="1.5" {...draw(2.3)} />
        <motion.line x1="255" y1="90" x2="540" y2="250" stroke="#C9A961" strokeWidth="1.5" {...draw(2.5)} />

        {/* Door */}
        <motion.rect
          x="220" y="320" width="60" height="110"
          fill="#1A1D21" stroke="#C9A961" strokeWidth="1.2"
          {...draw(2.8, 0.6)}
        />
        <motion.circle cx="270" cy="378" r="2" fill="#C9A961" {...fill(4.1)} />

        {/* Door step */}
        <motion.line x1="200" y1="430" x2="300" y2="430" stroke="#C9A961" strokeWidth="2" {...draw(2.7, 0.4)} />

        {/* Front Windows */}
        <motion.g {...draw(3.0, 0.5)} stroke="#C9A961" strokeWidth="1" fill="none">
          <rect x="155" y="240" width="50" height="60" />
          <line x1="180" y1="240" x2="180" y2="300" />
          <line x1="155" y1="270" x2="205" y2="270" />
        </motion.g>
        <motion.g {...draw(3.1, 0.5)} stroke="#C9A961" strokeWidth="1" fill="none">
          <rect x="305" y="240" width="50" height="60" />
          <line x1="330" y1="240" x2="330" y2="300" />
          <line x1="305" y1="270" x2="355" y2="270" />
        </motion.g>

        {/* Side windows */}
        <motion.g {...draw(3.2, 0.5)} stroke="#C9A961" strokeWidth="1" fill="none">
          <path d="M 410 245 L 460 260 L 460 310 L 410 295 Z" />
          <line x1="435" y1="252" x2="435" y2="302" />
        </motion.g>
        <motion.g {...draw(3.3, 0.5)} stroke="#C9A961" strokeWidth="1" fill="none">
          <path d="M 470 263 L 510 274 L 510 320 L 470 308 Z" />
          <line x1="490" y1="268" x2="490" y2="314" />
        </motion.g>

        {/* Chimney */}
        <motion.rect
          x="320" y="120" width="22" height="50"
          stroke="#C9A961" strokeWidth="1.2" fill="#0E1114"
          {...draw(3.5, 0.4)}
        />

        {/* Window glow (lights on) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 0.8, 0.6, 0.85] } : {}}
          transition={{ duration: 1.4, delay: 4.4, ease: "easeOut" }}
          filter="url(#glow)"
        >
          <rect x="156" y="241" width="48" height="58" fill="url(#window)" opacity="0.7" />
          <rect x="306" y="241" width="48" height="58" fill="url(#window)" opacity="0.7" />
          <path d="M 411 246 L 459 261 L 459 309 L 411 294 Z" fill="url(#window)" opacity="0.55" />
          <path d="M 471 264 L 509 275 L 509 319 L 471 307 Z" fill="url(#window)" opacity="0.55" />
        </motion.g>

        {/* Sun/spotlight ray */}
        <motion.line
          x1="80" y1="80" x2="200" y2="160"
          stroke="rgba(201,169,97,0.35)"
          strokeWidth="0.8"
          strokeDasharray="2 6"
          {...draw(4.6, 0.8)}
        />
        <motion.circle cx="80" cy="80" r="22" fill="none" stroke="rgba(201,169,97,0.4)" strokeWidth="0.8" {...draw(4.7, 0.6)} />
        <motion.circle cx="80" cy="80" r="8" fill="rgba(201,169,97,0.6)" {...fill(5.0)} />

        {/* Ground shadow */}
        <motion.ellipse
          cx="320" cy="438" rx="220" ry="8"
          fill="rgba(0,0,0,0.35)"
          {...fill(4.0)}
        />

        {/* Architectural dimension lines (blueprint feel) */}
        <motion.g
          stroke="rgba(201,169,97,0.5)"
          strokeWidth="0.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 0.7, 0.3] } : {}}
          transition={{ duration: 2, delay: 5.2 }}
        >
          <line x1="90" y1="455" x2="380" y2="455" />
          <line x1="90" y1="450" x2="90" y2="460" />
          <line x1="380" y1="450" x2="380" y2="460" />
          <text x="225" y="472" fill="rgba(201,169,97,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">
            42&apos;-0&quot;
          </text>
        </motion.g>
      </motion.svg>

      {/* Subtle scanning line for "rendering" feel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 0.6, 0] } : {}}
        transition={{ duration: 3, delay: 0.2 }}
        className="absolute inset-x-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,169,97,0.6), transparent)",
          top: "10%",
        }}
      />
    </div>
  );
}
