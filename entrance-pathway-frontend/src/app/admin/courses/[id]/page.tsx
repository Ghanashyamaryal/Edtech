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
  Switch,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { BookOpen, ArrowLeft, Loader2, Layers } from "lucide-react";
import { GET_ADMIN_COURSE } from "@/graphql/queries/admin";
import { UPDATE_COURSE } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or higher"),
  isPublished: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const courseId = params.id as string;

  const { data, loading: loadingCourse } = useQuery(GET_ADMIN_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      price: 0,
      isPublished: false,
    },
  });

  const isPublished = watch("isPublished");

  // Set form values when data is loaded
  React.useEffect(() => {
    if (data?.course) {
      reset({
        title: data.course.title,
        description: data.course.description,
        thumbnailUrl: data.course.thumbnailUrl || "",
        price: data.course.price,
        isPublished: data.course.isPublished,
      });
    }
  }, [data, reset]);

  const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE, {
    onCompleted: () => {
      toast({
        title: "Course updated",
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

  const onSubmit = (formData: CourseFormData) => {
    updateCourse({
      variables: {
        id: courseId,
        input: {
          title: formData.title,
          description: formData.description,
          thumbnailUrl: formData.thumbnailUrl || null,
          price: formData.price,
          isPublished: formData.isPublished,
        },
      },
    });
  };

  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Link href="/admin/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <Title className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Edit Course
            </Title>
            <Paragraph className="text-muted-foreground">
              Update course details
            </Paragraph>
          </div>
        </div>
        <Link href={`/admin/courses/${courseId}/chapters`}>
          <Button variant="outline" className="gap-2">
            <Layers className="w-4 h-4" />
            Manage Chapters
          </Button>
        </Link>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                rows={5}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://example.com/image.jpg"
                {...register("thumbnailUrl")}
              />
              {errors.thumbnailUrl && (
                <p className="text-sm text-destructive">{errors.thumbnailUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isPublished">Published</Label>
                <p className="text-sm text-muted-foreground">
                  Make this course visible to students
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) => setValue("isPublished", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={updating || isSubmitting}>
                {(updating || isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
              <Link href="/admin/courses">
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
