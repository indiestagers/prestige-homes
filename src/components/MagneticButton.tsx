"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
};

export default function MagneticButton({ href, children, variant = "primary", className = "" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    x.set(mx * 0.3);
    y.set(my * 0.4);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const styles =
    variant === "primary"
      ? "bg-gold text-ink hover:bg-ivory"
      : "border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink";

  return (
    <motion.span style={{ display: "inline-block", x: sx, y: sy }}>
      <Link
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`group inline-flex items-center justify-center gap-3 px-8 py-4 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${styles} ${className}`}
      >
        {children}
      </Link>
    </motion.span>
  );
}
