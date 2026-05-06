"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { team } from "@/data/team";

export default function Team() {
  return (
    <section id="team" className="bg-ink text-ivory py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20"
        >
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            Team
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight">
            The faces behind<br />
            every <span className="italic text-gold">handshake.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-ink-soft">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
              <h3 className="font-display text-xl tracking-tight">{m.name}</h3>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-gold mt-1">
                {m.role}
              </p>
              {m.bio && (
                <p className="font-body text-sm text-ivory/65 mt-3 leading-relaxed line-clamp-3">
                  {m.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
