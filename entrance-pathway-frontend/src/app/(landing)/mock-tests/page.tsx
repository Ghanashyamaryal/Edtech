'use client';

import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  FileText,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  BarChart3,
  Award,
  Zap,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  Timer,
  Shield,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { GET_LANDING_EXAMS } from '@/graphql/queries/exams';

// Exam type from API
interface Exam {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  examType: string | null;
  setNumber: number | null;
  questionsCount: number;
  courses: { id: string; title: string; slug: string }[];
}

// Test category config
const testCategoryConfig: Record<string, { name: string; description: string; icon: any; color: string }> = {
  full_model: {
    name: 'Full Model Tests',
    description: 'Complete entrance exam simulations',
    icon: FileText,
    color: 'primary',
  },
  subject: {
    name: 'Subject Tests',
    description: 'Focused tests for each subject',
    icon: BookOpen,
    color: 'secondary',
  },
  chapter: {
    name: 'Chapter Tests',
    description: 'Topic-wise practice tests',
    icon: Target,
    color: 'gold',
  },
  practice: {
    name: 'Practice Quizzes',
    description: 'Quick revision tests',
    icon: Zap,
    color: 'primary',
  },
  previous_year: {
    name: 'Previous Year Questions',
    description: 'Past exam papers with solutions',
    icon: Clock,
    color: 'secondary',
  },
};

