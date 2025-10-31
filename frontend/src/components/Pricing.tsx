import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    description: "Limited - 50 Spots Only",
    badge: "Limited Time",
    badgeVariant: "default" as const,
    features: [
      "Access to community chat",
      "Free resources and guides",
      "Event announcements",
      "Basic market insights",
    ],
    cta: "Claim Free Spot",
    ctaVariant: "success" as const,
    popular: false,
  },
  {
    name: "Member",
    price: "Rp 100.000",
    description: "Full Access to Everything",
    badge: "Best Value",
    badgeVariant: "default" as const,
    features: [
      "Everything in Free",
      "Priority support",
      "Exclusive content access",
      "Early access to courses",
      "1-on-1 mentorship sessions",
      "Private trading channels",
    ],
    cta: "Join Community",
    ctaVariant: "hero" as const,
    popular: true,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the <span className="text-primary">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Choose the plan that fits your trading journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`border ${
                plan.popular
                  ? "border-primary/50 bg-card/30"
                  : "border-border/30 bg-card/20"
              } transition-all duration-300 relative animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-muted-foreground/60 text-sm">/month</span>}
                </div>
                <CardDescription className="text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Button variant={plan.ctaVariant} className="w-full" size="lg">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All prices in Indonesian Rupiah. Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
