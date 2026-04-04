'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
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
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import {
  getUpcomingLiveClasses,
  getLiveNowClasses,
  type LiveClass,
} from '@/actions/live-classes';
import {
  getPublishedLectures,
  type RecordedLecture,
} from '@/actions/recorded-lectures';

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getTimeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
}

export default function OnlineClassesPage() {
  const [liveNow, setLiveNow] = React.useState<LiveClass[]>([]);
  const [upcoming, setUpcoming] = React.useState<LiveClass[]>([]);
  const [recordings, setRecordings] = React.useState<RecordedLecture[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      const [liveResult, upcomingResult, recordingsResult] = await Promise.all([
        getLiveNowClasses(),
        getUpcomingLiveClasses(),
        getPublishedLectures({ limit: 4 }),
      ]);

      if (liveResult.success) setLiveNow(liveResult.data);
      if (upcomingResult.success) setUpcoming(upcomingResult.data);
      if (recordingsResult.success) setRecordings(recordingsResult.data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
              <Video className="w-4 h-4" />
              Live & Interactive
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Now Section */}
      {liveNow.length > 0 && (
        <section className="py-8 lg:py-10 bg-destructive/5 border-y border-destructive/20">
          <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            {liveNow.map((liveClass) => (
              <div key={liveClass.id} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
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
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-destructive/20 flex items-center justify-center">
                      <Video className="w-7 h-7 md:w-8 md:h-8 text-destructive" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-destructive mb-1">LIVE NOW</p>
                    <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
                      {liveClass.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {liveClass.instructor?.fullName || 'Instructor'} {liveClass.course ? `· ${liveClass.course.title}` : ''}
                    </p>
                  </div>
                </motion.div>

                <div className="flex flex-wrap items-center gap-4 lg:ml-auto">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Started {getTimeAgo(liveClass.scheduledAt)}</span>
                  </div>
                  {liveClass.meetingUrl && (
                    <a href={liveClass.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="gap-2 bg-destructive hover:bg-destructive/90">
                        <Play className="w-4 h-4" />
                        Join Now
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-10 lg:py-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                      </div>
                      <h3 className="font-display font-semibold text-foreground mb-2 text-sm md:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
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
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Upcoming Classes
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse" />
                      <div className="flex-1">
                        <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-4" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {upcoming.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-medium hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 md:p-4 rounded-2xl bg-primary/10 shrink-0">
                          <Video className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h3 className="font-display font-semibold text-lg text-foreground truncate">
                                {classItem.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {classItem.instructor?.fullName || 'Instructor'}
                              </p>
                            </div>
                            {classItem.course && (
                              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium whitespace-nowrap w-fit">
                                {classItem.course.title}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(classItem.scheduledAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(classItem.scheduledAt)} ({classItem.durationMinutes} min)
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            {classItem.meetingUrl ? (
                              <a href={classItem.meetingUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button className="w-full">Join Class</Button>
                              </a>
                            ) : (
                              <Button className="flex-1" disabled>
                                Link Coming Soon
                              </Button>
                            )}
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
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  No Upcoming Classes
                </h3>
                <p className="text-muted-foreground mb-4">
                  New classes are added regularly. Check back soon!
                </p>
                <Link href="/auth/signup">
                  <Button>Sign Up for Updates</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Recorded Lectures */}
      {recordings.length > 0 && (
        <section className="py-10 lg:py-16">
          <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-2">
                  <Play className="w-4 h-4" />
                  Recordings
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Recorded Lectures
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recordings.map((lecture, index) => (
                <motion.div
                  key={lecture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-medium hover:-translate-y-1 transition-all duration-200 group">
                    <CardContent className="pt-0 p-0">
                      <div className="aspect-video bg-muted rounded-t-xl flex items-center justify-center relative overflow-hidden">
                        {lecture.thumbnailUrl ? (
                          <img
                            src={lecture.thumbnailUrl}
                            alt={lecture.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Play className="w-10 h-10 text-muted-foreground" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {lecture.durationMinutes && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                            {lecture.durationMinutes} min
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {lecture.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {lecture.instructor?.fullName || 'Instructor'}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {lecture.viewCount.toLocaleString()} views
                          </span>
                          {lecture.subject && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {lecture.subject.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Live Classes */}
      <section className="py-10 lg:py-16 bg-accent">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Why Live Classes?
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
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
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
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
              <Card className="shadow-medium">
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
                className="absolute -bottom-4 -left-4 bg-brand-orange text-white px-4 py-2 rounded-xl shadow-glow-accent font-semibold text-sm"
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
