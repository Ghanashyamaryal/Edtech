'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  Video,
  Play,
  Calendar,
  Clock,
  Users,
  Star,
  Bell,
  ChevronRight,
  Monitor,
  Headphones,
  MessageSquare,
  CheckCircle2,
  Zap,
  Award,
} from 'lucide-react';
import Link from 'next/link';

// Live class happening now
const liveNow = {
  id: 1,
  title: 'Calculus: Differentiation Techniques',
  instructor: 'Dr. Ramesh Sharma',
  subject: 'Mathematics',
  students: 234,
  startedAt: '15 min ago',
  thumbnail: null,
};

// Upcoming classes
const upcomingClasses = [
  {
    id: 1,
    title: 'Data Structures: Binary Trees',
    instructor: 'Prof. Sita Devi',
    subject: 'Computer Science',
    date: 'Today',
    time: '2:00 PM',
    duration: '90 min',
    enrolled: 156,
  },
  {
    id: 2,
    title: 'English Grammar: Tenses',
    instructor: 'Mr. John Thapa',
    subject: 'English',
    date: 'Today',
    time: '4:30 PM',
    duration: '60 min',
    enrolled: 89,
  },
  {
    id: 3,
    title: 'Physics: Electromagnetic Waves',
    instructor: 'Dr. Anita Gurung',
    subject: 'Physics',
    date: 'Tomorrow',
    time: '10:00 AM',
    duration: '90 min',
    enrolled: 178,
  },
  {
    id: 4,
    title: 'Logical Reasoning: Series Problems',
    instructor: 'Mr. Binod Thapa',
    subject: 'Reasoning',
    date: 'Tomorrow',
    time: '2:00 PM',
    duration: '60 min',
    enrolled: 134,
  },
];

// Featured instructors
const instructors = [
  {
    id: 1,
    name: 'Dr. Ramesh Sharma',
    subject: 'Mathematics',
    rating: 4.9,
    students: 5600,
    classes: 245,
    image: null,
  },
  {
    id: 2,
    name: 'Prof. Sita Devi',
    subject: 'Computer Science',
    rating: 4.8,
    students: 4200,
    classes: 198,
    image: null,
  },
  {
    id: 3,
    name: 'Dr. Anita Gurung',
    subject: 'Physics',
    rating: 4.9,
    students: 3800,
    classes: 167,
    image: null,
  },
  {
    id: 4,
    name: 'Mr. John Thapa',
    subject: 'English',
    rating: 4.7,
    students: 3200,
    classes: 156,
    image: null,
  },
];

// Features of online classes
const features = [
  {
    icon: Monitor,
    title: 'HD Video Quality',
    description: 'Crystal clear video and audio for the best learning experience',
  },
  {
    icon: MessageSquare,
    title: 'Live Q&A',
    description: 'Ask questions in real-time and get instant answers from instructors',
  },
  {
    icon: Headphones,
    title: 'Recording Access',
    description: 'Missed a class? Watch recordings anytime from your dashboard',
  },
  {
    icon: Users,
    title: 'Interactive Sessions',
    description: 'Participate in polls, quizzes, and group discussions',
  },
];

export default function OnlineClassesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              Live & Interactive
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn Live with <span className="text-gradient-success">Expert Instructors</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Join interactive live classes, ask questions in real-time, and learn from
              the best educators in Nepal. Never miss a class with our recording feature.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Learning
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Calendar className="w-5 h-5" />
                View Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Now Section */}
      <section className="py-12 bg-destructive/5 border-y border-destructive/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                </span>
                <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center">
                  <Video className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-destructive mb-1">LIVE NOW</p>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {liveNow.title}
                </h2>
                <p className="text-muted-foreground">
                  {liveNow.instructor} · {liveNow.subject}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 lg:ml-auto"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span>{liveNow.students} watching</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>Started {liveNow.startedAt}</span>
              </div>
              <Button className="gap-2 bg-destructive hover:bg-destructive/90">
                <Play className="w-5 h-5" />
                Join Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-medium transition-shadow">
                    <CardContent className="pt-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Classes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Upcoming Classes
              </h2>
            </div>
            <Link href="/schedule">
              <Button variant="outline" className="gap-2">
                Full Schedule
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-strong transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-2xl bg-primary/10">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">
                              {classItem.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {classItem.instructor}
                            </p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium whitespace-nowrap">
                            {classItem.subject}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {classItem.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {classItem.time} ({classItem.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {classItem.enrolled} enrolled
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <Button className="flex-1">Enroll Now</Button>
                          <Button variant="outline" size="icon" title="Set Reminder">
                            <Bell className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              Expert Educators
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Learn from the <span className="text-gradient-accent">Best Instructors</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our instructors are experienced educators with proven track records of
              helping students achieve top ranks.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-strong transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="font-display text-2xl font-bold text-primary">
                        {instructor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {instructor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {instructor.subject}
                    </p>

                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-medium">{instructor.rating}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                      <span>{instructor.students.toLocaleString()} students</span>
                      <span>{instructor.classes} classes</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Live Classes */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Why Live Classes?
              </span>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Interactive Learning that Gets Results
              </h2>
              <p className="text-muted-foreground mb-8">
                Live classes offer a unique blend of structure and flexibility. Get the
                benefit of real-time interaction while having access to recordings for
                revision.
              </p>

              <div className="space-y-4">
                {[
                  'Ask questions and get instant clarification',
                  'Learn alongside peers in a virtual classroom',
                  'Stay motivated with scheduled sessions',
                  'Access recordings if you miss a class',
                  'Get personalized feedback from instructors',
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/auth/signup">
                  <Button size="lg" className="gap-2">
                    Join Your First Class
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="shadow-strong">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-muted rounded-xl flex items-center justify-center mb-4">
                    <div className="p-4 rounded-full bg-primary/20">
                      <Play className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Sample Class Preview</p>
                      <p className="text-sm text-muted-foreground">
                        See how our live classes work
                      </p>
                    </div>
                    <Button variant="outline">Watch Demo</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -left-4 bg-gold text-gold-foreground px-4 py-2 rounded-xl shadow-glow-accent font-semibold text-sm"
              >
                500+ Hours of Live Content
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
