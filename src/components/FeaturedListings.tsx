"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { listings } from "@/data/listings";
import { Bed, Bath, Maximize2 } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function FeaturedListings() {
  const items = listings.filter((l) => l.featured).slice(0, 3);
  return (
    <section className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
              Featured
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight">
              Currently <span className="italic text-gold">available.</span>
            </h2>
          </motion.div>
          <Link
            href="/listings"
            className="font-body text-xs tracking-[0.2em] uppercase border-b border-ink pb-1 hover:text-gold hover:border-gold transition-colors w-fit"
          >
            View All Listings →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((l, i) => (
            <motion.article
              key={l.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-5 bg-cream">
                <Image
                  src={l.image}
                  alt={l.title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-ivory/95 backdrop-blur font-body text-[10px] tracking-[0.2em] uppercase text-ink">
                  {l.status === "for-sale"
                    ? "For Sale"
                    : l.status === "sold"
                      ? "Sold"
                      : "Pending"}
                </div>
                <div className="absolute bottom-4 right-4 px-4 py-2 bg-ink text-ivory font-display text-base sm:text-lg">
                  {fmt(l.price)}
                </div>
              </div>
              <h3 className="font-display text-xl sm:text-2xl tracking-tight">
                {l.title}
              </h3>
              <p className="font-body text-sm text-stone mt-1">
                {l.address}, {l.city}, {l.state}
              </p>
              <div className="flex gap-5 mt-4 text-stone font-body text-sm">
                <span className="flex items-center gap-1.5">
                  <Bed size={14} />
                  {l.beds} Bed
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath size={14} />
                  {l.baths} Bath
                </span>
                <span className="flex items-center gap-1.5">
                  <Maximize2 size={14} />
                  {l.sqft.toLocaleString()} sqft
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
