'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';
import {
  Clock,
  FileText,
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Play,
} from 'lucide-react';
import { getExamWithQuestions, startExamAttempt, submitExamAnswer, completeExamAttempt } from '@/actions';
import { useAuth } from '@/context/auth-context';

interface ExamQuestion {
  id: string;
  questionId: string;
  marks: number;
  position: number;
  question: {
    id: string;
    questionText: string;
    questionType: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    correctAnswer: string;
    explanation?: string;
    difficulty: string;
  };
}

interface ExamData {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  examType?: string;
  questionsCount: number;
  questions: ExamQuestion[];
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ExamTakingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const examId = params.id as string;

  // Data state
  const [exam, setExam] = React.useState<ExamData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Exam state
  const [examStarted, setExamStarted] = React.useState(false);
  const [attemptId, setAttemptId] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false);
  const [showNavGrid, setShowNavGrid] = React.useState(false);

  // Load exam data
  React.useEffect(() => {
    async function loadExam() {
      setLoading(true);
      const result = await getExamWithQuestions(examId);
      if (result.success) {
        setExam(result.data);
        setTimeLeft(result.data.durationMinutes * 60);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadExam();
  }, [examId]);

  // Timer
  React.useEffect(() => {
    if (!examStarted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted]);

  // Auto-submit when timer reaches 0
  React.useEffect(() => {
    if (examStarted && timeLeft === 0 && attemptId) {
      handleSubmitExam();
    }
  }, [timeLeft, examStarted, attemptId]);

  const handleStartExam = async () => {
    setStarting(true);
    const result = await startExamAttempt(examId);
    if (result.success) {
      setAttemptId(result.data.id);
      setExamStarted(true);
      setCurrentIndex(0);
    } else {
      setError(result.error);
    }
    setStarting(false);
  };

  const handleSelectAnswer = async (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (attemptId) {
      // Submit in background - don't await
      submitExamAnswer(attemptId, questionId, answer);
    }
  };

  const handleSubmitExam = async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    setShowSubmitDialog(false);

    const result = await completeExamAttempt(attemptId);
    if (result.success) {
      router.push(`/dashboard/mock-tests/${examId}/review/${attemptId}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error || 'Exam not found'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/mock-tests')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mock Tests
        </Button>
      </div>
    );
  }

  const questions = exam.questions || [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;
  const timerWarning = timeLeft < 300; // less than 5 minutes

  // Pre-exam info screen
  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => router.push('/dashboard/mock-tests')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mock Tests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">{exam.title}</CardTitle>
            {exam.description && (
              <p className="text-muted-foreground mt-2">{exam.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <FileText className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-xl font-bold">{totalQuestions}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="w-6 h-6 mx-auto text-gold mb-2" />
                <p className="text-xl font-bold">{exam.durationMinutes}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Target className="w-6 h-6 mx-auto text-secondary mb-2" />
                <p className="text-xl font-bold">{exam.totalMarks}</p>
                <p className="text-xs text-muted-foreground">Total Marks</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="w-6 h-6 mx-auto text-success mb-2" />
                <p className="text-xl font-bold">{exam.passingMarks}</p>
                <p className="text-xs text-muted-foreground">Pass Marks</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gold" />
                Instructions
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>The exam will auto-submit when the timer runs out.</li>
                <li>You can navigate between questions freely.</li>
                <li>Your answers are saved automatically as you select them.</li>
                <li>You can review and change answers before submitting.</li>
              </ul>
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleStartExam}
              disabled={starting || totalQuestions === 0}
            >
              {starting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {starting ? 'Starting...' : totalQuestions === 0 ? 'No questions available' : 'Start Exam'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam in progress
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top bar: Timer + Progress + Submit */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-3 pt-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                timerWarning
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-muted text-foreground'
              }`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
            {/* Progress */}
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNavGrid(!showNavGrid)}
              className="sm:hidden"
            >
              {currentIndex + 1}/{totalQuestions}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Submit Exam
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Question Navigation Grid - sidebar on desktop */}
        <div className={`${showNavGrid ? 'block' : 'hidden'} sm:block shrink-0`}>
          <Card className="sticky top-28">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Questions</p>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.question.id];
                  const isCurrent = i === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(i);
                        setShowNavGrid(false);
                      }}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : isAnswered
                          ? 'bg-secondary/20 text-secondary border border-secondary/30'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-secondary/20 border border-secondary/30" />
                  Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-muted" />
                  Unanswered
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Area */}
        <div className="flex-1 min-w-0">
          {currentQuestion && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                {/* Question header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Question text */}
                <h2 className="text-base sm:text-lg font-medium text-foreground mb-6 leading-relaxed">
                  {currentQuestion.question.questionText}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.question.options.map((option, optionIndex) => {
                    const isSelected = answers[currentQuestion.question.id] === option.id;
                    const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(currentQuestion.question.id, option.id)}
                        className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className="text-sm sm:text-base">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    disabled={isFirstQuestion}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {isLastQuestion ? (
                    <Button
                      onClick={() => setShowSubmitDialog(true)}
                      className="gap-2"
                    >
                      Review & Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              You have answered <span className="font-semibold text-foreground">{answeredCount}</span> out of{' '}
              <span className="font-semibold text-foreground">{totalQuestions}</span> questions.
            </p>
            {answeredCount < totalQuestions && (
              <p className="text-sm text-gold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {totalQuestions - answeredCount} question{totalQuestions - answeredCount > 1 ? 's are' : ' is'} unanswered.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Time remaining: <span className="font-mono font-semibold text-foreground">{formatTime(timeLeft)}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Continue Exam
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmitExam}
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
