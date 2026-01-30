'use client';

import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Trophy,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Target,
  Award,
  Video,
  FileText,
  MessageSquare,
  TrendingUp,
  Quote,
} from 'lucide-react';
import Link from 'next/link';
import { GET_LANDING_COURSES } from '@/graphql/queries/courses';

// Course type from API
interface Course {
  id: string;
  title: string;
  fullName: string | null;
  slug: string;
  studentCount: number | null;
  rating: number | null;
}

// Stats data
const stats = [
  { icon: Users, value: '10,000+', label: 'Students' },
  { icon: Trophy, value: '95%', label: 'Selection Rate' },
  { icon: BookOpen, value: '500+', label: 'Lessons' },
];

// Features data
const features = [
  {
    icon: Target,
    title: 'Personalized Pathway',
    description:
      'AI-powered learning path tailored to your strengths and weaknesses for maximum efficiency.',
  },
  {
    icon: Video,
    title: 'Live & Recorded Classes',
    description:
      'Interactive live sessions and on-demand video lectures from expert instructors.',
  },
  {
    icon: FileText,
    title: 'Mock Tests & Analytics',
    description:
      'Real exam simulations with detailed performance analytics and improvement insights.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Notes',
    description:
      'Well-structured study materials covering every topic in the syllabus.',
  },
  {
    icon: MessageSquare,
    title: 'Mentor Support',
    description:
      'Get personalized guidance and feedback from experienced mentors.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Visual dashboards to monitor your preparation journey and stay motivated.',
  },
];

// Color palette for courses
const courseColors = ['primary', 'secondary', 'gold', 'primary'];

// Success stories
const testimonials = [
  {
    id: 1,
    name: 'Aarav Sharma',
    course: 'BSc CSIT',
    rank: 'Rank #3',
    college: 'TU Entrance 2025',
    image: null,
    quote:
      'Entrance Pathway completely transformed my preparation. The structured approach and mock tests helped me achieve a top rank!',
  },
  {
    id: 2,
    name: 'Priya Thapa',
    course: 'BIT',
    rank: 'Rank #8',
    college: 'PU Entrance 2025',
    image: null,
    quote:
      'The live classes and mentor feedback were game-changers. I could clarify my doubts instantly and stay on track.',
  },
  {
    id: 3,
    name: 'Bikash Gurung',
    course: 'BCA',
    rank: 'Rank #5',
    college: 'KU Entrance 2025',
    image: null,
    quote:
      'Amazing platform with comprehensive study materials. The analytics helped me focus on my weak areas effectively.',
  },
];

// Celebration wall data
const celebrations = [
  { name: 'Sita M.', rank: 'Top 10', course: 'CSIT', time: '2 min ago' },
  { name: 'Raj K.', rank: 'Top 5', course: 'BIT', time: '5 min ago' },
  { name: 'Anita S.', rank: 'Top 15', course: 'BCA', time: '10 min ago' },
  { name: 'Krishna B.', rank: 'Top 3', course: 'CSIT', time: '15 min ago' },
];

