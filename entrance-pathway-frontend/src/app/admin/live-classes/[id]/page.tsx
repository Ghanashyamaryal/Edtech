"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  getLiveClass,
  updateLiveClass,
  getCourses,
  type Course,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Date & time is required"),
  durationMinutes: z.coerce.number().min(1),
  meetingUrl: z.string().optional(),
  courseId: z.string().optional(),
  maxStudents: z.coerce.number().min(0).optional(),
  status: z.string(),
  recordingUrl: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

function toLocalDatetime(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditLiveClassPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledAt: "",
      durationMinutes: 60,
      meetingUrl: "",
      courseId: "",
      maxStudents: undefined,
      status: "scheduled",
      recordingUrl: "",
    },
  });

  const courseId = watch("courseId");
  const status = watch("status");

  React.useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      const [classResult, coursesResult] = await Promise.all([
        getLiveClass(params.id as string),
        getCourses({ limit: 100 }),
      ]);

      if (coursesResult.success) setCourses(coursesResult.data);

      if (classResult.success) {
        const c = classResult.data;
        reset({
          title: c.title,
          description: c.description || "",
          scheduledAt: toLocalDatetime(c.scheduledAt),
          durationMinutes: c.durationMinutes,
          meetingUrl: c.meetingUrl || "",
          courseId: c.courseId || "",
          maxStudents: c.maxStudents || undefined,
          status: c.status,
          recordingUrl: c.recordingUrl || "",
        });
      } else {
        toast({ title: "Error", description: classResult.error, variant: "destructive" });
      }
      setLoadingData(false);
    }
    loadData();
  }, [params.id, reset, toast]);

  const onSubmit = async (data: EditFormData) => {
    setLoading(true);

    const result = await updateLiveClass(params.id as string, {
      title: data.title,
      description: data.description || undefined,
      scheduledAt: new Date(data.scheduledAt).toISOString(),
      durationMinutes: data.durationMinutes,
      meetingUrl: data.meetingUrl || undefined,
      courseId: data.courseId && data.courseId !== "" ? data.courseId : undefined,
      maxStudents: data.maxStudents || undefined,
      status: data.status as "scheduled" | "live" | "completed" | "cancelled",
      recordingUrl: data.recordingUrl || undefined,
    });

    if (result.success) {
      toast({ title: "Updated", description: "Live class has been updated." });
      router.push("/admin/live-classes");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }

    setLoading(false);
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
            Edit Live Class
          </Title>
          <Paragraph className="text-muted-foreground">
            Update class details and status
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
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Date & Time *</Label>
                <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input id="durationMinutes" type="number" min="1" {...register("durationMinutes")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setValue("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Input id="meetingUrl" placeholder="Google Meet or Zoom link" {...register("meetingUrl")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordingUrl">Recording URL</Label>
              <Input
                id="recordingUrl"
                placeholder="YouTube link after class ends"
                {...register("recordingUrl")}
              />
              <p className="text-xs text-muted-foreground">
                Add the YouTube recording URL after the class is completed
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link to Course</Label>
                <Select
                  value={courseId || "none"}
                  onValueChange={(v) => setValue("courseId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
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
                <Input id="maxStudents" type="number" min="0" placeholder="No limit" {...register("maxStudents")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting}>
            {(loading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Link href="/admin/live-classes">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
