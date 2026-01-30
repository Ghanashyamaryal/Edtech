"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
  Switch,
  Badge,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ArrowLeft, Save, FileText, Loader2, Download, Eye, CheckCircle } from "lucide-react";
import Link from "next/link";
import { GET_NOTE } from "@/graphql/queries/notes";
import { GET_SUBJECTS, GET_TOPICS } from "@/graphql/queries/admin";
import { UPDATE_NOTE, PUBLISH_NOTE } from "@/graphql/mutations/notes";
import { useToast } from "@/hooks/use-toast";

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  noteType: z.enum(["notes", "question_paper", "solution", "syllabus", "formula_sheet"]),
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional(),
  year: z.number().optional().nullable(),
  isPremium: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

type NoteFormData = z.infer<typeof noteSchema>;

const NOTE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "question_paper", label: "Question Paper" },
  { value: "solution", label: "Solution" },
  { value: "syllabus", label: "Syllabus" },
  { value: "formula_sheet", label: "Formula Sheet" },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const noteId = params.id as string;

  const { data: noteData, loading: loadingNote } = useQuery(GET_NOTE, {
    variables: { id: noteId },
  });
  const note = noteData?.note;

  const { data: subjectsData } = useQuery(GET_SUBJECTS);
  const subjects = subjectsData?.subjects || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const selectedSubjectId = watch("subjectId");
  const noteType = watch("noteType");

  // Load topics when subject is selected
  const { data: topicsData } = useQuery(GET_TOPICS, {
    variables: { subjectId: selectedSubjectId },
    skip: !selectedSubjectId,
  });
  const topics = topicsData?.topics || [];

  // Set form values when note data loads
  React.useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        description: note.description || "",
        noteType: note.noteType,
        subjectId: note.subjectId,
        topicId: note.topicId || "",
        year: note.year,
        isPremium: note.isPremium,
        isPublished: note.isPublished,
      });
    }
  }, [note, reset]);

  const [updateNote, { loading: updating }] = useMutation(UPDATE_NOTE, {
    onCompleted: () => {
      toast({
        title: "Note updated",
        description: "The note has been successfully updated.",
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

  const [publishNote, { loading: publishing }] = useMutation(PUBLISH_NOTE, {
    onCompleted: () => {
      toast({
        title: "Note published",
        description: "The note is now visible to users.",
      });
      setValue("isPublished", true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: NoteFormData) => {
    await updateNote({
      variables: {
        id: noteId,
        input: {
          title: data.title,
          description: data.description || null,
          noteType: data.noteType,
          subjectId: data.subjectId,
          topicId: data.topicId || null,
          year: data.year || null,
          isPremium: data.isPremium,
          isPublished: data.isPublished,
        },
      },
    });
  };

  const handlePublish = () => {
    publishNote({ variables: { id: noteId } });
  };

  if (loadingNote) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Note not found</p>
        <Link href="/admin/notes">
          <Button variant="outline" className="mt-4">
            Back to Notes
          </Button>
        </Link>
      </div>
    );
  }

  const isLoading = updating || publishing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/notes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <Title>Edit Note</Title>
            <Paragraph className="text-muted-foreground">
              Update note details and settings
            </Paragraph>
          </div>
        </div>

        {!watch("isPublished") && (
          <Button variant="outline" onClick={handlePublish} disabled={publishing}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Publish
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Note Details */}
          <Card>
            <CardHeader>
              <CardTitle>Note Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Physics Model Question 2024"
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
                  placeholder="Brief description of the content..."
                  rows={3}
                  {...register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noteType">Type *</Label>
                <Select
                  value={noteType}
                  onValueChange={(value) => setValue("noteType", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(noteType === "question_paper" || noteType === "solution") && (
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2024"
                    min={2000}
                    max={2100}
                    {...register("year", { valueAsNumber: true })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="premium">Premium Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Only accessible to premium users
                  </p>
                </div>
                <Switch
                  id="premium"
                  checked={watch("isPremium")}
                  onCheckedChange={(checked) => setValue("isPremium", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make visible to users
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={watch("isPublished")}
                  onCheckedChange={(checked) => setValue("isPublished", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subject & File Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject & Topic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={selectedSubjectId}
                    onValueChange={(value) => {
                      setValue("subjectId", value);
                      setValue("topicId", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && (
                    <p className="text-sm text-destructive">{errors.subjectId.message}</p>
                  )}
                </div>

                {topics.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic (Optional)</Label>
                    <Select
                      value={watch("topicId") || ""}
                      onValueChange={(value) => setValue("topicId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic: any) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-2 rounded bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{note.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(note.fileSize)} • {note.fileType}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button type="button" variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href={note.fileUrl} download={note.fileName}>
                      <Button type="button" variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Downloads</p>
                    <p className="font-medium">{note.downloadCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uploaded by</p>
                    <p className="font-medium">{note.uploader?.fullName || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={note.isPublished ? "default" : "secondary"}>
                      {note.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/notes">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading || !isDirty}>
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
