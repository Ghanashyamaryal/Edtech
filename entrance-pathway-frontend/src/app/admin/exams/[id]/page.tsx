"use client";

import * as React from "react";
import { useParams } from "next/navigation";
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
import {
  ClipboardList,
  ArrowLeft,
  Loader2,
  ListChecks,
  BookOpen,
  Plus,
  X,
} from "lucide-react";
import { GET_ADMIN_EXAM, GET_COURSES_FOR_SELECT } from "@/graphql/queries/admin";
import {
  UPDATE_EXAM,
  LINK_EXAM_TO_COURSE,
  UNLINK_EXAM_FROM_COURSE,
} from "@/graphql/mutations/admin";
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
});

type ExamFormData = z.infer<typeof examSchema>;

interface Course {
  id: string;
  title: string;
  slug?: string;
}

export default function EditExamPage() {
  const params = useParams();
  const { toast } = useToast();
  const examId = params.id as string;
  const [selectedCourseToAdd, setSelectedCourseToAdd] = React.useState("");

  const { data, loading: loadingExam, refetch } = useQuery(GET_ADMIN_EXAM, {
    variables: { id: examId },
    skip: !examId,
  });

  const { data: coursesData, loading: loadingCourses } = useQuery(GET_COURSES_FOR_SELECT);

  const {
    register,
    handleSubmit,
    reset,
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
    },
  });

  const examType = watch("examType");

  React.useEffect(() => {
    if (data?.exam) {
      reset({
        title: data.exam.title,
        description: data.exam.description || "",
        durationMinutes: data.exam.durationMinutes,
        totalMarks: data.exam.totalMarks,
        passingMarks: data.exam.passingMarks,
        examType: data.exam.examType || "full_model",
        setNumber: data.exam.setNumber || 1,
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

  const [linkExamToCourse, { loading: linking }] = useMutation(LINK_EXAM_TO_COURSE, {
    onCompleted: () => {
      toast({
        title: "Course linked",
        description: "Exam has been linked to the course.",
      });
      setSelectedCourseToAdd("");
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

  const [unlinkExamFromCourse, { loading: unlinking }] = useMutation(UNLINK_EXAM_FROM_COURSE, {
    onCompleted: () => {
      toast({
        title: "Course unlinked",
        description: "Exam has been removed from the course.",
      });
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
          examType: formData.examType || null,
          setNumber: formData.setNumber || null,
        },
      },
    });
  };

  const handleLinkCourse = () => {
    if (!selectedCourseToAdd) return;
    linkExamToCourse({
      variables: {
        examId,
        courseId: selectedCourseToAdd,
        isRequired: false,
      },
    });
  };

  const handleUnlinkCourse = (courseId: string) => {
    unlinkExamFromCourse({
      variables: {
        examId,
        courseId,
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

  const allCourses: Course[] = coursesData?.courses || [];
  const linkedCourses: Course[] = data.exam.courses || [];
  const linkedCourseIds = linkedCourses.map((c: Course) => c.id);
  const availableCourses = allCourses.filter((c) => !linkedCourseIds.includes(c.id));

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
            <Paragraph className="text-muted-foreground">Update exam details</Paragraph>
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
          </CardContent>
        </Card>

        {/* Exam Type & Set Number */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <p className="text-xs text-muted-foreground">Categorize this exam by type</p>
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
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
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

      {/* Linked Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Linked Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Course */}
          {availableCourses.length > 0 && (
            <div className="flex gap-2">
              <Select
                value={selectedCourseToAdd}
                onValueChange={setSelectedCourseToAdd}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a course to link" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleLinkCourse}
                disabled={!selectedCourseToAdd || linking}
                className="gap-2"
              >
                {linking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Link
              </Button>
            </div>
          )}

          {/* Linked Courses List */}
          {linkedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              This exam is not linked to any courses yet.
            </p>
          ) : (
            <div className="space-y-2">
              {linkedCourses.map((course: Course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{course.title}</p>
                      {course.slug && (
                        <p className="text-xs text-muted-foreground">/{course.slug}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlinkCourse(course.id)}
                    disabled={unlinking}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {availableCourses.length === 0 && linkedCourses.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              All available courses have been linked.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
