import { Hero, ScrollPortfolio, About, Services, Testimonials, FAQ, ContactCTA } from "@/components/sections";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollPortfolio />
      <About />
      <Services />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </main>
  );
}
