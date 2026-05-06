"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/** Subtle gold glow that follows the cursor — adds atmospheric depth. */
export default function CursorGlow({ color = "rgba(201,169,97,0.18)" }: { color?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 z-[1] hidden md:block"
      style={{
        x: sx,
        y: sy,
        width: 480,
        height: 480,
        background: `radial-gradient(circle, ${color}, transparent 60%)`,
        mixBlendMode: "screen",
      }}
    />
  );
}
