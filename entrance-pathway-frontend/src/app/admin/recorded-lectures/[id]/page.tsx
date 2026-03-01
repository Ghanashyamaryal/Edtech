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
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { PlayCircle, ArrowLeft, Loader2, Eye } from "lucide-react";
import {
  getRecordedLecture,
  updateRecordedLecture,
  getCourses,
  getSubjects,
  type Course,
  type Subject,
} from "@/actions";
import { getYouTubeThumbnail } from "@/utils/youtube";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const editSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "YouTube URL is required"),
  subjectId: z.string().optional(),
  courseId: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  thumbnailUrl: z.string().optional(),
  isPublished: z.boolean(),
});

type EditFormData = z.infer<typeof editSchema>;

export default function EditRecordedLecturePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(true);
  const [viewCount, setViewCount] = React.useState(0);

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
      videoUrl: "",
      subjectId: "",
      courseId: "",
      durationMinutes: undefined,
      thumbnailUrl: "",
      isPublished: false,
    },
  });

  const videoUrl = watch("videoUrl");
  const subjectId = watch("subjectId");
  const courseId = watch("courseId");
  const isPublished = watch("isPublished");
  const thumbnailPreview = videoUrl ? getYouTubeThumbnail(videoUrl) : null;

  React.useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      const [lectureResult, coursesResult, subjectsResult] = await Promise.all([
        getRecordedLecture(params.id as string),
        getCourses({ limit: 100 }),
        getSubjects(),
      ]);

      if (coursesResult.success) setCourses(coursesResult.data);
      if (subjectsResult.success) setSubjects(subjectsResult.data);

      if (lectureResult.success) {
        const l = lectureResult.data;
        setViewCount(l.viewCount || 0);
        reset({
          title: l.title,
          description: l.description || "",
          videoUrl: l.videoUrl,
          subjectId: l.subjectId || "",
          courseId: l.courseId || "",
          durationMinutes: l.durationMinutes || undefined,
          thumbnailUrl: l.thumbnailUrl || "",
          isPublished: l.isPublished,
        });
      } else {
        toast({ title: "Error", description: lectureResult.error, variant: "destructive" });
      }
      setLoadingData(false);
    }
    loadData();
  }, [params.id, reset, toast]);

  const onSubmit = async (data: EditFormData) => {
    setLoading(true);

    const thumbnail = data.thumbnailUrl || getYouTubeThumbnail(data.videoUrl) || undefined;

    const result = await updateRecordedLecture(params.id as string, {
      title: data.title,
      description: data.description || undefined,
      videoUrl: data.videoUrl,
      subjectId: data.subjectId && data.subjectId !== "" ? data.subjectId : undefined,
      courseId: data.courseId && data.courseId !== "" ? data.courseId : undefined,
      durationMinutes: data.durationMinutes || undefined,
      thumbnailUrl: thumbnail,
      isPublished: data.isPublished,
    });

    if (result.success) {
      toast({ title: "Updated", description: "Lecture has been updated." });
      router.push("/admin/recorded-lectures");
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/recorded-lectures">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <Title className="flex items-center gap-2">
              <PlayCircle className="w-6 h-6" />
              Edit Recorded Lecture
            </Title>
            <Paragraph className="text-muted-foreground">
              Update lecture details
            </Paragraph>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4" />
          {viewCount.toLocaleString()} views
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lecture Details</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="published" className="text-sm">Published</Label>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(checked) => setValue("isPublished", checked)}
                />
              </div>
            </div>
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

            <div className="space-y-2">
              <Label htmlFor="videoUrl">YouTube URL *</Label>
              <Input id="videoUrl" {...register("videoUrl")} />
              {errors.videoUrl && (
                <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
              )}
            </div>

            {thumbnailPreview && (
              <div className="space-y-2">
                <Label>Video Preview</Label>
                <div className="relative aspect-video max-w-md rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={thumbnailPreview}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-black/50">
                      <PlayCircle className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input id="durationMinutes" type="number" min="0" {...register("durationMinutes")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject & Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={subjectId || "none"}
                  onValueChange={(v) => setValue("subjectId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No subject</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course</Label>
                <Select
                  value={courseId || "none"}
                  onValueChange={(v) => setValue("courseId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No course</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">Custom Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                placeholder="Leave empty to use YouTube thumbnail"
                {...register("thumbnailUrl")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting}>
            {(loading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
          <Link href="/admin/recorded-lectures">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
