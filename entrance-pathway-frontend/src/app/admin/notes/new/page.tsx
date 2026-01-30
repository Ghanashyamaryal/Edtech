"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { GET_SUBJECTS, GET_TOPICS } from "@/graphql/queries/admin";
import { CREATE_NOTE } from "@/graphql/mutations/notes";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for file upload
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  noteType: z.enum(["notes", "question_paper", "solution", "syllabus", "formula_sheet"]),
  subjectId: z.string().min(1, "Subject is required"),
  topicId: z.string().optional(),
  year: z.number().optional(),
  isPremium: z.boolean().default(false),
});

type NoteFormData = z.infer<typeof noteSchema>;

const NOTE_TYPES = [
  { value: "notes", label: "Notes" },
  { value: "question_paper", label: "Question Paper" },
  { value: "solution", label: "Solution" },
  { value: "syllabus", label: "Syllabus" },
  { value: "formula_sheet", label: "Formula Sheet" },
];

export default function NewNotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: subjectsData } = useQuery(GET_SUBJECTS);
  const subjects = subjectsData?.subjects || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      noteType: "notes",
      isPremium: false,
    },
  });

  const selectedSubjectId = watch("subjectId");
  const noteType = watch("noteType");

  // Load topics when subject is selected
  const { data: topicsData } = useQuery(GET_TOPICS, {
    variables: { subjectId: selectedSubjectId },
    skip: !selectedSubjectId,
  });
  const topics = topicsData?.topics || [];

  const [createNote, { loading: creating }] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      toast({
        title: "Note created",
        description: "The note has been successfully uploaded.",
      });
      router.push("/admin/notes");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, or image file.",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (50MB max)
      if (file.size > 52428800) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File, subjectId: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${subjectId}/${noteType}/${fileName}`;

    const { error } = await supabase.storage
      .from("notes")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage.from("notes").getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const onSubmit = async (data: NoteFormData) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(30);

      // Upload file to Supabase Storage
      const fileUrl = await uploadFile(selectedFile, data.subjectId);
      setUploadProgress(70);

      // Create note in database
      await createNote({
        variables: {
          input: {
            title: data.title,
            description: data.description || null,
            fileUrl,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            noteType: data.noteType,
            subjectId: data.subjectId,
            topicId: data.topicId || null,
            year: data.year || null,
            isPremium: data.isPremium,
          },
        },
      });
      setUploadProgress(100);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload note",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const isLoading = uploading || creating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/notes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <Title>Upload New Note</Title>
          <Paragraph className="text-muted-foreground">
            Add a new note, question paper, or study material
          </Paragraph>
        </div>
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
            </CardContent>
          </Card>

          {/* Subject & File */}
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
                      setValue("topicId", ""); // Reset topic when subject changes
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
                <CardTitle>File Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileSelect}
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium">Click to upload file</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, Word, or Image files up to 50MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className="p-2 rounded bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
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
          <Button type="submit" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Note
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
