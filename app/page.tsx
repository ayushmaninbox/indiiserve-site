import { Hero, ScrollPortfolio, About, Services, Work, Testimonials, FAQ, ContactCTA } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollPortfolio />
      <About />
      <Services />
      <Work />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </main>
  );
}
