import HeroSection from "@/components/HeroSection";
import WorkScrollSection from "@/components/WorkScrollSection";
import ProjectsSection from "@/components/ProjectsSection";
import CompetenciesSection from "@/components/CompetenciesSection";
import ReviewsSection from "@/components/ReviewsSection";
import CTASection from "@/components/CTASection";
import LightPillar from "@/components/LightPillar";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black w-full overflow-x-clip">
      {/* Persistent Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightPillar
          topColor="#000000"
          bottomColor="#8c2c03"
          intensity={1.7}
          rotationSpeed={0.8}
          pillarWidth={2.9}
          pillarHeight={0.7}
          noiseIntensity={0}
          pillarRotation={309}
        />
      </div>

      {/* Content Layers */}
      <div className="relative z-10 w-full">
        <HeroSection />
        <WorkScrollSection />
        <ProjectsSection />
        <CompetenciesSection />
        <ReviewsSection />
        <CTASection />
      </div>
    </main>
  );
}
