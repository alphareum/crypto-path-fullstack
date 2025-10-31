import { useEffect, useState } from "react";

const stats = [
  { value: 50, label: "Free Spots Available", suffix: "" },
  { value: 100, label: "Live Events", suffix: "+" },
  { value: 24, label: "24/7 Community Chat", suffix: "/7" },
];

const CommunityHighlights = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const timers = stats.map((stat, index) => {
      const increment = stat.value / steps;
      let currentStep = 0;

      return setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = Math.min(Math.round(increment * currentStep), stat.value);
            return newCounts;
          });
        }
      }, stepDuration);
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, []);

  return (
    <section id="community" className="py-24 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 matrix-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Growing <span className="text-gradient-gold">Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join a vibrant community of traders and learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-morphism p-8 rounded-lg border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-gradient-gold mb-4">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <div className="text-lg text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Features */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <h3 className="text-xl font-bold mb-2 text-primary">Active Discussions</h3>
              <p className="text-muted-foreground">
                Engage in daily discussions about market trends, trading strategies, and crypto news
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <h3 className="text-xl font-bold mb-2 text-primary">Weekly Events</h3>
              <p className="text-muted-foreground">
                Participate in webinars, Q&A sessions, and live trading analysis with experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHighlights;
