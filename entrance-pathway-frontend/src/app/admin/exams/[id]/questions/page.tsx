"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules/admin";
import {
  ListChecks,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Search,
  HelpCircle,
} from "lucide-react";
import { GET_ADMIN_EXAM, GET_ADMIN_QUESTIONS, GET_SUBJECTS } from "@/graphql/queries/admin";
import { ADD_QUESTION_TO_EXAM, REMOVE_QUESTION_FROM_EXAM } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface ExamQuestion {
  id: string;
  questionId: string;
  marks: number;
  position: number;
  question: {
    id: string;
    questionText: string;
    questionType: string;
    difficulty: string;
  };
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  subject: { id: string; name: string } | null;
}

export default function ExamQuestionsPage() {
  const params = useParams();
  const { toast } = useToast();
  const examId = params.id as string;

  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null);
  const [marks, setMarks] = React.useState("1");
  const [removeTarget, setRemoveTarget] = React.useState<ExamQuestion | null>(null);

  const { data: examData, loading: loadingExam, refetch } = useQuery(GET_ADMIN_EXAM, {
    variables: { id: examId },
    skip: !examId,
  });

  const { data: questionsData, loading: loadingQuestions } = useQuery(GET_ADMIN_QUESTIONS, {
    variables: {
      subjectId: subjectFilter === "all" ? undefined : subjectFilter,
      limit: 100,
    },
  });

  const { data: subjectsData } = useQuery(GET_SUBJECTS);

  const [addQuestion, { loading: adding }] = useMutation(ADD_QUESTION_TO_EXAM, {
    onCompleted: () => {
      toast({ title: "Question added to exam" });
      setShowAddDialog(false);
      setSelectedQuestion(null);
      setMarks("1");
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [removeQuestion, { loading: removing }] = useMutation(REMOVE_QUESTION_FROM_EXAM, {
    onCompleted: () => {
      toast({ title: "Question removed from exam" });
      setRemoveTarget(null);
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const handleAddQuestion = () => {
    if (!selectedQuestion) return;
    addQuestion({
      variables: {
        examId,
        questionId: selectedQuestion.id,
        marks: parseInt(marks) || 1,
      },
    });
  };

  const handleRemoveQuestion = () => {
    if (!removeTarget) return;
    removeQuestion({
      variables: {
        examId,
        questionId: removeTarget.questionId,
      },
    });
  };

  const exam = examData?.exam;
  const examQuestions: ExamQuestion[] = exam?.questions || [];
  const allQuestions: Question[] = questionsData?.questions || [];
  const subjects = subjectsData?.subjects || [];

  // Filter out questions already in the exam
  const examQuestionIds = new Set(examQuestions.map((eq) => eq.questionId));
  const availableQuestions = allQuestions
    .filter((q) => !examQuestionIds.has(q.id))
    .filter((q) => q.questionText.toLowerCase().includes(searchValue.toLowerCase()));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loadingExam) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
        <Link href="/admin/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    );
  }

  const totalMarksAssigned = examQuestions.reduce((sum, eq) => sum + eq.marks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/exams/${examId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <Title className="flex items-center gap-2">
              <ListChecks className="w-6 h-6" />
              Exam Questions
            </Title>
            <Paragraph className="text-muted-foreground">{exam.title}</Paragraph>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{examQuestions.length}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalMarksAssigned}</p>
            <p className="text-sm text-muted-foreground">Marks Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{exam.totalMarks}</p>
            <p className="text-sm text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{exam.durationMinutes}</p>
            <p className="text-sm text-muted-foreground">Duration (min)</p>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({examQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {examQuestions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Button onClick={() => setShowAddDialog(true)}>Add First Question</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {examQuestions
                .sort((a, b) => a.position - b.position)
                .map((eq, index) => (
                  <div
                    key={eq.id}
                    className="flex items-start justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Q{index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
                            eq.question.difficulty
                          )}`}
                        >
                          {eq.question.difficulty}
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {eq.marks} {eq.marks === 1 ? "mark" : "marks"}
                        </span>
                      </div>
                      <p className="line-clamp-2">{eq.question.questionText}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRemoveTarget(eq)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Question Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Question to Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px]">
              {loadingQuestions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : availableQuestions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No available questions found
                </p>
              ) : (
                availableQuestions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => setSelectedQuestion(question)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                      {question.subject && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {question.subject.name}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm">{question.questionText}</p>
                  </div>
                ))
              )}
            </div>

            {/* Marks Input */}
            {selectedQuestion && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Marks for this question</Label>
                <Input
                  type="number"
                  min="1"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-24"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddQuestion} disabled={!selectedQuestion || adding}>
              {adding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
        title="Remove Question"
        description="Are you sure you want to remove this question from the exam?"
        confirmLabel="Remove"
        onConfirm={handleRemoveQuestion}
        loading={removing}
        variant="destructive"
      />
    </div>
  );
}
