import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import * as progressService from "@/services/progressService";
import type { UserProgress } from "@/services/progressService";
import { API_URL } from "@/config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  FileText,
  BookOpen,
  Code,
  Trophy,
  Search,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Lock,
  TrendingUp,
  Zap,
  Loader2,
} from "lucide-react";

interface Module {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  type: string;
  duration: string;
  thumbnail: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Removed mock data - now fetching from API
const modulesData_OLD = [
  {
    id: 1,
    title: "Introduction to Blockchain",
    description: "Learn the fundamentals of blockchain technology and how it works",
    category: "Beginner",
    type: "video",
    duration: "2h 30m",
    lessons: 12,
    completed: 8,
    students: 1250,
    rating: 4.8,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["Blockchain", "Fundamentals", "Crypto Basics"],
  },
  {
    id: 2,
    title: "Smart Contracts Deep Dive",
    description: "Master Solidity and build your first smart contract",
    category: "Intermediate",
    type: "video",
    duration: "4h 15m",
    lessons: 18,
    completed: 3,
    students: 850,
    rating: 4.9,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["Solidity", "Smart Contracts", "Ethereum"],
  },
  {
    id: 3,
    title: "DeFi Protocol Analysis",
    description: "Research paper on decentralized finance protocols",
    category: "Advanced",
    type: "pdf",
    duration: "1h 45m",
    lessons: 1,
    completed: 0,
    students: 420,
    rating: 4.7,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["DeFi", "Research", "Protocol Design"],
  },
  {
    id: 4,
    title: "Web3 Development Bootcamp",
    description: "Build full-stack decentralized applications",
    category: "Advanced",
    type: "interactive",
    duration: "8h 00m",
    lessons: 24,
    completed: 0,
    students: 650,
    rating: 4.9,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["Web3", "dApps", "Full Stack"],
  },
  {
    id: 5,
    title: "NFT Marketplace Creation",
    description: "Create your own NFT marketplace from scratch",
    category: "Intermediate",
    type: "video",
    duration: "5h 30m",
    lessons: 20,
    completed: 0,
    students: 980,
    rating: 4.6,
    thumbnail: "/placeholder.svg",
    locked: true,
    tags: ["NFT", "Marketplace", "Smart Contracts"],
  },
  {
    id: 6,
    title: "Cryptocurrency Trading Strategies",
    description: "Learn technical analysis and trading fundamentals",
    category: "Beginner",
    type: "video",
    duration: "3h 20m",
    lessons: 15,
    completed: 15,
    students: 1500,
    rating: 4.5,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["Trading", "Technical Analysis", "Investing"],
  },
  {
    id: 7,
    title: "Blockchain Security & Auditing",
    description: "Comprehensive guide to smart contract security",
    category: "Advanced",
    type: "pdf",
    duration: "2h 10m",
    lessons: 1,
    completed: 0,
    students: 320,
    rating: 4.8,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["Security", "Auditing", "Best Practices"],
  },
  {
    id: 8,
    title: "DAO Governance Models",
    description: "Interactive module on decentralized governance",
    category: "Intermediate",
    type: "interactive",
    duration: "3h 45m",
    lessons: 10,
    completed: 0,
    students: 540,
    rating: 4.7,
    thumbnail: "/placeholder.svg",
    locked: false,
    tags: ["DAO", "Governance", "Tokenomics"],
  },
];

const Modules = () => {
  const { isAuthenticated } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progress, setProgress] = useState<UserProgress[]>([]);

  // Fetch modules from API on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/modules`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        console.error('Error fetching modules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Fetch user progress if authenticated
  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) return;

      try {
        const userProgress = await progressService.getProgress();
        setProgress(userProgress);
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };

    fetchProgress();
  }, [isAuthenticated]);

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "pdf":
        return <FileText className="w-4 h-4" />;
      case "interactive":
        return <Code className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Beginner":
        return "bg-success/5 text-success/80 border-success/10";
      case "Intermediate":
        return "bg-primary/5 text-primary/80 border-primary/10";
      case "Advanced":
        return "bg-accent/5 text-accent/80 border-accent/10";
      default:
        return "bg-muted/5 text-muted-foreground/60 border-muted/10";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading modules...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Modules</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Minimal background */}
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-background to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <Badge className="mb-4 px-4 py-2 text-sm border-border/50 bg-card/30" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learning <span className="text-primary">Modules</span>
            </h1>
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              Master crypto through comprehensive video courses, research papers, and interactive
              coding challenges. Learn at your own pace.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search modules, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-lg border border-border/50 focus:border-primary/50 bg-card/30"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Play, label: "Video Lessons", desc: "HD quality content" },
              { icon: FileText, label: "PDF Resources", desc: "Research papers" },
              { icon: Code, label: "Code Labs", desc: "Interactive coding" },
              { icon: TrendingUp, label: "Self-Paced", desc: "Learn your way" },
            ].map((feature, index) => (
              <Card key={index} className="border-border/30 bg-card/20">
                <CardContent className="pt-6 text-center">
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-primary/60" />
                  <div className="text-sm font-semibold text-foreground mb-1">{feature.label}</div>
                  <div className="text-xs text-muted-foreground/60">{feature.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedCategory}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-card/30 border border-border/30 p-1">
                <TabsTrigger value="All" className="px-6">
                  All Modules
                </TabsTrigger>
                <TabsTrigger value="Beginner" className="px-6">
                  Beginner
                </TabsTrigger>
                <TabsTrigger value="Intermediate" className="px-6">
                  Intermediate
                </TabsTrigger>
                <TabsTrigger value="Advanced" className="px-6">
                  Advanced
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module) => {
                  // Calculate progress for this module
                  const moduleProgress = progressService.getModuleProgress(progress, module.id);
                  const completedCount = moduleProgress.length;
                  const hasProgress = completedCount > 0;

                  return (
                    <Card
                      key={module.id}
                      className="group relative overflow-hidden border-border/30 bg-card/20 hover:border-border transition-all duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-40 overflow-hidden bg-card/40 border-b border-border/30">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40">
                          {getTypeIcon(module.type)}
                          <span className="ml-2 text-xs font-medium uppercase tracking-wider">
                            {module.type}
                          </span>
                        </div>
                        {/* All modules are currently unlocked - locked feature coming soon */}
                        <Badge
                          className={`absolute top-3 right-3 text-xs ${getCategoryColor(module.category)}`}
                        >
                          {module.category}
                        </Badge>
                      </div>

                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {module.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground/70">
                          {module.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Progress */}
                        {hasProgress && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-primary">
                                {completedCount} {completedCount === 1 ? 'lesson' : 'lessons'} completed
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Tags - Coming soon feature */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {module.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {module.type}
                          </Badge>
                        </div>

                        {/* Meta Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">{module.duration || "TBD"}</div>
                          </div>
                          <div className="text-center">
                            <BookOpen className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs text-muted-foreground">New</div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link to={`/modules/${module.id}`} className="w-full">
                          <Button
                            className="w-full"
                            variant="default"
                          >
                            {hasProgress ? (
                              <>
                                <Zap className="w-4 h-4 mr-2" />
                                Continue Learning
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start Module
                              </>
                            )}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredModules.length === 0 && (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No modules found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Modules;
