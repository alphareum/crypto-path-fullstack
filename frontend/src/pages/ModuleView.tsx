import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import * as progressService from "@/services/progressService";
import type { UserProgress } from "@/services/progressService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Code,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  slug: string;
  description: string | null;
  type: string;
  duration: string | null;
  order: number;
  video_url: string | null;
  pdf_url: string | null;
  content: string | null;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  completed?: boolean; // Client-side tracking
}

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
  lessons?: Lesson[]; // Lessons array from API
}

// Mock module data - will be replaced with API fetch
const moduleData_OLD = {
  id: 1,
  title: "Introduction to Blockchain",
  description: "Learn the fundamentals of blockchain technology and how it works",
  category: "Beginner",
  duration: "2h 30m",
  rating: 4.8,
  students: 1250,
  instructor: {
    name: "Ahmad Razak",
    avatar: "/placeholder.svg",
    title: "Blockchain Expert",
  },
  overview: `This comprehensive course introduces you to the revolutionary world of blockchain technology.
  You'll learn the core concepts, understand how blockchain networks operate, and explore real-world applications.

  By the end of this module, you'll have a solid foundation in blockchain technology and be ready to explore more advanced topics.`,
  learningOutcomes: [
    "Understand the fundamentals of blockchain technology",
    "Learn how distributed ledgers work",
    "Explore consensus mechanisms like Proof of Work and Proof of Stake",
    "Understand cryptocurrency basics",
    "Learn about smart contracts and their applications",
  ],
  lessons: [
    {
      id: 1,
      title: "What is Blockchain?",
      type: "video",
      duration: "12:30",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: 2,
      title: "History of Blockchain & Bitcoin",
      type: "video",
      duration: "15:45",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/qOVAbKKSH10",
    },
    {
      id: 3,
      title: "How Blockchain Works",
      type: "video",
      duration: "18:20",
      completed: true,
      videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: 4,
      title: "Distributed Ledger Technology",
      type: "video",
      duration: "14:15",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: 5,
      title: "Consensus Mechanisms",
      type: "video",
      duration: "20:00",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: 6,
      title: "Blockchain Architecture - Technical Paper",
      type: "pdf",
      duration: "25:00",
      completed: false,
      pdfUrl: "/sample-blockchain-paper.pdf",
    },
    {
      id: 7,
      title: "Smart Contracts Introduction",
      type: "video",
      duration: "16:30",
      completed: false,
      videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: 8,
      title: "Practical Exercise: Create Your First Transaction",
      type: "interactive",
      duration: "30:00",
      completed: false,
    },
  ],
};

