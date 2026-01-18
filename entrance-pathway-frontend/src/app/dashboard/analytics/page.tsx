'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  BookOpen,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

// Mock data - replace with real API data
const subjectPerformance = [
  { subject: 'Physics', score: 78, change: 5, trend: 'up' },
  { subject: 'Chemistry', score: 82, change: 3, trend: 'up' },
  { subject: 'Mathematics', score: 71, change: -2, trend: 'down' },
  { subject: 'Biology', score: 85, change: 8, trend: 'up' },
];

const weeklyStudyHours = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 2 },
  { day: 'Fri', hours: 6 },
  { day: 'Sat', hours: 7 },
  { day: 'Sun', hours: 4 },
];

const recentActivity = [
  { type: 'test', title: 'Completed Physics Mock Test', time: '2 hours ago', score: '82%' },
  { type: 'video', title: 'Watched Chemistry Lecture', time: '4 hours ago', duration: '45 min' },
  { type: 'study', title: 'Studied Biology Notes', time: 'Yesterday', duration: '2 hours' },
  { type: 'test', title: 'Completed Math Quiz', time: 'Yesterday', score: '76%' },
];

export default function AnalyticsPage() {
  const maxHours = Math.max(...weeklyStudyHours.map((d) => d.hours));
  const totalHours = weeklyStudyHours.reduce((sum, d) => sum + d.hours, 0);

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
                <Subtitle as="p" className="text-2xl">79%</Subtitle>
                <Small className="text-xs">Overall Score</Small>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <Subtitle as="p" className="text-2xl">+4%</Subtitle>
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
                <Subtitle as="p" className="text-2xl">{totalHours}h</Subtitle>
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
                <Subtitle as="p" className="text-2xl">156</Subtitle>
                <Small className="text-xs">Topics Covered</Small>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{subject.score}%</span>
                      <span
                        className={`flex items-center text-sm ${
                          subject.trend === 'up' ? 'text-secondary' : 'text-destructive'
                        }`}
                      >
                        {subject.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(subject.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        subject.score >= 80
                          ? 'bg-secondary'
                          : subject.score >= 60
                          ? 'bg-primary'
                          : 'bg-gold'
                      }`}
                      style={{ width: `${subject.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
              {weeklyStudyHours.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-32">
                    <div
                      className="w-full max-w-8 bg-primary/80 rounded-t-md transition-all hover:bg-primary"
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Small className="text-sm">
                Total: <span className="font-semibold text-foreground">{totalHours} hours</span> this week
              </Small>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === 'test'
                      ? 'bg-primary/10'
                      : activity.type === 'video'
                      ? 'bg-secondary/10'
                      : 'bg-gold/10'
                  }`}
                >
                  {activity.type === 'test' ? (
                    <Target className="w-5 h-5 text-primary" />
                  ) : activity.type === 'video' ? (
                    <BookOpen className="w-5 h-5 text-secondary" />
                  ) : (
                    <Clock className="w-5 h-5 text-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <Paragraph className="font-medium text-foreground">{activity.title}</Paragraph>
                  <Small className="text-sm">{activity.time}</Small>
                </div>
                <div className="text-right">
                  <Paragraph className="font-medium text-foreground">
                    {activity.score || activity.duration}
                  </Paragraph>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
