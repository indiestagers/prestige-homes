"use client";
import { motion } from "framer-motion";
import ContactForm from "./ContactForm";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase">
            Get In Touch
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-6 leading-[1.05] tracking-tight">
            Let&apos;s start a<br />
            <span className="italic text-gold">conversation.</span>
          </h2>
          <p className="font-body text-stone text-base sm:text-lg mt-6 max-w-md leading-relaxed">
            Whether you&apos;re buying your first home, selling your fifth, or
            simply curious about the market — we&apos;re here.
          </p>
          <ul className="mt-10 space-y-5 font-body text-ink">
            <li className="flex items-start gap-4">
              <Phone size={18} className="text-gold mt-0.5 shrink-0" />
              <a href="tel:9132013242" className="hover:text-gold transition-colors">
                913-201-3242
              </a>
            </li>
            <li className="flex items-start gap-4">
              <Mail size={18} className="text-gold mt-0.5 shrink-0" />
              <a
                href="mailto:luismatosthebroker@gmail.com"
                className="hover:text-gold transition-colors break-all"
              >
                luismatosthebroker@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-4">
              <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
              <span>
                1121 W Price Blvd #1146<br />
                North Port, FL 34288
              </span>
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
