'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, Button } from '@/components/ui';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Zap,
} from 'lucide-react';
import { GET_LANDING_EXAMS, GET_USER_EXAM_ATTEMPTS } from '@/graphql/queries/exams';
import { useAuth } from '@/context/auth-context';

// Exam type from API
interface Exam {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  examType: string | null;
  setNumber: number | null;
  questionsCount: number;
  courses: { id: string; title: string; slug: string }[];
}

// Exam attempt type
interface ExamAttempt {
  id: string;
  exam: {
    id: string;
    title: string;
    description: string | null;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    examType: string | null;
    questionsCount: number;
  };
  startedAt: string;
  completedAt: string | null;
  score: number | null;
}

// Exam type config
const examTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
  full_model: { label: 'Full Model Test', icon: FileText, color: 'primary' },
  subject: { label: 'Subject Test', icon: BookOpen, color: 'secondary' },
  chapter: { label: 'Chapter Test', icon: Target, color: 'gold' },
  practice: { label: 'Practice Quiz', icon: Zap, color: 'primary' },
  previous_year: { label: 'Previous Year', icon: Clock, color: 'secondary' },
};

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

function getExamTypeLabel(examType: string | null): string {
  if (!examType) return 'Practice';
  return examTypeConfig[examType]?.label || 'Practice';
}

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

export default function MockTestsPage() {
  const { user } = useAuth();

  // Fetch available exams
  const { data: examsData, loading: loadingExams } = useQuery(GET_LANDING_EXAMS);
  const availableExams: Exam[] = examsData?.exams || [];

  // Fetch user's exam attempts
  const { data: attemptsData, loading: loadingAttempts } = useQuery(GET_USER_EXAM_ATTEMPTS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });
  const examAttempts: ExamAttempt[] = attemptsData?.userExamAttempts || [];

  // Filter completed attempts
  const completedAttempts = examAttempts.filter(a => a.completedAt !== null);

  // Calculate stats
  const totalTestsTaken = completedAttempts.length;
  const avgScore = completedAttempts.length > 0
    ? Math.round(
        completedAttempts.reduce((sum, a) => {
          const percentage = a.exam.totalMarks > 0 ? ((a.score || 0) / a.exam.totalMarks) * 100 : 0;
          return sum + percentage;
        }, 0) / completedAttempts.length
      )
    : 0;
  const bestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map(a =>
        a.exam.totalMarks > 0 ? Math.round(((a.score || 0) / a.exam.totalMarks) * 100) : 0
      ))
    : 0;
  const totalTimeSpent = completedAttempts.reduce((sum, a) => sum + (a.exam.durationMinutes || 0), 0);

  // Get exams user hasn't attempted yet (or can retake)
  const attemptedExamIds = new Set(examAttempts.map(a => a.exam.id));
  const testsToTake = availableExams.filter(e => !attemptedExamIds.has(e.id));

  const isLoading = loadingExams || loadingAttempts;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mock Tests</h1>
        <p className="text-muted-foreground mt-1">
          Practice with exam-style questions and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTestsTaken}</p>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Trophy className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bestScore}%</p>
                <p className="text-xs text-muted-foreground">Best Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(totalTimeSpent / 60)}h</p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tests */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Tests</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : testsToTake.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {testsToTake.slice(0, 6).map((exam) => (
              <Card key={exam.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
                          {getExamTypeLabel(exam.examType)}
                        </span>
                        {exam.setNumber && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-secondary/10 text-secondary">
                            Set {exam.setNumber}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">{exam.title}</h3>
                      {exam.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {exam.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {exam.questionsCount} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(exam.durationMinutes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {exam.totalMarks} marks
                    </span>
                  </div>

                  {exam.courses.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {exam.courses.slice(0, 2).map((course) => (
                        <span
                          key={course.id}
                          className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs"
                        >
                          {course.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/dashboard/mock-tests/${exam.id}`}>
                    <Button className="w-full gap-2">
                      Start Test
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : availableExams.length > 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-3" />
              <p className="text-muted-foreground">
                You&apos;ve attempted all available tests! Check your results below.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No tests available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}

        {testsToTake.length > 6 && (
          <div className="text-center mt-4">
            <Link href="/dashboard/mock-tests/all">
              <Button variant="outline" className="gap-2">
                View All Tests ({testsToTake.length})
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Results</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : completedAttempts.length > 0 ? (
          <div className="space-y-3">
            {completedAttempts.slice(0, 5).map((attempt) => {
              const percentage = attempt.exam.totalMarks > 0
                ? Math.round(((attempt.score || 0) / attempt.exam.totalMarks) * 100)
                : 0;
              const passed = (attempt.score || 0) >= attempt.exam.passingMarks;

              return (
                <Card key={attempt.id}>
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            passed ? 'bg-secondary/10' : 'bg-destructive/10'
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{attempt.exam.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Completed {getRelativeTime(attempt.completedAt!)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">
                            {attempt.score || 0}/{attempt.exam.totalMarks}
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                        <div className="text-center">
                          <p
                            className={`text-lg font-bold ${
                              passed ? 'text-secondary' : 'text-destructive'
                            }`}
                          >
                            {percentage}%
                          </p>
                          <p className="text-xs text-muted-foreground">Percentage</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-lg font-bold ${passed ? 'text-secondary' : 'text-destructive'}`}>
                            {passed ? 'Passed' : 'Failed'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pass: {attempt.exam.passingMarks}
                          </p>
                        </div>
                        <Link href={`/dashboard/mock-tests/${attempt.exam.id}/review/${attempt.id}`}>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No completed tests yet. Take your first test above!
              </p>
            </CardContent>
          </Card>
        )}

        {completedAttempts.length > 5 && (
          <div className="text-center mt-4">
            <Link href="/dashboard/mock-tests/history">
              <Button variant="outline" className="gap-2">
                View All Results ({completedAttempts.length})
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
