'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { getUserExamAttempts, getEnrolledCourses, getPublishedExams, type ExamAttempt } from '@/actions';
import { useAuth } from '@/context/auth-context';
import { useActiveCourse } from '@/context';

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { activeCourse, loading: activeCourseLoading } = useActiveCourse();
  const [examAttempts, setExamAttempts] = React.useState<ExamAttempt[]>([]);
  const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (activeCourseLoading) return;
    async function loadData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const [attemptsResult, coursesResult, courseExamsResult] = await Promise.all([
        getUserExamAttempts(user.id),
        getEnrolledCourses(user.id),
        activeCourse?.id ? getPublishedExams({ courseId: activeCourse.id }) : Promise.resolve(null),
      ]);

      if (attemptsResult.success) {
        let attempts = attemptsResult.data;
        if (courseExamsResult?.success) {
          const examIds = new Set(courseExamsResult.data.map((e) => e.id));
          attempts = attempts.filter((a) => examIds.has(a.exam.id));
        }
        setExamAttempts(attempts);
      }
      if (coursesResult.success) setEnrolledCourses(coursesResult.data);
      setLoading(false);
    }
    loadData();
  }, [user?.id, activeCourse?.id, activeCourseLoading]);

  // Completed attempts only
  const completedAttempts = examAttempts.filter((a) => a.completedAt);

  // Overall score
  const overallScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce((sum, a) => {
            return sum + ((a.score || 0) / (a.exam.totalMarks || 100)) * 100;
          }, 0) / completedAttempts.length
        )
      : 0;

  // Monthly comparison
  const now = new Date();
  const thisMonth = completedAttempts.filter((a) => {
    const d = new Date(a.completedAt!);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonth = completedAttempts.filter((a) => {
    const d = new Date(a.completedAt!);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });

  const thisMonthAvg =
    thisMonth.length > 0
      ? Math.round(
          thisMonth.reduce((s, a) => s + ((a.score || 0) / (a.exam.totalMarks || 100)) * 100, 0) / thisMonth.length
        )
      : 0;
  const lastMonthAvg =
    lastMonth.length > 0
      ? Math.round(
          lastMonth.reduce((s, a) => s + ((a.score || 0) / (a.exam.totalMarks || 100)) * 100, 0) / lastMonth.length
        )
      : 0;
  const monthChange = thisMonth.length > 0 && lastMonth.length > 0 ? thisMonthAvg - lastMonthAvg : 0;

  // Weekly study hours (from completed attempts in last 7 days)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const dayAttempts = completedAttempts.filter((a) => {
      const d = new Date(a.completedAt!);
      return d >= dayStart && d < dayEnd;
    });

    const minutes = dayAttempts.reduce((sum, a) => sum + (a.exam.durationMinutes || 0), 0);
    return {
      day: dayNames[dayStart.getDay()],
      hours: Math.round((minutes / 60) * 10) / 10,
    };
  });

  const weekTotalHours = Math.round(weeklyData.reduce((s, d) => s + d.hours, 0) * 10) / 10;
  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

  // Per-exam performance (group by exam ID)
  const examPerformance = new Map<string, { title: string; scores: number[] }>();
  completedAttempts.forEach((a) => {
    const key = a.exam.id;
    const pct = (a.exam.totalMarks || 100) > 0 ? ((a.score || 0) / (a.exam.totalMarks || 100)) * 100 : 0;
    if (examPerformance.has(key)) {
      examPerformance.get(key)!.scores.push(pct);
    } else {
      examPerformance.set(key, { title: a.exam.title, scores: [pct] });
    }
  });

  const performanceData = Array.from(examPerformance.values())
    .map((ep) => ({
      title: ep.title,
      avgScore: Math.round(ep.scores.reduce((s, v) => s + v, 0) / ep.scores.length),
      attempts: ep.scores.length,
      trend: ep.scores.length >= 2 ? (ep.scores[ep.scores.length - 1] > ep.scores[0] ? 'up' : 'down') : 'up',
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 6);

  // Recent activity (latest completed attempts)
  const recentActivity = completedAttempts.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Title className="text-2xl md:text-3xl">
          Performance & Analytics
        </Title>
        <Paragraph className="mt-1">
          Track your progress and identify areas for improvement
        </Paragraph>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">
                  {completedAttempts.length > 0 ? `${overallScore}%` : '--'}
                </Subtitle>
                <Small className="text-xs">Overall Score</Small>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                {monthChange >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-secondary" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">
                  {monthChange !== 0 ? `${monthChange > 0 ? '+' : ''}${monthChange}%` : '--'}
                </Subtitle>
                <Small className="text-xs">This Month</Small>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">{weekTotalHours}h</Subtitle>
                <Small className="text-xs">This Week</Small>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">{completedAttempts.length}</Subtitle>
                <Small className="text-xs">Tests Taken</Small>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Exam Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Exam Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performanceData.length > 0 ? (
              <div className="space-y-4">
                {performanceData.map((exam) => (
                  <div key={exam.title} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground text-sm truncate mr-2">{exam.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-sm">{exam.avgScore}%</span>
                        {exam.attempts >= 2 && (
                          <span
                            className={`flex items-center text-xs ${
                              exam.trend === 'up' ? 'text-secondary' : 'text-destructive'
                            }`}
                          >
                            {exam.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          exam.avgScore >= 80
                            ? 'bg-secondary'
                            : exam.avgScore >= 60
                            ? 'bg-primary'
                            : 'bg-gold'
                        }`}
                        style={{ width: `${exam.avgScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Complete tests to see your performance
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Study Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className={`w-full max-w-8 rounded-t-md transition-all ${
                        day.hours > 0 ? 'bg-primary/80 hover:bg-primary' : 'bg-muted'
                      }`}
                      style={{ height: day.hours > 0 ? `${(day.hours / maxHours) * 100}%` : '4px' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Small className="text-sm">
                Total: <span className="font-semibold text-foreground">{weekTotalHours} hours</span> this week
              </Small>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      {enrolledCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enrolledCourses.map((enrollment: any) => (
                <div key={enrollment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm truncate mr-2">
                      {enrollment.course.title}
                    </span>
                    <span className="font-bold text-sm shrink-0">{enrollment.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((attempt) => {
                const pct = attempt.exam.totalMarks > 0
                  ? Math.round(((attempt.score || 0) / attempt.exam.totalMarks) * 100)
                  : 0;
                const passed = (attempt.score || 0) >= attempt.exam.passingMarks;

                return (
                  <div
                    key={attempt.id}
                    className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        passed ? 'bg-secondary/10' : 'bg-destructive/10'
                      }`}
                    >
                      {passed ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Paragraph className="font-medium text-foreground truncate">
                        {attempt.exam.title}
                      </Paragraph>
                      <Small className="text-sm">
                        {attempt.completedAt ? getRelativeTime(attempt.completedAt) : 'In progress'}
                      </Small>
                    </div>
                    <div className="text-right shrink-0">
                      <Paragraph className={`font-bold ${passed ? 'text-secondary' : 'text-destructive'}`}>
                        {pct}%
                      </Paragraph>
                      <Small className="text-xs">
                        {attempt.score || 0}/{attempt.exam.totalMarks}
                      </Small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Start taking tests to see your progress!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
