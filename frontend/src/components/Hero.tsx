import { Button } from "@/components/ui/button";
import InteractiveParticles from "./InteractiveParticles";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Interactive Particle Network */}
      <InteractiveParticles />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient-gold">Crypto Path</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Belajar Crypto dari Secara Praktikal dan Terbuka
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="lg">
              Join Community
            </Button>
            <Button variant="outline" size="lg">
              Explore Content
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
