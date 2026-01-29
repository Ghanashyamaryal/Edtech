"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
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
import { ClipboardList, ArrowLeft, Loader2 } from "lucide-react";
import { CREATE_EXAM } from "@/graphql/mutations/admin";
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

export default function NewExamPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
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

  const [createExam, { loading }] = useMutation(CREATE_EXAM, {
    onCompleted: (data) => {
      toast({
        title: "Exam created",
        description: "Now add questions to your exam.",
      });
      router.push(`/admin/exams/${data.createExam.id}/questions`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExamFormData) => {
    if (data.passingMarks > data.totalMarks) {
      toast({
        title: "Error",
        description: "Passing marks cannot be greater than total marks",
        variant: "destructive",
      });
      return;
    }

    createExam({
      variables: {
        input: {
          title: data.title,
          description: data.description || null,
          durationMinutes: data.durationMinutes,
          totalMarks: data.totalMarks,
          passingMarks: data.passingMarks,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/exams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <Title className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Create New Exam
          </Title>
          <Paragraph className="text-muted-foreground">
            Set up a new exam with questions
          </Paragraph>
        </div>
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
                {errors.durationMinutes && (
                  <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  min="1"
                  {...register("totalMarks")}
                />
                {errors.totalMarks && (
                  <p className="text-sm text-destructive">{errors.totalMarks.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks *</Label>
                <Input
                  id="passingMarks"
                  type="number"
                  min="0"
                  {...register("passingMarks")}
                />
                {errors.passingMarks && (
                  <p className="text-sm text-destructive">{errors.passingMarks.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading || isSubmitting}>
                {(loading || isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create Exam
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
