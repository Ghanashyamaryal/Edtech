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
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { CREATE_COURSE } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or higher"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailUrl: "",
      price: 0,
    },
  });

  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    onCompleted: (data) => {
      toast({
        title: "Course created",
        description: "Your course has been created. Now add chapters and lessons.",
      });
      router.push(`/admin/courses/${data.createCourse.id}/chapters`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormData) => {
    createCourse({
      variables: {
        input: {
          title: data.title,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl || null,
          price: data.price,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <Title className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Create New Course
          </Title>
          <Paragraph className="text-muted-foreground">
            Add a new course to your platform
          </Paragraph>
        </div>
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
              <p className="text-sm text-muted-foreground">
                Set to 0 for a free course
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading || isSubmitting}>
                {(loading || isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create Course
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
