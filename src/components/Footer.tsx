import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const socialIconClass =
  "w-[18px] h-[18px] text-ivory/60 hover:text-gold transition-colors";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={socialIconClass}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={socialIconClass}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={socialIconClass}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-display text-2xl tracking-[0.18em]">PRESTIGE</span>
            <span className="font-body text-[10px] tracking-[0.3em] text-stone-light">FLORIDA</span>
          </div>
          <p className="font-body text-stone-light max-w-md leading-relaxed">
            Luxury real estate built on trust, taste, and tireless service.
            Serving North Port and the greater Sarasota area.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xs tracking-[0.25em] text-gold mb-5">
            Explore
          </h4>
          <ul className="space-y-3 font-body text-sm">
            <li><Link href="/" className="text-ivory/70 hover:text-gold transition-colors">Home</Link></li>
            <li><Link href="/listings" className="text-ivory/70 hover:text-gold transition-colors">Listings</Link></li>
            <li><Link href="/#about" className="text-ivory/70 hover:text-gold transition-colors">About</Link></li>
            <li><Link href="/#team" className="text-ivory/70 hover:text-gold transition-colors">Team</Link></li>
            <li><Link href="/#contact" className="text-ivory/70 hover:text-gold transition-colors">Contact</Link></li>
            <li><Link href="/admin" className="text-ivory/70 hover:text-gold transition-colors">Admin login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xs tracking-[0.25em] text-gold mb-5">Office</h4>
          <ul className="space-y-3 font-body text-sm text-ivory/70">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>1121 W Price Blvd #1146,<br />North Port, FL 34288</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold" />
              <a href="tel:9132013242" className="hover:text-gold transition-colors">913-201-3242</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-gold shrink-0" />
              <a href="mailto:luismatosthebroker@gmail.com" className="hover:text-gold transition-colors break-all">
                luismatosthebroker@gmail.com
              </a>
            </li>
          </ul>
          <div className="flex gap-5 mt-6">
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" aria-label="LinkedIn"><LinkedinIcon /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs tracking-wider text-ivory/50">
            © {new Date().getFullYear()} Prestige Florida Homes Realty. All rights reserved.
          </p>
          <p className="font-body text-xs tracking-wider text-ivory/50">
            Licensed Real Estate Brokerage · Florida
          </p>
        </div>
      </div>
    </footer>
  );
}
