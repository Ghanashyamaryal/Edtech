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
import { PlayCircle, ArrowLeft, Loader2 } from "lucide-react";
import {
  createRecordedLecture,
  getCourses,
  getSubjects,
  type Course,
  type Subject,
} from "@/actions";
import { extractYouTubeId, getYouTubeThumbnail } from "@/utils/youtube";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const lectureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().min(1, "YouTube URL is required"),
  subjectId: z.string().optional(),
  courseId: z.string().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  thumbnailUrl: z.string().optional(),
});

type LectureFormData = z.infer<typeof lectureSchema>;

export default function NewRecordedLecturePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LectureFormData>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      subjectId: "",
      courseId: "",
      durationMinutes: undefined,
      thumbnailUrl: "",
    },
  });

  const videoUrl = watch("videoUrl");
  const subjectId = watch("subjectId");
  const courseId = watch("courseId");

  // Auto-generate thumbnail from YouTube URL
  const thumbnailPreview = videoUrl ? getYouTubeThumbnail(videoUrl) : null;

  React.useEffect(() => {
    async function loadData() {
      const [coursesResult, subjectsResult] = await Promise.all([
        getCourses({ limit: 100 }),
        getSubjects(),
      ]);
      if (coursesResult.success) setCourses(coursesResult.data);
      if (subjectsResult.success) setSubjects(subjectsResult.data);
    }
    loadData();
  }, []);

  const onSubmit = async (data: LectureFormData) => {
    setLoading(true);

    // Use YouTube thumbnail if no custom thumbnail provided
    const thumbnail = data.thumbnailUrl || getYouTubeThumbnail(data.videoUrl) || undefined;

    const result = await createRecordedLecture({
      title: data.title,
      description: data.description || undefined,
      videoUrl: data.videoUrl,
      subjectId: data.subjectId && data.subjectId !== "" ? data.subjectId : undefined,
      courseId: data.courseId && data.courseId !== "" ? data.courseId : undefined,
      durationMinutes: data.durationMinutes || undefined,
      thumbnailUrl: thumbnail,
    });

    if (result.success) {
      toast({ title: "Lecture added", description: "Publish it to make it visible to students." });
      router.push("/admin/recorded-lectures");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/recorded-lectures">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <Title className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6" />
            Add Recorded Lecture
          </Title>
          <Paragraph className="text-muted-foreground">
            Add a YouTube video as a recorded lecture
          </Paragraph>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Lecture Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Quantum Mechanics"
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
                placeholder="Brief description of the lecture"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">YouTube URL *</Label>
              <Input
                id="videoUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register("videoUrl")}
              />
              {errors.videoUrl && (
                <p className="text-sm text-destructive">{errors.videoUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Paste your unlisted YouTube video URL
              </p>
            </div>

            {/* YouTube Preview */}
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
              <Input
                id="durationMinutes"
                type="number"
                min="0"
                placeholder="e.g., 45"
                {...register("durationMinutes")}
              />
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
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No subject</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
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
                    <SelectValue placeholder="Select course (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No course</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
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
              <p className="text-xs text-muted-foreground">
                Optional — YouTube thumbnail is used automatically
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || isSubmitting}>
            {(loading || isSubmitting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add Lecture
          </Button>
          <Link href="/admin/recorded-lectures">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
