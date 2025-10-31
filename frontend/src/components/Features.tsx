import { TrendingUp, Users, Video, Radio } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: TrendingUp,
    title: "Algo Trading Mastery",
    description: "Belajar cara pakai algoritma untuk trading crypto dengan strategi yang terbukti efektif",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Connect with traders, share insights, participate in live events and grow together",
  },
  {
    icon: Video,
    title: "Premium Content",
    description: "Access exclusive video courses and research papers from industry experts",
  },
  {
    icon: Radio,
    title: "Live Sessions",
    description: "Weekly webinars and real-time market analysis with experienced traders",
  },
];

const Features = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Join <span className="text-primary">Crypto Path</span>?
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Everything you need to master crypto trading and become part of a thriving community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`border border-border/30 bg-card/20 hover:border-border hover:bg-card/30 transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="mb-4 p-3 bg-card/40 rounded-lg inline-block group-hover:bg-primary/10 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary/80 group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-xl group-hover:text-foreground transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
