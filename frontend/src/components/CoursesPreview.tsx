import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const courses = [
  {
    title: "Crypto Fundamentals",
    level: "Beginner",
    description: "Master the basics of cryptocurrency, blockchain technology, and trading fundamentals",
    status: "Coming Soon",
    color: "bg-success/20 border-success",
  },
  {
    title: "Algorithmic Trading Basics",
    level: "Intermediate",
    description: "Learn to build and deploy basic trading algorithms and automation strategies",
    status: "Coming Soon",
    color: "bg-primary/20 border-primary",
  },
  {
    title: "Advanced Trading Bots",
    level: "Advanced",
    description: "Create sophisticated trading bots with AI integration and risk management",
    status: "Coming Soon",
    color: "bg-accent/20 border-accent",
  },
];

const CoursesPreview = () => {
  return (
    <section id="courses" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-gradient-gold">Learning Paths</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured courses to take you from beginner to advanced trader
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <div key={course.title} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              {/* Connection Line (desktop only) */}
              {index < courses.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/20 z-0"></div>
              )}
              
              <Card className={`border-2 ${course.color} hover:scale-105 transition-all duration-300 hover:shadow-2xl relative z-10 h-full`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="outline" className="border-primary text-primary">
                      {course.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Join to Access
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        {/* Path Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 glass-morphism px-6 py-3 rounded-full">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium">Start Your Journey</span>
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <span className="text-sm font-medium">Level Up</span>
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: "1s" }}></div>
            <span className="text-sm font-medium">Master Trading</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
