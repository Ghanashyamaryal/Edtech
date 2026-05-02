'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Trophy,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import { getExamAttemptWithAnswers, type ExamAttemptWithAnswers } from '@/actions';

export default function ExamReviewPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const examId = params.id as string;

  const [data, setData] = React.useState<ExamAttemptWithAnswers | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadReview() {
      setLoading(true);
      const result = await getExamAttemptWithAnswers(attemptId);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadReview();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error || 'Review data not found'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/mock-tests')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mock Tests
        </Button>
      </div>
    );
  }

  const { exam, questions, answers } = data;
  const score = data.score || 0;
  const totalMarks = exam.totalMarks;
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const passed = score >= exam.passingMarks;

  // Build answer map: questionId -> user answer
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const incorrectCount = answers.filter((a) => !a.isCorrect).length;
  const unansweredCount = questions.length - answers.length;

  // Calculate time taken
  let timeTaken = '';
  if (data.startedAt && data.completedAt) {
    const diffMs = new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins >= 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      timeTaken = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      timeTaken = `${diffMins} min`;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => router.push('/dashboard/mock-tests')}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mock Tests
      </Button>

      {/* Score Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score circle */}
            <div className="relative">
              <div
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${
                  passed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'
                }`}
              >
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className={`text-xs font-medium ${passed ? 'text-success' : 'text-destructive'}`}>
                  {passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-bold text-foreground mb-1">{exam.title}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Score: {score}/{totalMarks} (Pass mark: {exam.passingMarks})
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>{correctCount} correct</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  <span>{incorrectCount} incorrect</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{unansweredCount} skipped</span>
                </div>
                {timeTaken && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span>{timeTaken}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-by-question review */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Detailed Review</h2>
        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = answerMap.get(q.question.id);
            const wasAnswered = !!userAnswer;
            const wasCorrect = userAnswer?.isCorrect || false;

            return (
              <Card
                key={q.id}
                className={`border-l-4 ${
                  !wasAnswered
                    ? 'border-l-muted-foreground/30'
                    : wasCorrect
                    ? 'border-l-success'
                    : 'border-l-destructive'
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Question header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Q{index + 1}
                      </span>
                      {wasAnswered ? (
                        wasCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            <XCircle className="w-3 h-3" />
                            Incorrect
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Skipped
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {q.marks} mark{q.marks !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Question text */}
                  <p className="text-foreground mb-4 leading-relaxed">
                    {q.question.questionText}
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.question.options.map((option, optionIndex) => {
                      const optionLabel = String.fromCharCode(65 + optionIndex);
                      const isCorrectOption = option.isCorrect;
                      const isUserSelection = userAnswer?.selectedAnswer === option.id;

                      let bgClass = 'bg-card border-border';
                      if (isCorrectOption) {
                        bgClass = 'bg-success/5 border-success/30';
                      } else if (isUserSelection && !isCorrectOption) {
                        bgClass = 'bg-destructive/5 border-destructive/30';
                      }

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${bgClass}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                              isCorrectOption
                                ? 'bg-success text-success-foreground'
                                : isUserSelection
                                ? 'bg-destructive text-destructive-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {isCorrectOption ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : isUserSelection ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              optionLabel
                            )}
                          </span>
                          <span className="text-sm flex-1">{option.text}</span>
                          {isUserSelection && (
                            <span className="text-xs text-muted-foreground shrink-0">Your answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.question.explanation && (
                    <div className="mt-4 p-3 rounded-lg bg-accent border border-primary/10">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Explanation: </span>
                        {q.question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/mock-tests')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mock Tests
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/mock-tests/${examId}`)}
          className="gap-2"
        >
          Retake This Test
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
