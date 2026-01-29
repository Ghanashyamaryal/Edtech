"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, StatusBadge, ConfirmDialog } from "@/components/molecules/admin";
import { ClipboardList, Plus, MoreHorizontal, Pencil, Trash2, ListChecks, Eye } from "lucide-react";
import { GET_ADMIN_EXAMS } from "@/graphql/queries/admin";
import { DELETE_EXAM } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";

interface Exam {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  isPublished: boolean;
  questionsCount: number;
  createdAt: string;
}

export default function AdminExamsPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedExam, setSelectedExam] = React.useState<Exam | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const { data, loading, refetch } = useQuery(GET_ADMIN_EXAMS, {
    variables: { limit: 50 },
  });

  const [deleteExam, { loading: deleting }] = useMutation(DELETE_EXAM, {
    onCompleted: () => {
      toast({
        title: "Exam deleted",
        description: "The exam has been successfully deleted.",
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

  const handleDelete = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedExam) {
      deleteExam({ variables: { id: selectedExam.id } });
    }
  };

  const exams: Exam[] = data?.exams || [];

  const filteredExams = exams.filter((exam) =>
    exam.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: Column<Exam>[] = [
    {
      key: "exam",
      header: "Exam",
      cell: (exam) => (
        <div>
          <p className="font-medium">{exam.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {exam.description || "No description"}
          </p>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (exam) => `${exam.durationMinutes} min`,
    },
    {
      key: "marks",
      header: "Marks",
      cell: (exam) => (
        <div className="text-sm">
          <span className="font-medium">{exam.totalMarks}</span>
          <span className="text-muted-foreground"> / Pass: {exam.passingMarks}</span>
        </div>
      ),
    },
    {
      key: "questions",
      header: "Questions",
      cell: (exam) => exam.questionsCount || 0,
    },
    {
      key: "status",
      header: "Status",
      cell: (exam) => <StatusBadge status={exam.isPublished} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (exam) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/exams/${exam.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Exam
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/exams/${exam.id}/questions`}>
                <ListChecks className="w-4 h-4 mr-2" />
                Manage Questions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(exam)}
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
            <ClipboardList className="w-6 h-6" />
            Exam Management
          </Title>
          <Paragraph className="text-muted-foreground">
            Create and manage exams with questions
          </Paragraph>
        </div>
        <Link href="/admin/exams/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        </Link>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredExams}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search exams..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No exams found. Create your first exam!"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Exam"
        description={`Are you sure you want to delete "${selectedExam?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