export default function HomePage() {
  const { data: coursesData, loading: loadingCourses } = useQuery(GET_LANDING_COURSES);
  const courses: Course[] = coursesData?.courses?.slice(0, 4) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-sm font-medium text-primary">
                  Nepal&apos;s #1 Entrance Prep Platform
                </span>
              </motion.div>

              {/* Headline */}
              <Title className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                From <span className="text-gradient-primary">Preparation</span>
                <br />
                to <span className="text-gradient-accent">Celebration</span>
              </Title>

              {/* Subheadline */}
              <Paragraph className="text-lg mb-8 max-w-lg">
                Your complete pathway to BSc CSIT, BIT, BCA, BIM & Engineering IT
                entrance success. Personalized learning, real exam simulation, and
                proven results.
              </Paragraph>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Subtitle as="p" className="font-display text-xl">
                        {stat.value}
                      </Subtitle>
                      <Small className="text-sm">{stat.label}</Small>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="relative bg-card rounded-3xl shadow-strong p-6 lg:p-8 border border-border">
                {/* Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Subtitle as="h3" className="font-display text-lg">My Pathway</Subtitle>
                    <Small className="text-sm text-primary font-medium">72% Ready</Small>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>

                  {/* Mock Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-3 bg-secondary/10 rounded-xl">
                      <Subtitle as="p" className="font-display text-2xl text-secondary">
                        85%
                      </Subtitle>
                      <Small className="text-xs">Accuracy</Small>
                    </div>
                    <div className="text-center p-3 bg-gold/10 rounded-xl">
                      <Subtitle as="p" className="font-display text-2xl text-gold">45</Subtitle>
                      <Small className="text-xs">Days Left</Small>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-xl">
                      <Subtitle as="p" className="font-display text-2xl text-primary">
                        #23
                      </Subtitle>
                      <Small className="text-xs">Rank</Small>
                    </div>
                  </div>

                  {/* Topic Progress */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Mathematics</span>
                      <span className="text-secondary font-medium">Strong</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Computer Science</span>
                      <span className="text-gold font-medium">Growing</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">English</span>
                      <span className="text-destructive font-medium">Focus Needed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 bg-gold text-gold-foreground px-4 py-2 rounded-xl shadow-glow-accent font-semibold text-sm"
              >
                23 Selected Today!
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 -left-4 bg-card border border-border px-4 py-3 rounded-xl shadow-medium flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Subtitle as="p" className="text-sm">Top 10 Rank</Subtitle>
                  <Small className="text-xs">Last Mock Test</Small>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Why Choose Us
            </span>
            <Title as="h2" className="font-display text-3xl md:text-4xl mb-4">
              Everything You Need to <span className="text-gradient-primary">Succeed</span>
            </Title>
            <Paragraph className="max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need
              to ace your entrance exams and secure your dream college.
            </Paragraph>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Card className="h-full hover:shadow-medium transition-shadow border-border hover:border-primary/30">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Subtitle as="h3" className="font-display text-lg mb-2">
                        {feature.title}
                      </Subtitle>
                      <Paragraph>{feature.description}</Paragraph>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Our Courses
            </span>
            <Title as="h2" className="font-display text-3xl md:text-4xl mb-4">
              Prepare for Your <span className="text-gradient-success">Dream Course</span>
            </Title>
            <Paragraph className="max-w-2xl mx-auto">
              Comprehensive preparation packages designed specifically for each entrance
              exam with proven success rates.
            </Paragraph>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingCourses ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-2xl mb-4 bg-muted animate-pulse" />
                    <div className="h-6 w-24 mb-1 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-40 mb-4 bg-muted rounded animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : courses.length > 0 ? (
              courses.map((course, index) => {
                const color = courseColors[index % courseColors.length];
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/courses/${course.slug}`}>
                      <Card className="h-full hover:shadow-strong transition-all hover:-translate-y-1 cursor-pointer group">
                        <CardContent className="pt-6">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                          >
                            <span className={`font-display font-bold text-xl text-${color}`}>
                              {course.title.charAt(0)}
                            </span>
                          </div>
                          <Subtitle as="h3" className="font-display text-xl mb-1">
                            {course.title}
                          </Subtitle>
                          <Small className="text-sm mb-4 block">
                            {course.fullName || course.title}
                          </Small>
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              {(course.studentCount || 0).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1 text-gold">
                              <Star className="w-4 h-4 fill-gold" />
                              {course.rating?.toFixed(1) || '4.8'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              // No courses fallback
              <div className="col-span-4 text-center py-8">
                <Paragraph className="text-muted-foreground">
                  No courses available yet. Check back soon!
                </Paragraph>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="gap-2">
                View All Courses
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Celebration Wall */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-gold/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Subtitle as="h3" className="font-display text-2xl mb-2">
                Celebration Wall
              </Subtitle>
              <Paragraph>
                Real-time success stories from our students
              </Paragraph>
            </div>
            <div className="flex flex-wrap gap-4">
              {celebrations.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 px-4 py-2 bg-card rounded-full border border-border shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <Paragraph className="text-sm font-medium text-foreground">
                      {item.name} - {item.rank}
                    </Paragraph>
                    <Small className="text-xs">
                      {item.course} · {item.time}
                    </Small>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Success Stories
            </span>
            <Title as="h2" className="font-display text-3xl md:text-4xl mb-4">
              From Our <span className="text-gradient-accent">Top Performers</span>
            </Title>
            <Paragraph className="max-w-2xl mx-auto">
              Hear from students who achieved their dreams with Entrance Pathway.
            </Paragraph>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20 mb-2" />
                    <Paragraph className="mb-6">
                      {testimonial.quote}
                    </Paragraph>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {testimonial.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <Subtitle as="p" className="text-base">
                          {testimonial.name}
                        </Subtitle>
                        <Small className="text-sm">
                          {testimonial.rank} · {testimonial.college}
                        </Small>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Title as="h2" className="font-display text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
              Ready to Start Your Journey to Success?
            </Title>
            <Paragraph className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of students who are already on their pathway to their dream
              college. Start your free trial today!
            </Paragraph>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10 gap-2"
                >
                  Talk to Us
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
