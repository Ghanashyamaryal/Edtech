"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ClipboardList, ArrowLeft, Loader2, ListChecks } from "lucide-react";
import { GET_ADMIN_EXAM } from "@/graphql/queries/admin";
import { UPDATE_EXAM } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  totalMarks: z.coerce.number().min(1, "Total marks must be at least 1"),
  passingMarks: z.coerce.number().min(0, "Passing marks cannot be negative"),
});

type ExamFormData = z.infer<typeof examSchema>;

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const examId = params.id as string;

  const { data, loading: loadingExam } = useQuery(GET_ADMIN_EXAM, {
    variables: { id: examId },
    skip: !examId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 60,
      totalMarks: 100,
      passingMarks: 40,
    },
  });

  React.useEffect(() => {
    if (data?.exam) {
      reset({
        title: data.exam.title,
        description: data.exam.description || "",
        durationMinutes: data.exam.durationMinutes,
        totalMarks: data.exam.totalMarks,
        passingMarks: data.exam.passingMarks,
      });
    }
  }, [data, reset]);

  const [updateExam, { loading }] = useMutation(UPDATE_EXAM, {
    onCompleted: () => {
      toast({
        title: "Exam updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: ExamFormData) => {
    if (formData.passingMarks > formData.totalMarks) {
      toast({
        title: "Error",
        description: "Passing marks cannot be greater than total marks",
        variant: "destructive",
      });
      return;
    }

    updateExam({
      variables: {
        id: examId,
        input: {
          title: formData.title,
          description: formData.description || null,
          durationMinutes: formData.durationMinutes,
          totalMarks: formData.totalMarks,
          passingMarks: formData.passingMarks,
        },
      },
    });
  };

  if (loadingExam) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
        <Link href="/admin/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/exams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <Title className="flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              Edit Exam
            </Title>
            <Paragraph className="text-muted-foreground">
              Update exam details
            </Paragraph>
          </div>
        </div>
        <Link href={`/admin/exams/${examId}/questions`}>
          <Button variant="outline" className="gap-2">
            <ListChecks className="w-4 h-4" />
            Manage Questions ({data.exam.questionsCount || 0})
          </Button>
        </Link>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Mathematics Mock Test 1"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter exam description"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min="1"
                  {...register("durationMinutes")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  min="1"
                  {...register("totalMarks")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks *</Label>
                <Input
                  id="passingMarks"
                  type="number"
                  min="0"
                  {...register("passingMarks")}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading || isSubmitting}>
                {(loading || isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
              <Link href="/admin/exams">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
