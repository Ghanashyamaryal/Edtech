'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEnrolledCourses } from '@/hooks/use-courses';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import Link from 'next/link';
import {
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Video,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data, loading: coursesLoading } = useEnrolledCourses(user?.id || '');

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Daily tasks mock data - replace with real API data
  const dailyTasks = [
    { id: 1, title: 'Complete Physics Chapter 5', type: 'study', completed: true },
    { id: 2, title: 'Watch Chemistry Video: Organic Reactions', type: 'video', completed: false },
    { id: 3, title: 'Practice Math: Calculus Problems', type: 'practice', completed: false },
    { id: 4, title: 'Review Biology Notes', type: 'review', completed: false },
  ];

  const completedTasks = dailyTasks.filter((t) => t.completed).length;
  const progressPercentage = Math.round((completedTasks / dailyTasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title className="text-2xl md:text-3xl">
            Welcome back, {user?.full_name || 'Student'}!
          </Title>
          <Paragraph className="mt-1">
            Here&apos;s your pathway for today
          </Paragraph>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
          <Target className="w-5 h-5 text-secondary" />
          <span className="text-sm font-medium text-secondary">
            {progressPercentage}% of daily goals completed
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">
                  {coursesLoading ? '...' : data?.enrolledCourses?.length || 0}
                </Subtitle>
                <Small className="text-xs">Enrolled Courses</Small>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">12</Subtitle>
                <Small className="text-xs">Tests Completed</Small>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/20">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">48h</Subtitle>
                <Small className="text-xs">Study Hours</Small>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-accent/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">76%</Subtitle>
                <Small className="text-xs">Average Score</Small>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Pathway / Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Today&apos;s Pathway</CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedTasks}/{dailyTasks.length} tasks
            </span>
          </CardHeader>
          <CardContent>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Task list */}
            <div className="space-y-3">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    task.completed
                      ? 'bg-secondary/5 border-secondary/20'
                      : 'bg-card border-border hover:border-primary/30'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      task.completed
                        ? 'bg-secondary text-secondary-foreground'
                        : 'border-2 border-muted-foreground/30'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Paragraph
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </Paragraph>
                  </div>
                  {!task.completed && (
                    <Button variant="ghost" size="sm" className="text-primary">
                      Start
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/live-classes" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Video className="w-5 h-5 text-primary" />
                <span>Join Live Class</span>
              </Button>
            </Link>
            <Link href="/dashboard/mock-tests" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <FileText className="w-5 h-5 text-secondary" />
                <span>Take Mock Test</span>
              </Button>
            </Link>
            <Link href="/dashboard/study-materials" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <BookOpen className="w-5 h-5 text-gold" />
                <span>Study Materials</span>
              </Button>
            </Link>
            <Link href="/dashboard/analytics" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Continue Learning</CardTitle>
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading courses...</div>
            </div>
          ) : data?.enrolledCourses?.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.enrolledCourses.slice(0, 3).map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Subtitle as="h3" className="text-base line-clamp-2">
                      {enrollment.course.title}
                    </Subtitle>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/courses/${enrollment.course.slug}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Continue
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <Paragraph className="mb-4">No courses enrolled yet</Paragraph>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
