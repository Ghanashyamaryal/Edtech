"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ClipboardList, ArrowLeft, Loader2 } from "lucide-react";
import { CREATE_EXAM, LINK_EXAM_TO_COURSE } from "@/graphql/mutations/admin";
import { GET_COURSES_FOR_SELECT } from "@/graphql/queries/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const EXAM_TYPES = [
  { value: "full_model", label: "Full Model Test" },
  { value: "subject", label: "Subject Test" },
  { value: "chapter", label: "Chapter Test" },
  { value: "practice", label: "Practice Quiz" },
  { value: "previous_year", label: "Previous Year Questions" },
];

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  totalMarks: z.coerce.number().min(1, "Total marks must be at least 1"),
  passingMarks: z.coerce.number().min(0, "Passing marks cannot be negative"),
  examType: z.string().optional(),
  setNumber: z.coerce.number().min(1).optional(),
  courseId: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;

export default function NewExamPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: coursesData, loading: loadingCourses } = useQuery(GET_COURSES_FOR_SELECT);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 60,
      totalMarks: 100,
      passingMarks: 40,
      examType: "full_model",
      setNumber: 1,
      courseId: "",
    },
  });

  const examType = watch("examType");
  const courseId = watch("courseId");

  const [linkExamToCourse] = useMutation(LINK_EXAM_TO_COURSE, {
    onError: (error) => {
      console.error("Failed to link exam to course:", error);
    },
  });

  const [createExam, { loading }] = useMutation(CREATE_EXAM, {
    onCompleted: async (data) => {
      // If a course was selected, link the exam to it
      if (courseId && courseId !== "") {
        await linkExamToCourse({
          variables: {
            examId: data.createExam.id,
            courseId: courseId,
            isRequired: false,
          },
        });
      }

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
          examType: data.examType || null,
          setNumber: data.setNumber || null,
          courseId: data.courseId || null,
        },
      },
    });
  };

  const courses = coursesData?.courses || [];

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                placeholder="e.g., BSc CSIT Full Model Test - Set 1"
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
          </CardContent>
        </Card>

        {/* Exam Type & Course Linking */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Type & Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select
                  value={examType}
                  onValueChange={(value) => setValue("examType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Categorize this exam by type
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="setNumber">Set Number</Label>
                <Input
                  id="setNumber"
                  type="number"
                  min="1"
                  placeholder="1"
                  {...register("setNumber")}
                />
                <p className="text-xs text-muted-foreground">
                  For multiple sets (Set 1, Set 2, etc.)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Link to Course</Label>
                <Select
                  value={courseId || "none"}
                  onValueChange={(value) => setValue("courseId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No course</SelectItem>
                    {courses.map((course: { id: string; title: string }) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Link this exam to a course
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting || loadingCourses}>
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
    </div>
  );
}
