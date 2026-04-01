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
  TrendingUp,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Zap,
  BarChart3,
  Shield,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { getPublishedCourses, type Course } from '@/actions';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Course accent styles - using primary/secondary family only
const courseStyles: Record<string, { accent: string; iconBg: string; text: string }> = {
  'bsc-csit': { accent: 'bg-brand-primary/10', iconBg: 'bg-brand-primary', text: 'text-brand-primary' },
  'bit': { accent: 'bg-brand-orange/10', iconBg: 'bg-brand-orange', text: 'text-brand-orange' },
  'bca': { accent: 'bg-brand-accent-yellow/10', iconBg: 'bg-brand-accent-yellow', text: 'text-brand-accent-yellow' },
  'bim': { accent: 'bg-brand-muted-yellow/10', iconBg: 'bg-brand-muted-yellow', text: 'text-brand-muted-yellow' },
};
const defaultStyle = { accent: 'bg-brand-primary/10', iconBg: 'bg-brand-primary', text: 'text-brand-primary' };

const features = [
  {
    icon: Target,
    title: 'Personalized Learning Path',
    description: 'AI-powered study plans adapted to your pace, strengths, and target exam date.',
  },
  {
    icon: Video,
    title: 'Live & Recorded Classes',
    description: 'Daily interactive sessions plus an on-demand library from top instructors.',
  },
  {
    icon: FileText,
    title: 'Mock Tests & Analysis',
    description: 'Full-length exam simulations with question-level performance breakdown.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Notes',
    description: 'Concise, syllabus-aligned study materials you can access anywhere.',
  },
  {
    icon: Headphones,
    title: '1-on-1 Mentor Support',
    description: 'Get personalized guidance and doubt clearing from experienced mentors.',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Visual dashboards to track accuracy, speed, and weak areas over time.',
  },
];

const testimonials = [
  {
    name: 'Aarav Sharma',
    course: 'BSc CSIT',
    achievement: 'Rank #3 — TU Entrance 2025',
    quote: 'Entrance Pathway transformed my preparation. The structured approach and realistic mock tests helped me crack a top-3 rank.',
    avatar: 'AS',
  },
  {
    name: 'Priya Thapa',
    course: 'BIT',
    achievement: 'Rank #8 — PU Entrance 2025',
    quote: 'The live classes and instant doubt clearing were game-changers. I always felt supported and on track.',
    avatar: 'PT',
  },
  {
    name: 'Bikash Gurung',
    course: 'BCA',
    achievement: 'Rank #5 — TU Entrance 2025',
    quote: 'The analytics showed me exactly where I was weak. I focused on those areas and the results speak for themselves.',
    avatar: 'BG',
  },
];