// Features (static)
const features = [
  {
    icon: Timer,
    title: 'Real Exam Environment',
    description: 'Experience the actual exam pressure with timed tests and similar interface',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Get comprehensive analysis of your performance with improvement tips',
  },
  {
    icon: TrendingUp,
    title: 'All-Nepal Ranking',
    description: 'Compare your performance with students across Nepal',
  },
  {
    icon: Shield,
    title: 'Accurate Questions',
    description: 'Questions prepared by experts following the actual exam pattern',
  },
];

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} min`;
}

function getExamTypeLabel(examType: string | null): string {
  if (!examType) return 'Practice Test';
  return testCategoryConfig[examType]?.name || 'Practice Test';
}

export default function MockTestsPage() {
  const { data, loading } = useQuery(GET_LANDING_EXAMS);
  const exams: Exam[] = data?.exams || [];

  // Group exams by type for categories
  const examsByType = exams.reduce((acc, exam) => {
    const type = exam.examType || 'practice';
    if (!acc[type]) acc[type] = [];
    acc[type].push(exam);
    return acc;
  }, {} as Record<string, Exam[]>);

  // Create test categories from grouped exams
  const testCategories = Object.entries(testCategoryConfig)
    .filter(([type]) => examsByType[type]?.length > 0)
    .map(([type, config]) => ({
      id: type,
      name: config.name,
      description: config.description,
      tests: examsByType[type]?.length || 0,
      icon: config.icon,
      color: config.color,
    }));

  // Get featured exams (first 4 exams)
  const featuredExams = exams.slice(0, 4);

  // Calculate stats
  const totalTests = exams.length;
  const totalQuestions = exams.reduce((sum, exam) => sum + (exam.questionsCount || 0), 0);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              Practice Makes Perfect
            </span>
            <Title className="font-display text-4xl md:text-5xl mb-4">
              Mock Tests & <span className="text-gradient-accent">Practice Exams</span>
            </Title>
            <Paragraph className="text-lg mb-8">
              Simulate real exam conditions with our comprehensive mock tests. Track your
              progress, identify weak areas, and improve your scores with detailed analytics.
            </Paragraph>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Free Test
                  <Play className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                View Leaderboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, value: totalTests > 0 ? `${totalTests}+` : '0', label: 'Practice Tests', color: 'primary' },
              { icon: Users, value: '50,000+', label: 'Tests Taken', color: 'secondary' },
              { icon: Target, value: totalQuestions > 0 ? `${totalQuestions}+` : '0', label: 'Questions', color: 'gold' },
              { icon: Trophy, value: '10,000+', label: 'Top Rankers', color: 'primary' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`w-7 h-7 text-${stat.color}`} />
                  </div>
                  <Subtitle as="p" className="font-display text-3xl">
                    {stat.value}
                  </Subtitle>
                  <Small className="text-sm">{stat.label}</Small>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Test Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Title as="h2" className="font-display text-3xl mb-4">
              Choose Your Test Type
            </Title>
            <Paragraph className="max-w-2xl mx-auto">
              We offer various types of tests to match your preparation needs
            </Paragraph>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse mx-auto mb-2" />
                    <div className="h-4 w-40 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testCategories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-strong transition-all hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="pt-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-${category.color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className={`w-8 h-8 text-${category.color}`} />
                        </div>
                        <Subtitle as="h3" className="font-display text-lg mb-2">
                          {category.name}
                        </Subtitle>
                        <Small className="text-sm mb-4 block">
                          {category.description}
                        </Small>
                        <span className="inline-flex items-center gap-1 text-primary font-medium">
                          {category.tests} Tests
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Paragraph className="text-muted-foreground">
                No tests available yet. Check back soon!
              </Paragraph>
            </div>
          )}
        </div>
      </section>

      {/* Featured Tests */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Star className="w-4 h-4" />
                Popular
              </span>
              <Subtitle as="h2" className="font-display text-2xl">
                Featured Mock Tests
              </Subtitle>
            </div>
            <Link href="/mock-tests/all">
              <Button variant="outline" className="gap-2">
                Browse All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-muted animate-pulse w-12 h-12" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-5 w-48 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-full bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredExams.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {featuredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-strong transition-all">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                {getExamTypeLabel(exam.examType)}
                              </span>
                              {exam.setNumber && (
                                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                  Set {exam.setNumber}
                                </span>
                              )}
                            </div>
                            <Subtitle as="h3" className="font-display text-lg">
                              {exam.title}
                            </Subtitle>
                          </div>
                        </div>
                      </div>

                      {exam.description && (
                        <Paragraph className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {exam.description}
                        </Paragraph>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {exam.questionsCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(exam.durationMinutes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {exam.totalMarks} marks
                        </span>
                      </div>

                      {exam.courses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {exam.courses.slice(0, 2).map((course) => (
                            <span
                              key={course.id}
                              className="px-2 py-1 rounded-md bg-gold/10 text-gold text-xs font-medium"
                            >
                              {course.title}
                            </span>
                          ))}
                          {exam.courses.length > 2 && (
                            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                              +{exam.courses.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          Duration: {formatDuration(exam.durationMinutes)}
                        </div>
                        <Link href={`/dashboard/mock-tests/${exam.id}`}>
                          <Button className="gap-2">
                            <Play className="w-4 h-4" />
                            Start Test
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Paragraph className="text-muted-foreground">
                No tests available yet. Check back soon!
              </Paragraph>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Why Our Tests?
            </span>
            <Title as="h2" className="font-display text-3xl mb-4">
              Features That Set Us Apart
            </Title>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-medium transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Subtitle as="h3" className="font-display text-base mb-2">
                        {feature.title}
                      </Subtitle>
                      <Small className="text-sm">
                        {feature.description}
                      </Small>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Title as="h2" className="font-display text-3xl mb-4">
              How Mock Tests Work
            </Title>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Test',
                description: 'Select from full tests, subject tests, or quick quizzes',
              },
              {
                step: '02',
                title: 'Take Test',
                description: 'Complete the test in a simulated exam environment',
              },
              {
                step: '03',
                title: 'View Results',
                description: 'Get instant results with detailed explanations',
              },
              {
                step: '04',
                title: 'Improve',
                description: 'Track progress and focus on weak areas',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-xl font-bold text-primary">
                    {item.step}
                  </span>
                </div>
                <Subtitle as="h3" className="font-display text-lg mb-2">
                  {item.title}
                </Subtitle>
                <Small className="text-sm">{item.description}</Small>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-linear-to-r from-primary to-primary/80 border-0">
            <CardContent className="py-12">
              <div className="text-center max-w-2xl mx-auto">
                <Trophy className="w-16 h-16 text-primary-foreground/80 mx-auto mb-6" />
                <Title as="h2" className="font-display text-3xl text-primary-foreground mb-4">
                  Ready to Test Your Knowledge?
                </Title>
                <Paragraph className="text-primary-foreground/80 mb-8">
                  Take your first mock test for free and see how you compare with thousands
                  of other students across Nepal.
                </Paragraph>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 gap-2"
                    >
                      Start Free Test
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
