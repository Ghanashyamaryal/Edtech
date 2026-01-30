"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
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
import { BookOpen, ArrowLeft, Loader2, Layers, Plus, X } from "lucide-react";
import { GET_ADMIN_COURSE } from "@/graphql/queries/admin";
import { UPDATE_COURSE } from "@/graphql/mutations/admin";
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
  isPublished: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function EditCoursePage() {
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
      isPublished: false,
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "features",
  });

  const isPublished = watch("isPublished");
  const isBestseller = watch("isBestseller");

  // Set form values when data is loaded
  React.useEffect(() => {
    if (data?.course) {
      const course = data.course;
      const featuresArray = course.features && course.features.length > 0
        ? course.features.map((f: string) => ({ value: f }))
        : [{ value: "" }];

      reset({
        title: course.title,
        fullName: course.fullName || "",
        description: course.description,
        thumbnailUrl: course.thumbnailUrl || "",
        price: course.price,
        discountedPrice: course.discountedPrice || "",
        durationHours: course.durationHours || "",
        features: featuresArray,
        isBestseller: course.isBestseller || false,
        isPublished: course.isPublished,
      });

      // Replace field array with loaded data
      replace(featuresArray);
    }
  }, [data, reset, replace]);

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
    // Filter out empty features
    const features = formData.features
      ?.map((f) => f.value.trim())
      .filter((f) => f.length > 0) || [];

    updateCourse({
      variables: {
        id: courseId,
        input: {
          title: formData.title,
          fullName: formData.fullName || null,
          description: formData.description,
          thumbnailUrl: formData.thumbnailUrl || null,
          price: formData.price,
          discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : null,
          durationHours: formData.durationHours ? Number(formData.durationHours) : null,
          features: features.length > 0 ? features : null,
          isBestseller: formData.isBestseller || false,
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isBestseller">Bestseller Badge</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a &quot;Bestseller&quot; badge
                  </p>
                </div>
                <Switch
                  id="isBestseller"
                  checked={isBestseller}
                  onCheckedChange={(checked) => setValue("isBestseller", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublished">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make visible to students
                  </p>
                </div>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={(checked) => setValue("isPublished", checked)}
                />
              </div>
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
    </div>
  );
}
