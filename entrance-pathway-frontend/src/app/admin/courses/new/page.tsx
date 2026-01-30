"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useForm, useFieldArray } from "react-hook-form";
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
import { BookOpen, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { CREATE_COURSE } from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  fullName: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be 0 or higher"),
  discountedPrice: z.coerce.number().min(0, "Discounted price must be 0 or higher").optional().or(z.literal("")),
  durationHours: z.coerce.number().min(0, "Duration must be 0 or higher").optional().or(z.literal("")),
  features: z.array(z.object({ value: z.string() })).optional(),
  isBestseller: z.boolean().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      fullName: "",
      description: "",
      thumbnailUrl: "",
      price: 0,
      discountedPrice: "",
      durationHours: "",
      features: [{ value: "" }],
      isBestseller: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const isBestseller = watch("isBestseller");

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
    // Filter out empty features
    const features = data.features
      ?.map((f) => f.value.trim())
      .filter((f) => f.length > 0) || [];

    createCourse({
      variables: {
        input: {
          title: data.title,
          fullName: data.fullName || null,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl || null,
          price: data.price,
          discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : null,
          durationHours: data.durationHours ? Number(data.durationHours) : null,
          features: features.length > 0 ? features : null,
          isBestseller: data.isBestseller || false,
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., BSc CSIT"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="e.g., Bachelor in Computer Science & Information Technology"
                  {...register("fullName")}
                />
                <p className="text-xs text-muted-foreground">
                  Expanded name shown on course detail page
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                rows={4}
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
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Original Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="15000"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price (Rs.)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="9999"
                  {...register("discountedPrice")}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if no discount
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationHours">Duration (Hours)</Label>
                <Input
                  id="durationHours"
                  type="number"
                  min="0"
                  placeholder="180"
                  {...register("durationHours")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="isBestseller">Bestseller Badge</Label>
                <p className="text-sm text-muted-foreground">
                  Show a &quot;Bestseller&quot; badge on this course
                </p>
              </div>
              <Switch
                id="isBestseller"
                checked={isBestseller}
                onCheckedChange={(checked) => setValue("isBestseller", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Course Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add key features or topics covered in this course
            </p>

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Feature ${index + 1}, e.g., "Mathematics (Calculus, Algebra)"`}
                  {...register(`features.${index}.value`)}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: "" })}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
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
    </div>
  );
}
