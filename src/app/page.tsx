import CinematicHero from "@/components/CinematicHero";
import MarqueeStrip from "@/components/MarqueeStrip";
import About from "@/components/About";
import Team from "@/components/Team";
import PropertyShowcase3D from "@/components/PropertyShowcase3D";
import JourneyScroll from "@/components/JourneyScroll";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <MarqueeStrip
        items={[
          "DISCOVER",
          "TOUR",
          "NEGOTIATE",
          "CLOSE",
          "LUXURY LISTINGS",
          "CONCIERGE SERVICE",
        ]}
      />
      <About />
      <PropertyShowcase3D />
      <JourneyScroll />
      <Team />
      <ContactSection />
    </>
  );
}
