"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { Video, ArrowLeft, Loader2 } from "lucide-react";
import { createLiveClass, getCourses, type Course } from "@/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const liveClassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Date & time is required"),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  meetingUrl: z.string().optional(),
  courseId: z.string().optional(),
  maxStudents: z.coerce.number().min(0).optional(),
});

type LiveClassFormData = z.infer<typeof liveClassSchema>;

export default function NewLiveClassPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LiveClassFormData>({
    resolver: zodResolver(liveClassSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledAt: "",
      durationMinutes: 60,
      meetingUrl: "",
      courseId: "",
      maxStudents: undefined,
    },
  });

  const courseId = watch("courseId");

  React.useEffect(() => {
    async function loadCourses() {
      const result = await getCourses({ limit: 100 });
      if (result.success) setCourses(result.data);
    }
    loadCourses();
  }, []);

  const onSubmit = async (data: LiveClassFormData) => {
    setLoading(true);

    const result = await createLiveClass({
      title: data.title,
      description: data.description || undefined,
      scheduledAt: new Date(data.scheduledAt).toISOString(),
      durationMinutes: data.durationMinutes,
      meetingUrl: data.meetingUrl || undefined,
      courseId: data.courseId && data.courseId !== "" ? data.courseId : undefined,
      maxStudents: data.maxStudents || undefined,
    });

    if (result.success) {
      toast({ title: "Class scheduled", description: "Live class has been created." });
      router.push("/admin/live-classes");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/live-classes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <Title className="flex items-center gap-2">
            <Video className="w-6 h-6" />
            Schedule Live Class
          </Title>
          <Paragraph className="text-muted-foreground">
            Create a new live class session
          </Paragraph>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Physics: Electromagnetic Waves"
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
                placeholder="Brief description of the class"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date & Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  {...register("scheduledAt")}
                />
                {errors.scheduledAt && (
                  <p className="text-sm text-destructive">{errors.scheduledAt.message}</p>
                )}
              </div>
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting & Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meetingUrl">Meeting URL</Label>
              <Input
                id="meetingUrl"
                placeholder="Paste Google Meet or Zoom link"
                {...register("meetingUrl")}
              />
              <p className="text-xs text-muted-foreground">
                Create a meeting on Google Meet → copy the link → paste here
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="0"
                  placeholder="No limit"
                  {...register("maxStudents")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting}>
            {(loading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Schedule Class
          </Button>
          <Link href="/admin/live-classes">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
