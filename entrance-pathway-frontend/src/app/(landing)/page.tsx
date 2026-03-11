'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import {
  ArrowRight,
  Star,
  Users,
  Trophy,
  BookOpen,
  CheckCircle2,
  Target,
  Award,
  Video,
  FileText,
  MessageSquare,
  TrendingUp,
  GraduationCap,
  Clock,
  Sparkles,
  Play,
  Building2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { getPublishedCourses, type Course } from '@/actions';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Course accent styles
const courseStyles: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  'bsc-csit': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', iconBg: 'bg-indigo-500' },
  'bit': { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', iconBg: 'bg-violet-500' },
  'bca': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', iconBg: 'bg-emerald-500' },
  'bim': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', iconBg: 'bg-amber-500' },
};
const defaultStyle = { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', iconBg: 'bg-primary' };

const features = [
  {
    icon: Target,
    title: 'Personalized Pathway',
    description: 'AI-powered learning path tailored to your strengths and weaknesses.',
  },
  {
    icon: Video,
    title: 'Live & Recorded Classes',
    description: 'Interactive sessions and on-demand lectures from top instructors.',
  },
  {
    icon: FileText,
    title: 'Mock Tests & Analytics',
    description: 'Real exam simulations with detailed performance tracking.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Notes',
    description: 'Well-structured study materials covering the entire syllabus.',
  },
  {
    icon: MessageSquare,
    title: 'Mentor Guidance',
    description: 'Personalized feedback and support from experienced mentors.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visual dashboards to track your growth and stay focused.',
  },
];

const testimonials = [
  {
    name: 'Aarav Sharma',
    course: 'BSc CSIT',
    achievement: 'Rank #3 — TU Entrance 2025',
    quote: 'Entrance Pathway completely transformed my preparation. The structured approach and mock tests helped me achieve a top rank!',
  },
  {
    name: 'Priya Thapa',
    course: 'BIT',
    achievement: 'Rank #8 — PU Entrance 2025',
    quote: 'The live classes and mentor feedback were game-changers. I could clarify doubts instantly and stay on track.',
  },
  {
    name: 'Bikash Gurung',
    course: 'BCA',
    achievement: 'Rank #5 — TU Entrance 2025',
    quote: 'Amazing platform. The analytics helped me focus on weak areas effectively. Highly recommended!',
  },
];

export default function HomePage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);

  React.useEffect(() => {
    async function loadCourses() {
      setLoadingCourses(true);
      const result = await getPublishedCourses({ limit: 4 });
      if (result.success) setCourses(result.data);
      setLoadingCourses(false);
    }
    loadCourses();
  }, []);

  return (
    <>
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-40 lg:pb-28">
        {/* Subtle bg elements */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Nepal&apos;s #1 Entrance Preparation Platform
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Your pathway from
                <br />
                <span className="text-primary">preparation</span> to{' '}
                <span className="bg-linear-to-r from-secondary to-emerald-500 bg-clip-text text-transparent">celebration</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Comprehensive prep for BSc CSIT, BCA, BIT & BIM entrance exams.
                Expert video lectures, live classes, 10,000+ practice questions, and real mock tests.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2 font-semibold">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Explore Courses
                  </Button>
                </Link>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span><strong className="text-foreground">95%</strong> Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span><strong className="text-foreground">5,000+</strong> Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-500" />
                  </div>
                  <span><strong className="text-foreground">4.8</strong> Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg p-6 overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">My Pathway</p>
                    <p className="text-xs text-muted-foreground">BSc CSIT Preparation</p>
                  </div>
                  <span className="text-sm font-bold text-primary">72% Ready</span>
                </div>

                {/* Progress */}
                <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="h-full rounded-full bg-linear-to-r from-primary to-primary/70"
                  />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-2xl font-bold text-emerald-600">85%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-2xl font-bold text-amber-600">45</p>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">#23</p>
                    <p className="text-xs text-muted-foreground">Your Rank</p>
                  </div>
                </div>

                {/* Subject progress bars */}
                <div className="space-y-3">
                  {[
                    { name: 'Mathematics', pct: 88, color: 'bg-indigo-500' },
                    { name: 'Computer Science', pct: 72, color: 'bg-emerald-500' },
                    { name: 'Physics', pct: 65, color: 'bg-amber-500' },
                    { name: 'English', pct: 50, color: 'bg-violet-500' },
                  ].map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{s.name}</span>
                        <span className="font-medium text-foreground">{s.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className={`h-full rounded-full ${s.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge - top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-3 -right-3 bg-amber-500 text-white px-3.5 py-1.5 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                23 Selected Today!
              </motion.div>

              {/* Floating badge - bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute -bottom-3 -left-3 bg-card border border-border px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Top 10 Rank</p>
                  <p className="text-xs text-muted-foreground">Last Mock Test</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== COURSES ====== */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Our Programs
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Prepare for your dream course
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Tailored preparation for each entrance exam with expert-designed materials
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loadingCourses
              ? [...Array(4)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-1.5 bg-muted" />
                    <CardContent className="p-5 space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-muted animate-pulse" />
                      <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))
              : courses.map((course, i) => {
                  const style = courseStyles[course.slug] || defaultStyle;
                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link href={`/courses/${course.slug}`} className="block group">
                        <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                          <div className={`h-1.5 ${style.iconBg}`} />
                          <CardContent className="p-5">
                            <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-foreground mb-0.5">{course.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{course.fullName || course.title}</p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                              {course.studentCount && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {course.studentCount.toLocaleString()}
                                </span>
                              )}
                              {course.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  {course.rating.toFixed(1)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                Rs. {(course.discountedPrice ?? course.price).toLocaleString()}
                              </span>
                              <span className={`text-xs font-semibold ${style.text} flex items-center gap-0.5 group-hover:gap-1.5 transition-all`}>
                                View <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
          </div>

          {courses.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Courses <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A comprehensive toolkit designed for entrance exam success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/20 hover:shadow-sm transition-all duration-200 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Start in 3 simple steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Pick Your Course', desc: 'Choose BSc CSIT, BCA, BIT, or BIM preparation', icon: BookOpen },
              { step: '02', title: 'Study & Practice', desc: 'Watch lectures, solve questions, take mock tests', icon: Zap },
              { step: '03', title: 'Ace Your Entrance', desc: 'Walk into the exam room confident and prepared', icon: Trophy },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative"
              >
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                )}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">Step {item.step}</p>
                <h3 className="font-display font-bold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              Success Stories
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Hear from our top performers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.achievement}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/80 p-10 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
                Ready to start your journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of students already on their pathway to top IT colleges in Nepal.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                    Start Free Trial <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                    Talk to Us
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 7-day free trial</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No credit card needed</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
