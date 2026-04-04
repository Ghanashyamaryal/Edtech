'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import {
  BookOpen,
  Star,
  Users,
  Clock,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Building2,
  Calendar,
  ArrowRight,
  Trophy,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { getPublishedCourses, type Course } from '@/actions';

// Static course metadata for rich display
const courseMetadata: Record<string, {
  university: string;
  duration: string;
  stream: string;
  examSubjects: string[];
  highlights: string[];
  gradient: string;
  iconBg: string;
  accent: string;
}> = {
  'bsc-csit': {
    university: 'Tribhuvan University (IOST)',
    duration: '4 Years / 8 Semesters',
    stream: 'Science Only',
    examSubjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer'],
    highlights: ['Most technical IT program', '133+ affiliated colleges', '100 MCQs in 2 hours'],
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-500',
    accent: 'text-indigo-600',
  },
  'bit': {
    university: 'Purbanchal University',
    duration: '4 Years / 8 Semesters',
    stream: 'Any Stream (Math 100 marks)',
    examSubjects: ['Computer', 'English', 'Aptitude', 'Mathematics'],
    highlights: ['Project every semester', 'Highly practical', '21+ affiliated colleges'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500',
    accent: 'text-violet-600',
  },
  'bca': {
    university: 'Tribhuvan University (FoHSS)',
    duration: '4 Years / 8 Semesters',
    stream: 'Any Stream',
    examSubjects: ['English', 'Mathematics', 'Logic', 'General Knowledge'],
    highlights: ['Open to all streams', '127+ affiliated colleges', 'Widest accessibility'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500',
    accent: 'text-emerald-600',
  },
  'bim': {
    university: 'Tribhuvan University (FoM)',
    duration: '4 Years / 8 Semesters',
    stream: 'Any Stream',
    examSubjects: ['English', 'Mathematics', 'Logical Reasoning', 'General Awareness'],
    highlights: ['IT + Management blend', 'Uses CMAT exam', '40+ affiliated colleges'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500',
    accent: 'text-amber-600',
  },
};

// Comparison data
const comparisonData = [
  { label: 'University', csit: 'TU (IOST)', bit: 'PU', bca: 'TU (FoHSS)', bim: 'TU (FoM)' },
  { label: '+2 Stream', csit: 'Science', bit: 'Any*', bca: 'Any', bim: 'Any' },
  { label: 'Pass Marks', csit: '35%', bit: '35%', bca: '40%', bim: '40% (CMAT)' },
  { label: 'Focus', csit: 'Pure CS & IT', bit: 'Practical IT', bca: 'Computer Apps', bim: 'IT + Business' },
  { label: 'Colleges', csit: '133+', bit: '21+', bca: '127+', bim: '40+' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function CourseCard({ course, index }: { course: Course; index: number }) {
  const meta = courseMetadata[course.slug] || courseMetadata['bsc-csit'];
  const originalPrice = course.price;
  const discountedPrice = course.discountedPrice ?? course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/courses/${course.slug}`} className="block group">
        <Card className="h-full overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
          {/* Gradient top accent */}
          <div className={`h-1.5 ${meta.iconBg}`} />

          <CardContent className="p-0">
            <div className={`relative bg-linear-to-br ${meta.gradient} p-6 pb-8`}>
              {/* Badge row */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${meta.iconBg} flex items-center justify-center shadow-md`}>
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{meta.university}</p>
                  </div>
                </div>
                {course.isBestseller && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                )}
              </div>

              {/* Full name & description */}
              <p className="text-sm font-medium text-foreground/80 mb-2">
                {course.fullName || course.title}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                {course.description}
              </p>

              {/* Quick info chips */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {meta.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
                  <BookOpen className="w-3 h-3 text-muted-foreground" />
                  {meta.stream}
                </span>
              </div>

              {/* Entrance subjects */}
              <div className="mb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Entrance Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {meta.examSubjects.map((subject) => (
                    <span
                      key={subject}
                      className="text-xs bg-background border border-border/60 rounded-md px-2 py-1 text-foreground/70"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="p-6 pt-4">
              {/* Features checklist */}
              {course.features && course.features.length > 0 && (
                <div className="space-y-2 mb-5">
                  {course.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/50">
                {course.studentCount && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="font-medium text-foreground">{course.studentCount.toLocaleString()}</span>
                    <span className="hidden sm:inline">students</span>
                  </div>
                )}
                {course.rating && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
                    {course.reviewsCount && (
                      <span className="text-muted-foreground">({course.reviewsCount})</span>
                    )}
                  </div>
                )}
                {course.durationHours && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.durationHours}h content</span>
                  </div>
                )}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs font-semibold text-emerald-600">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-primary font-semibold text-sm group-hover:gap-2.5 transition-all">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const result = await getPublishedCourses({ limit: 20 });
      if (result.success) setCourses(result.data);
      setLoading(false);
    }
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="w-full max-w-[1600px] relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <motion.div {...fadeInUp} className="max-w-3xl text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Nepal&apos;s #1 Entrance Preparation Platform
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your pathway to
                <br />
                <span className="text-brand-primary"> top IT colleges</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                Expert-designed courses for BSc CSIT, BCA, BIT &amp; BIM entrance exams.
                Comprehensive study materials, live classes, and 10,000+ practice questions.
              </p>
              <div className="flex flex-wrap items-center justify-start gap-6 text-sm text-muted-foreground">
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
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-violet-600" />
                  </div>
                  <span><strong className="text-foreground">320+</strong> Partner Colleges</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Rank & Trends Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl border border-border/60 bg-card shadow-lg p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-brand-primary via-brand-primary/70 to-brand-orange" />

                <div className="flex items-center justify-between mb-5 mt-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Top Placement Trends</p>
                    <p className="text-xs text-muted-foreground">2025 College Rankings</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">Live Data</span>
                </div>

                {/* Ranking List */}
                <div className="space-y-4">
                  {[
                    { college: 'ASCOL (TU)', rank: '#1', rate: 92, color: 'text-brand-primary' },
                    { college: "St. Xavier's (TU)", rank: '#2', rate: 89, color: 'text-brand-orange' },
                    { college: 'BernHardt (TU)', rank: '#3', rate: 85, color: 'text-brand-primary' },
                    { college: 'KEC (KU)', rank: '#4', rate: 82, color: 'text-brand-orange' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.college}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center bg-muted ${item.color}`}>
                          {item.rank}
                        </span>
                        <span className="text-sm text-foreground/80 group-hover:text-brand-primary transition-colors cursor-default">{item.college}</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{item.rate}% placement</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-border/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Success Forecast</p>
                      <p className="text-sm font-bold text-foreground">Admission Probability</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-brand-primary">88.4%</p>
                      <p className="text-[10px] text-emerald-600 font-medium">↑ 4.2% from 2023</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge - top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="absolute -top-3 -right-3 bg-brand-orange text-white px-3.5 py-1.5 rounded-xl shadow-glow-brand text-sm font-semibold flex items-center gap-1.5 z-10"
              >
                <Trophy className="w-3.5 h-3.5" />
                #1 Prep App
              </motion.div>

              {/* Floating badge - bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-10 -left-8 bg-white border border-border px-4 py-2.5 rounded-xl shadow-medium flex items-center gap-3 z-30"
              >
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Top Performer</p>
                  <p className="text-[10px] text-muted-foreground">1,200+ Selected 2024</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-10 lg:py-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeInUp} className="text-left mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Program
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Each course is tailored to the specific entrance exam syllabus with expert guidance
            </p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                  <div className="h-1.5 bg-muted" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-7 w-20 bg-muted rounded-full animate-pulse" />
                      ))}
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {courses.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Courses coming soon</p>
              <p className="text-muted-foreground">Check back later for enrollment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeInUp} className="text-left mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Quick Comparison
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Not sure which program is right for you? Compare at a glance
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="max-w-4xl">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold text-muted-foreground min-w-[120px]">Feature</th>
                      <th className="text-center p-4 font-bold text-indigo-600 min-w-[100px]">BSc CSIT</th>
                      <th className="text-center p-4 font-bold text-violet-600 min-w-[100px]">BIT</th>
                      <th className="text-center p-4 font-bold text-emerald-600 min-w-[100px]">BCA</th>
                      <th className="text-center p-4 font-bold text-amber-600 min-w-[100px]">BIM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <td className="p-4 font-medium text-foreground">{row.label}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.csit}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.bit}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.bca}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.bim}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 border-t bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  * BIT requires Mathematics of 100 marks at +2 level, any stream accepted
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 lg:py-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <motion.div {...fadeInUp} className="text-left mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Start preparing in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Course',
                description: 'Pick the entrance exam you want to prepare for — BSc CSIT, BCA, BIT, or BIM',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Study & Practice',
                description: 'Access video lectures, live classes, notes, and 10,000+ practice questions',
                icon: GraduationCap,
              },
              {
                step: '03',
                title: 'Ace Your Entrance',
                description: 'Take mock tests, track progress, and walk into the exam with confidence',
                icon: TrendingUp,
              },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="relative text-center"
                >
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-border/60" />
                  )}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <StepIcon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h3 className="font-display font-bold text-lg text-foreground mt-2 mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 lg:py-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/80 p-10 md:p-16 text-center">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div className="relative">
              <Calendar className="w-10 h-10 text-primary-foreground/80 mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Entrance exams are around the corner
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                Don&apos;t wait until the last minute. Start your preparation today and join thousands of successful students.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                    Start Free Today
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