const stats = [
  { value: '5,000+', label: 'Active Students', icon: Users },
  { value: '95%', label: 'Success Rate', icon: TrendingUp },
  { value: '200+', label: 'Video Lectures', icon: Video },
  { value: '10,000+', label: 'Practice Questions', icon: FileText },
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
      <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-b from-brand-primary/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-150 h-150 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-brand-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="w-full max-w-[1600px] relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            {/* Left — Text */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                Nepal&apos;s #1 Entrance Preparation Platform
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-bold text-foreground leading-[1.1] mb-5">
                Your pathway from
                <br />
                <span className="text-brand-primary">preparation</span> to{' '}
                <span className="text-brand-orange">celebration</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-6 leading-relaxed">
                Comprehensive preparation for BSc CSIT, BCA, BIT & BIM entrance exams.
                Expert video lectures, live classes, 10,000+ practice questions, and real mock tests.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white gap-2 font-semibold shadow-glow-primary">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 gap-2">
                    <BookOpen className="w-4 h-4" />
                    Explore Courses
                  </Button>
                </Link>
              </div>

              {/* Trust bar — Clean and professional */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                  </div>
                  <span><strong className="text-foreground">95%</strong> Success Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span><strong className="text-foreground">5,000+</strong> Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-brand-accent-yellow fill-brand-accent-yellow" />
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
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/70 to-secondary" />

                {/* Top bar */}
                <div className="flex items-center justify-between mb-5 mt-1">
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
                    className="h-full rounded-full bg-linear-to-r from-primary to-secondary"
                  />
                </div>

                {/* Stats grid — unified brand colors */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                    <p className="text-2xl font-bold text-brand-primary">85%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-brand-orange/5 border border-brand-orange/10">
                    <p className="text-2xl font-bold text-brand-orange">45</p>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
                    <p className="text-2xl font-bold text-brand-primary">#20</p>
                    <p className="text-xs text-muted-foreground">Your Rank</p>
                  </div>
                </div>

                {/* Subject progress bars — brand colors */}
                <div className="space-y-3">
                  {[
                    { name: 'Mathematics', pct: 88, color: 'bg-primary' },
                    { name: 'Computer Science', pct: 72, color: 'bg-brand-orange' },
                    { name: 'Physics', pct: 65, color: 'bg-brand-accent-yellow' },
                    { name: 'English', pct: 50, color: 'bg-brand-muted-yellow' },
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
                className="absolute -top-3 -right-3 bg-brand-primary text-white px-3.5 py-1.5 rounded-xl shadow-glow-primary text-sm font-semibold flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                23 Selected Today!
              </motion.div>

              {/* Floating badge - bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="absolute -bottom-10 -left-10 bg-card border border-border px-4 py-2.5 rounded-xl shadow-medium flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-orange" />
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

      {/* ====== STATS BAR ====== */}
      <section className="py-4 border-y border-border/50 bg-card">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="flex items-center gap-3 justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0"
                  >
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </motion.div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ====== COURSES ====== */}
      <section className="py-10 lg:py-12 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeUp} className="text-left mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Our Programs
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Prepare for your dream course
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
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
                        <Card className="h-full overflow-hidden border border-border/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                          <div className={`h-1.5 ${style.iconBg}`} />
                          <CardContent className="p-5">
                            <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-display font-bold text-lg text-foreground mb-0.5">{course.title}</h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{course.fullName || course.title}</p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                              {course.studentCount != null && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5" />
                                  {course.studentCount.toLocaleString()}
                                </span>
                              )}
                              {course.rating != null && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-brand-orange fill-brand-orange/80" />
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
            <div className="text-left mt-10">
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
      <section className="py-10 lg:py-12">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeUp} className="text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Features
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              A comprehensive toolkit designed for entrance exam success
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className="h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-brand-primary/20 hover:shadow-medium transition-all duration-200 group cursor-default">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-11 h-11 rounded-xl bg-brand-primary/5 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors"
                    >
                      <Icon className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                    </motion.div>
                    <h3 className="font-display font-bold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-10 lg:py-12 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Start in 3 simple steps
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From sign-up to exam day — we&apos;ve got your entire journey covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Pick Your Course', desc: 'Choose BSc CSIT, BCA, BIT, or BIM preparation and get a personalized study plan.', icon: BookOpen },
              { step: '02', title: 'Study & Practice', desc: 'Watch lectures, solve questions, take mock tests, and track your improvement.', icon: Zap },
              { step: '03', title: 'Ace Your Entrance', desc: 'Walk into the exam room confident, prepared, and ready to secure your rank.', icon: Trophy },
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
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-brand-primary/20" />
                )}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative z-10 w-16 h-16 rounded-2xl bg-brand-primary text-white flex items-center justify-center mx-auto mb-5 shadow-glow-primary cursor-default"
                >
                  <item.icon className="w-7 h-7" />
                </motion.div>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">Step {item.step}</p>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-10 lg:py-12">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeUp} className="text-left mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              Success Stories
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Hear from our top performers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Real students, real results — see how Entrance Pathway made the difference
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-brand-accent-yellow fill-brand-accent-yellow" />
                      ))}
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {t.avatar}
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
          </motion.div>
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="py-10 lg:py-12 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="w-3.5 h-3.5" />
                Why Entrance Pathway
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built by educators, <span className="text-brand-primary">trusted</span> by thousands
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We combine technology with expert teaching to create the most effective entrance
                preparation experience in Nepal.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Expert Faculty', desc: 'Learn from instructors who have mentored 100+ top rankers.' },
                  { title: 'Updated Content', desc: 'Syllabus-aligned materials updated for the latest exam patterns.' },
                  { title: 'Affordable Plans', desc: 'Quality preparation accessible to every student across Nepal.' },
                  { title: 'Community Support', desc: 'Join a peer network of motivated students preparing together.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — Achievement card */}
            <motion.div {...scaleIn}>
              <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg p-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-secondary to-primary" />
                <div className="text-center mb-6 mt-1">
                  <p className="font-display font-bold text-foreground text-lg mb-1">2025 Results Highlights</p>
                  <p className="text-sm text-muted-foreground">Our students&apos; achievements speak louder</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '47', label: 'Top 100 Rankers', color: 'text-brand-primary' },
                    { value: '12', label: 'Top 10 Ranks', color: 'text-brand-orange' },
                    { value: '95%', label: 'Pass Rate', color: 'text-brand-primary' },
                    { value: '4.8/5', label: 'Student Rating', color: 'text-brand-orange' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 rounded-xl bg-muted/50">
                      <p className={`text-3xl font-bold ${item.color} mb-1`}>{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-10 lg:py-12">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="relative overflow-hidden rounded-3xl bg-brand-primary p-8 md:p-16 text-center shadow-glow-primary">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            
            <div className="relative max-w-2xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Ready to secure your <span className="text-brand-orange">future</span>?
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Join 5,000+ students already on their pathway to top IT colleges in Nepal.
                Start your preparation today for free.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2 font-bold px-8 h-14 rounded-xl shadow-glow-brand transition-all hover:scale-105 active:scale-95">
                    Start Free Trial <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 px-8 h-14 rounded-xl">
                    Talk to Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
