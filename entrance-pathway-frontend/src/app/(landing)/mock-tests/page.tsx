'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
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
  CheckCircle2,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  Timer,
  Shield,
  Play,
} from 'lucide-react';
import Link from 'next/link';

// Test categories
const testCategories = [
  {
    id: 1,
    name: 'Full Model Tests',
    description: 'Complete entrance exam simulations',
    tests: 25,
    icon: FileText,
    color: 'primary',
  },
  {
    id: 2,
    name: 'Subject Tests',
    description: 'Focused tests for each subject',
    tests: 120,
    icon: BookOpen,
    color: 'secondary',
  },
  {
    id: 3,
    name: 'Chapter Tests',
    description: 'Topic-wise practice tests',
    tests: 350,
    icon: Target,
    color: 'gold',
  },
  {
    id: 4,
    name: 'Quick Quizzes',
    description: '15-minute revision tests',
    tests: 200,
    icon: Zap,
    color: 'primary',
  },
];

// Featured tests
const featuredTests = [
  {
    id: 1,
    title: 'BSc CSIT Full Model Test - Set A',
    type: 'Full Test',
    questions: 150,
    duration: '3 hours',
    difficulty: 'Hard',
    attempts: 4520,
    avgScore: 72,
    isFree: true,
  },
  {
    id: 2,
    title: 'Mathematics: Calculus Complete',
    type: 'Subject Test',
    questions: 50,
    duration: '60 min',
    difficulty: 'Medium',
    attempts: 3200,
    avgScore: 68,
    isFree: true,
  },
  {
    id: 3,
    title: 'Computer Science Fundamentals',
    type: 'Subject Test',
    questions: 60,
    duration: '75 min',
    difficulty: 'Medium',
    attempts: 2890,
    avgScore: 74,
    isFree: false,
  },
  {
    id: 4,
    title: 'Logical Reasoning Quick Quiz',
    type: 'Quick Quiz',
    questions: 25,
    duration: '15 min',
    difficulty: 'Easy',
    attempts: 5600,
    avgScore: 78,
    isFree: true,
  },
];

// Statistics
const stats = [
  { icon: FileText, value: '500+', label: 'Practice Tests', color: 'primary' },
  { icon: Users, value: '50,000+', label: 'Tests Taken', color: 'secondary' },
  { icon: Target, value: '95%', label: 'Accuracy Rate', color: 'gold' },
  { icon: Trophy, value: '10,000+', label: 'Top Rankers', color: 'primary' },
];

// Features
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

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-secondary/10 text-secondary';
    case 'medium':
      return 'bg-gold/10 text-gold';
    case 'hard':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function MockTestsPage() {
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
            {stats.map((stat, index) => {
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

          <div className="grid md:grid-cols-2 gap-6">
            {featuredTests.map((test, index) => (
              <motion.div
                key={test.id}
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
                              {test.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                                test.difficulty
                              )}`}
                            >
                              {test.difficulty}
                            </span>
                            {test.isFree && (
                              <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                                Free
                              </span>
                            )}
                          </div>
                          <Subtitle as="h3" className="font-display text-lg">
                            {test.title}
                          </Subtitle>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {test.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {test.attempts.toLocaleString()} attempts
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Avg Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full"
                              style={{ width: `${test.avgScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-secondary">
                            {test.avgScore}%
                          </span>
                        </div>
                      </div>
                      <Button className="gap-2">
                        <Play className="w-4 h-4" />
                        Start Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
          <Card className="bg-gradient-to-r from-primary to-primary/80 border-0">
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
