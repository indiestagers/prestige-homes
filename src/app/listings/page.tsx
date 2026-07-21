"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePrestigeListings } from "@/lib/usePrestigeListings";
import { goToContactSection } from "@/lib/contactNavigation";
import { Bed, Bath, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const STATUSES = [
  { id: "all", label: "All" },
  { id: "for-sale", label: "For Sale" },
  { id: "pending", label: "Pending" },
  { id: "sold", label: "Sold" },
] as const;

const PRICES = [
  { id: "all", label: "Any Price", min: 0, max: Number.POSITIVE_INFINITY },
  { id: "<400k", label: "Under $400k", min: 0, max: 400000 },
  { id: "400-600k", label: "$400k–$600k", min: 400000, max: 600000 },
  { id: ">600k", label: "Over $600k", min: 600000, max: Number.POSITIVE_INFINITY },
] as const;

const BEDS = ["any", "1+", "2+", "3+", "4+"] as const;

export default function ListingsPage() {
  const { listings } = usePrestigeListings();
  const [status, setStatus] = useState<string>("all");
  const [price, setPrice] = useState<string>("all");
  const [beds, setBeds] = useState<string>("any");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const p = PRICES.find((x) => x.id === price)!;
    const minBeds = beds === "any" ? 0 : parseInt(beds, 10);
    const q = query.trim().toLowerCase();
    return listings.filter(
      (l) =>
        (status === "all" || l.status === status) &&
        l.price >= p.min &&
        l.price <= p.max &&
        l.beds >= minBeds &&
        (!q ||
          (l.title + " " + l.address + " " + l.city + " " + l.state)
            .toLowerCase()
            .includes(q)),
    );
  }, [listings, status, price, beds, query]);

  return (
    <>
      <section className="bg-ink text-ivory pt-40 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            Portfolio
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mt-6 leading-[0.95] tracking-tight max-w-4xl">
            Current<br />
            <span className="italic text-gold">Listings.</span>
          </h1>
          <p className="font-body text-ivory/70 max-w-xl text-base sm:text-lg mt-8 leading-relaxed">
            Hand-selected homes across the Sarasota corridor. Filter by status,
            price, and bedrooms.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--color-border-warm)] bg-cream/60 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-wrap gap-x-6 gap-y-4 items-center">
          <Group label="Status">
            {STATUSES.map((s) => (
              <Chip
                key={s.id}
                active={status === s.id}
                onClick={() => setStatus(s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </Group>
          <Group label="Price">
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent border-b border-ink/30 focus:border-gold outline-none py-1.5 px-2 font-body text-sm text-ink"
            >
              {PRICES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Group>
          <Group label="Beds">
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="bg-transparent border-b border-ink/30 focus:border-gold outline-none py-1.5 px-2 font-body text-sm text-ink"
            >
              {BEDS.map((b) => (
                <option key={b} value={b}>
                  {b === "any" ? "Any" : b}
                </option>
              ))}
            </select>
          </Group>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address or city…"
            className="ml-auto w-full sm:w-64 bg-transparent border-b border-ink/30 focus:border-gold outline-none py-1.5 px-2 font-body text-sm text-ink placeholder:text-stone-light/70"
          />
        </div>
      </section>

      <section className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-stone mb-8">
            {filtered.length}{" "}
            {filtered.length === 1 ? "Property" : "Properties"}
          </p>
          {filtered.length === 0 ? (
            <p className="font-body text-stone text-center py-20">
              No listings match your filters.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((l, i) => (
                <Card key={l.id} l={l} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-body text-[10px] tracking-[0.25em] uppercase text-stone">
        {label}
      </span>
      <div className="flex items-center gap-2 flex-wrap">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 font-body text-[11px] tracking-[0.15em] uppercase border transition-colors cursor-pointer ${
        active
          ? "bg-ink text-ivory border-ink"
          : "border-ink/30 text-ink hover:border-gold hover:text-gold"
      }`}
    >
      {children}
    </button>
  );
}

function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const active = images[index] || images[0];

  if (!active) return <div className="absolute inset-0 bg-cream" />;

  function step(event: React.MouseEvent, delta: number) {
    event.preventDefault();
    event.stopPropagation();
    setIndex((current) => (current + delta + images.length) % images.length);
  }

  return (
    <>
      <Image
        src={active}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 33vw"
        className="object-contain"
      />
      {hasMultiple && (
        <>
          <button
            aria-label="Previous listing photo"
            type="button"
            onClick={(e) => step(e, -1)}
            className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-xl backdrop-blur transition-colors hover:bg-gold"
          >
            <ChevronLeft size={19} />
          </button>
          <button
            aria-label="Next listing photo"
            type="button"
            onClick={(e) => step(e, 1)}
            className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-ink shadow-xl backdrop-blur transition-colors hover:bg-gold"
          >
            <ChevronRight size={19} />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-1.5">
            {images.slice(0, 6).map((image, i) => (
              <span
                key={`${image}-${i}`}
                className={`h-1.5 w-5 rounded-full ${index === i ? "bg-gold" : "bg-ivory/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function Card({
  l,
  i,
}: {
  l: { id: string; title: string; address: string; city: string; state: string; price: number; beds: number; baths: number; sqft: number; status: string; image: string; gallery: string[] };
  i: number;
}) {
  const images = useMemo(
    () => Array.from(new Set([l.image, ...(l.gallery || [])].filter(Boolean))),
    [l.image, l.gallery],
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
      className="group relative cursor-pointer"
      role="link"
      tabIndex={0}
      onClick={goToContactSection}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToContactSection();
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-cream">
        <ListingGallery images={images} title={l.title} />
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
        <span className="transition-colors duration-300 group-hover:text-gold">
          {l.title}
        </span>
      </h3>
      <p className="font-body text-base text-stone mt-1">
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
  );
}