const ModuleView = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Fetch module from API
  useEffect(() => {
    const fetchModule = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/modules/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModule(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch module');
        console.error('Error fetching module:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  // Fetch user progress if authenticated
  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated) return;

      try {
        setProgressLoading(true);
        const userProgress = await progressService.getProgress();
        setProgress(userProgress);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setProgressLoading(false);
      }
    };

    fetchProgress();
  }, [isAuthenticated]);

  // Merge progress data with lessons
  const lessons = (module?.lessons || []).map(lesson => ({
    ...lesson,
    completed: progressService.isLessonCompleted(progress, lesson.id),
  }));

  // Calculate progress based on completed lessons
  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
  const currentLessonData = lessons[currentLesson];

  // Handle marking lesson as complete/incomplete
  const handleToggleComplete = async () => {
    if (!isAuthenticated || !currentLessonData) return;

    try {
      setMarkingComplete(true);

      if (currentLessonData.completed) {
        // Mark as incomplete (remove progress)
        await progressService.markLessonIncomplete(currentLessonData.id);
        setProgress(prev => prev.filter(p => p.lesson_id !== currentLessonData.id));
      } else {
        // Mark as complete
        const newProgress = await progressService.markLessonComplete(currentLessonData.id);
        setProgress(prev => [...prev, newProgress]);
      }
    } catch (err) {
      console.error('Error toggling lesson completion:', err);
      alert('Failed to update progress. Please try again.');
    } finally {
      setMarkingComplete(false);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
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
            <p className="text-lg text-muted-foreground">Loading module...</p>
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
            <h3 className="text-xl font-semibold mb-2">Failed to Load Module</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/modules">
              <Button>
                Back to Modules
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Module not found
  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Module Not Found</h3>
            <Link to="/modules">
              <Button>Back to Modules</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="pt-20">
        {/* Video/Content Player */}
        <div className="bg-background border-b border-border/30">
          <div className="container mx-auto px-4 py-4">
            {lessons.length > 0 && currentLessonData ? (
              <div className="aspect-video bg-card/40 rounded-lg overflow-hidden">
                {/* Video Lesson */}
                {currentLessonData.type === 'video' && currentLessonData.video_url && (
                  <iframe
                    src={currentLessonData.video_url}
                    title={currentLessonData.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {/* PDF Lesson */}
                {currentLessonData.type === 'pdf' && currentLessonData.pdf_url && (
                  <div className="flex items-center justify-center h-full bg-card">
                    <div className="text-center p-8">
                      <FileText className="w-20 h-20 mx-auto mb-4 text-primary" />
                      <h3 className="text-2xl font-bold mb-2">{currentLessonData.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {currentLessonData.description}
                      </p>
                      <Button asChild>
                        <a href={currentLessonData.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          Open PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Interactive Lesson */}
                {currentLessonData.type === 'interactive' && (
                  <div className="flex items-center justify-center h-full bg-card">
                    <div className="text-center p-8">
                      <Code className="w-20 h-20 mx-auto mb-4 text-primary" />
                      <h3 className="text-2xl font-bold mb-2">{currentLessonData.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {currentLessonData.description}
                      </p>
                      <Badge variant="secondary">Interactive Exercise</Badge>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-card/40 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <BookOpen className="w-20 h-20 mx-auto mb-4 text-primary/60" />
                  <h3 className="text-2xl font-bold mb-2">No Lessons Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Lessons are being prepared for this module. Check back soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Module Info */}
              <div>
                <Link
                  to="/modules"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Modules
                </Link>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {module.duration || "TBD"}
                      </span>
                      <Badge variant="secondary">{module.category}</Badge>
                      <Badge variant="secondary">{module.type}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Progress value={progressPercentage} className="h-2 mb-4" />
                <p className="text-sm text-muted-foreground">
                  {lessons.length > 0
                    ? `${completedLessons} of ${lessons.length} lessons completed (${Math.round(progressPercentage)}%)`
                    : 'No lessons available yet'
                  }
                </p>
              </div>

              <Separator />

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About This Module</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {module.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                    <Card className="bg-card/50">
                      <CardContent className="p-6 text-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                          Learning outcomes will be available once lessons are added
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Instructor</h3>
                    <Card>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold">
                          CP
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            Crypto Path Team
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Educational Platform
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Materials</CardTitle>
                        <CardDescription>Download additional resources</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Blockchain Fundamentals - Slides.pdf
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Code className="w-4 h-4 mr-2" />
                          Sample Code Repository
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Recommended Reading List
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="discussion" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Discussion & Q&A</CardTitle>
                      <CardDescription>
                        Ask questions and discuss with fellow learners
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          No discussions yet. Be the first to start a conversation!
                        </p>
                        <Button variant="default">Start Discussion</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Navigation and Progress Buttons */}
              <div className="flex flex-col gap-4 pt-6">
                {/* Mark Complete Button (only if authenticated) */}
                {isAuthenticated && currentLessonData && (
                  <div className="flex justify-center">
                    <Button
                      variant={currentLessonData.completed ? "outline" : "default"}
                      onClick={handleToggleComplete}
                      disabled={markingComplete}
                      className="min-w-[200px]"
                    >
                      {markingComplete ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : currentLessonData.completed ? (
                        <>
                          <Circle className="w-4 h-4 mr-2" />
                          Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={currentLesson === 0 || lessons.length === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleNextLesson}
                    disabled={currentLesson === lessons.length - 1 || lessons.length === 0}
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar - Lessons List */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>
                    {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} • {module.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {lessons.length > 0 ? (
                    <div className="space-y-1">
                      {lessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(index)}
                          className={`w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors ${
                            currentLesson === index ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm mb-1 ${
                                currentLesson === index ? 'text-primary' : ''
                              }`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {lesson.type === 'video' && <Play className="w-3 h-3" />}
                                {lesson.type === 'pdf' && <FileText className="w-3 h-3" />}
                                {lesson.type === 'interactive' && <Code className="w-3 h-3" />}
                                <span>{lesson.duration || 'TBD'}</span>
                                {lesson.is_free && (
                                  <Badge variant="outline" className="text-xs">Free</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No lessons available yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ModuleView;
