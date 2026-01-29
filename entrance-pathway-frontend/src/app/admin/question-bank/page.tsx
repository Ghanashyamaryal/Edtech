"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, ConfirmDialog } from "@/components/molecules/admin";
import { HelpCircle, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { GET_ADMIN_QUESTIONS, GET_SUBJECTS } from "@/graphql/queries/admin";
import { DELETE_QUESTION } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  difficulty: string;
  subject: { id: string; name: string } | null;
  topic: { id: string; name: string } | null;
  createdAt: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function QuestionBankPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const { data: subjectsData } = useQuery(GET_SUBJECTS);

  const { data, loading, refetch } = useQuery(GET_ADMIN_QUESTIONS, {
    variables: {
      subjectId: subjectFilter === "all" ? undefined : subjectFilter,
      difficulty: difficultyFilter === "all" ? undefined : difficultyFilter,
      limit: 100,
    },
  });

  const [deleteQuestion, { loading: deleting }] = useMutation(DELETE_QUESTION, {
    onCompleted: () => {
      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted.",
      });
      setShowDeleteDialog(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedQuestion) {
      deleteQuestion({ variables: { id: selectedQuestion.id } });
    }
  };

  const questions: Question[] = data?.questions || [];
  const subjects: Subject[] = subjectsData?.subjects || [];

  const filteredQuestions = questions.filter((question) =>
    question.questionText?.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  const columns: Column<Question>[] = [
    {
      key: "question",
      header: "Question",
      cell: (question) => (
        <div className="max-w-md">
          <p className="line-clamp-2">{question.questionText}</p>
          <div className="flex gap-2 mt-1">
            {question.subject && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {question.subject.name}
              </span>
            )}
            {question.topic && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                {question.topic.name}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (question) => (
        <span className="capitalize text-sm">
          {question.questionType.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      cell: (question) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(
            question.difficulty
          )}`}
        >
          {question.difficulty}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (question) => new Date(question.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (question) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/question-bank/${question.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(question)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            Question Bank
          </Title>
          <Paragraph className="text-muted-foreground">
            Manage questions for mock tests and exams
          </Paragraph>
        </div>
        <Link href="/admin/question-bank/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredQuestions}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search questions..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No questions found. Add your first question!"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
