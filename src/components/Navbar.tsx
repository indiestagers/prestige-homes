"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/#about", label: "About" },
  { href: "/#team", label: "Team" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/85 backdrop-blur-xl border-b border-[color:var(--color-border-warm)]/60"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span
            className={`font-display text-xl tracking-[0.18em] transition-colors ${
              scrolled ? "text-ink" : "text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            }`}
          >
            PRESTIGE
          </span>
          <span
            className={`font-body text-[10px] tracking-[0.3em] transition-colors ${
              scrolled ? "text-stone" : "text-ivory/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            }`}
          >
            FLORIDA
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`font-body text-xs tracking-[0.2em] uppercase transition-colors hover:text-gold ${
                  scrolled ? "text-ink" : "text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/#contact"
          className={`hidden lg:inline-flex items-center px-6 py-2.5 font-body text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
            scrolled
              ? "bg-ink text-ivory hover:bg-gold hover:text-ink"
              : "bg-ivory text-ink hover:bg-gold"
          }`}
        >
          Book Consultation
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className={scrolled ? "text-ink" : "text-ivory"} size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-ink"
          >
            <div className="flex items-center justify-between h-20 px-6">
              <span className="font-display text-xl tracking-[0.18em] text-ivory">
                PRESTIGE
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="text-ivory" size={28} />
              </button>
            </div>
            <ul className="flex flex-col items-center justify-center h-[calc(100%-5rem)] gap-8 -mt-16">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl tracking-[0.1em] text-ivory hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
