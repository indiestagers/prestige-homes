"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { listings } from "@/data/listings";
import { Bed, Bath, Maximize2 } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function PropertyShowcase3D() {
  const items = listings.filter((l) => l.featured).slice(0, 3);
  return (
    <section className="py-32 px-6 lg:px-12 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
              Featured Properties
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight">
              Move your cursor.<br />
              <span className="italic text-gold">Feel the depth.</span>
            </h2>
          </motion.div>
          <Link
            href="/listings"
            className="font-body text-xs tracking-[0.2em] uppercase border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors w-fit"
          >
            View All Listings →
          </Link>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1500px" }}
        >
          {items.map((l, i) => (
            <TiltCard key={l.id} index={i}>
              <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-ink/5 rounded-sm">
                <Image
                  src={l.image}
                  alt={l.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover"
                  style={{ transform: "translateZ(20px) scale(1.05)" }}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                  style={{ transform: "translateZ(30px)" }}
                />
                {/* Status chip */}
                <div
                  className="absolute top-4 left-4 px-3 py-1.5 bg-ivory/95 backdrop-blur font-body text-[10px] tracking-[0.2em] uppercase text-ink"
                  style={{ transform: "translateZ(60px)" }}
                >
                  {l.status === "for-sale" ? "For Sale" : l.status === "sold" ? "Sold" : "Pending"}
                </div>
                {/* Price chip */}
                <div
                  className="absolute bottom-4 right-4 px-4 py-2 bg-gold text-ink font-display text-base sm:text-lg shadow-xl"
                  style={{ transform: "translateZ(80px)" }}
                >
                  {fmt(l.price)}
                </div>
                {/* Specs floating bar */}
                <div
                  className="absolute bottom-4 left-4 flex gap-3 px-3 py-2 bg-ink/85 backdrop-blur text-ivory font-body text-[11px]"
                  style={{ transform: "translateZ(70px)" }}
                >
                  <span className="flex items-center gap-1"><Bed size={12} className="text-gold" />{l.beds}</span>
                  <span className="flex items-center gap-1"><Bath size={12} className="text-gold" />{l.baths}</span>
                  <span className="flex items-center gap-1"><Maximize2 size={12} className="text-gold" />{l.sqft.toLocaleString()}</span>
                </div>
                {/* Specular sheen */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                    transform: "translateZ(90px)",
                  }}
                />
              </div>
              <div style={{ transform: "translateZ(40px)" }}>
                <h3 className="font-display text-xl sm:text-2xl tracking-tight">{l.title}</h3>
                <p className="font-body text-sm text-stone mt-1">
                  {l.address}, {l.city}, {l.state}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children, index }: { children: React.ReactNode; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const rx = useTransform(sy, [-0.5, 0.5], ["10deg", "-10deg"]);
  const ry = useTransform(sx, [-0.5, 0.5], ["-10deg", "10deg"]);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative cursor-pointer"
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </motion.article>
  );
}
