import Navigation from "@/components/Navigation";
import InteractiveHero from "@/components/InteractiveHero";
import Features from "@/components/Features";
import CoursesPreview from "@/components/CoursesPreview";
import CommunityHighlights from "@/components/CommunityHighlights";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <InteractiveHero />
      <Features />
      <CoursesPreview />
      <CommunityHighlights />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Index;
