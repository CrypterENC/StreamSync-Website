import HeroSection from '@/components/HeroSection';
import FloatingNav from '@/components/FloatingNav';
import FeaturesSection from '@/components/FeaturesSection';
import CommandsSection from '@/components/CommandsSection';
import Changelog from '@/components/Changelog';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <FloatingNav />
      <HeroSection />
      <FeaturesSection />
      <CommandsSection />
      <Changelog />
      <Footer />
    </main>
  );
}
