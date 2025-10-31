import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const ModernHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 500);
      const scale = Math.max(0.9, 1 - scrollY / 2000);
      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `scale(${scale})`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Subtle Dark Background */}
      <div className="absolute inset-0 bg-background">
        {/* Very subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      </div>

      {/* Minimal Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(244, 180, 26, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(244, 180, 26, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Single subtle accent glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div
        ref={heroRef}
        className="container mx-auto px-4 relative z-10 transition-all duration-300"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Simple Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 bg-card/30 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="text-sm font-medium text-muted-foreground">
              Learn Crypto • Build Future
            </span>
          </div>

          {/* Clean Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            <span className="text-foreground">Crypto </span>
            <span className="text-primary">Path</span>
          </h1>

          {/* Subtitle - cleaner look */}
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in max-w-3xl mx-auto"
            style={{ animationDelay: "0.1s" }}
          >
            Belajar Crypto Secara{" "}
            <span className="text-primary font-medium">Praktikal</span>{" "}
            dan Terbuka
          </p>

          {/* Description */}
          <p
            className="text-base md:text-lg text-muted-foreground/80 mb-12 animate-fade-in max-w-2xl mx-auto"
            style={{ animationDelay: "0.2s" }}
          >
            Master blockchain technology with hands-on modules, interactive
            learning, and real-world projects. Join our community of crypto
            enthusiasts.
          </p>

          {/* CTA Buttons - simpler design */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/modules">
              <Button
                variant="default"
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 text-base rounded-lg transition-all duration-300"
              >
                Start Learning
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="group border border-border hover:border-primary/50 hover:bg-card px-8 py-6 text-base rounded-lg transition-all duration-300"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>

          {/* Features - minimal design */}
          <div
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { icon: "📚", label: "Video Courses", desc: "Step-by-step learning" },
              { icon: "📄", label: "Research Papers", desc: "Deep technical insights" },
              { icon: "💻", label: "Hands-on Labs", desc: "Interactive practice" },
            ].map((feature, index) => (
              <div key={index} className="group cursor-default text-center">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {feature.label}
                </div>
                <div className="text-xs text-muted-foreground/60">
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ModernHero;
