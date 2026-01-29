"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Switch,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { ConfirmDialog } from "@/components/molecules/admin";
import {
  Layers,
  ArrowLeft,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Video,
  GripVertical,
} from "lucide-react";
import { GET_ADMIN_COURSE } from "@/graphql/queries/admin";
import {
  CREATE_CHAPTER,
  UPDATE_CHAPTER,
  DELETE_CHAPTER,
  CREATE_LESSON,
  UPDATE_LESSON,
  DELETE_LESSON,
} from "@/graphql/mutations/admin";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
}

export default function ChaptersPage() {
  const params = useParams();
  const { toast } = useToast();
  const courseId = params.id as string;

  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(new Set());
  const [showChapterDialog, setShowChapterDialog] = React.useState(false);
  const [showLessonDialog, setShowLessonDialog] = React.useState(false);
  const [editingChapter, setEditingChapter] = React.useState<Chapter | null>(null);
  const [editingLesson, setEditingLesson] = React.useState<Lesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: "chapter" | "lesson"; id: string; name: string } | null>(null);

  // Chapter form state
  const [chapterTitle, setChapterTitle] = React.useState("");
  const [chapterDescription, setChapterDescription] = React.useState("");

  // Lesson form state
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [lessonDescription, setLessonDescription] = React.useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = React.useState("");
  const [lessonIsFree, setLessonIsFree] = React.useState(false);

  const { data, loading, refetch } = useQuery(GET_ADMIN_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const [createChapter, { loading: creatingChapter }] = useMutation(CREATE_CHAPTER, {
    onCompleted: () => {
      toast({ title: "Chapter created" });
      setShowChapterDialog(false);
      resetChapterForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [updateChapter, { loading: updatingChapter }] = useMutation(UPDATE_CHAPTER, {
    onCompleted: () => {
      toast({ title: "Chapter updated" });
      setShowChapterDialog(false);
      resetChapterForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [deleteChapter, { loading: deletingChapter }] = useMutation(DELETE_CHAPTER, {
    onCompleted: () => {
      toast({ title: "Chapter deleted" });
      setDeleteTarget(null);
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [createLesson, { loading: creatingLesson }] = useMutation(CREATE_LESSON, {
    onCompleted: () => {
      toast({ title: "Lesson created" });
      setShowLessonDialog(false);
      resetLessonForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [updateLesson, { loading: updatingLesson }] = useMutation(UPDATE_LESSON, {
    onCompleted: () => {
      toast({ title: "Lesson updated" });
      setShowLessonDialog(false);
      resetLessonForm();
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const [deleteLesson, { loading: deletingLesson }] = useMutation(DELETE_LESSON, {
    onCompleted: () => {
      toast({ title: "Lesson deleted" });
      setDeleteTarget(null);
      refetch();
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const resetChapterForm = () => {
    setChapterTitle("");
    setChapterDescription("");
    setEditingChapter(null);
  };

  const resetLessonForm = () => {
    setLessonTitle("");
    setLessonDescription("");
    setLessonVideoUrl("");
    setLessonIsFree(false);
    setEditingLesson(null);
    setSelectedChapterId(null);
  };

  const openChapterDialog = (chapter?: Chapter) => {
    if (chapter) {
      setEditingChapter(chapter);
      setChapterTitle(chapter.title);
      setChapterDescription(chapter.description || "");
    }
    setShowChapterDialog(true);
  };

  const openLessonDialog = (chapterId: string, lesson?: Lesson) => {
    setSelectedChapterId(chapterId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonTitle(lesson.title);
      setLessonDescription(lesson.description || "");
      setLessonVideoUrl(lesson.videoUrl || "");
      setLessonIsFree(lesson.isFree);
    }
    setShowLessonDialog(true);
  };

  const handleSaveChapter = () => {
    if (editingChapter) {
      updateChapter({
        variables: {
          id: editingChapter.id,
          title: chapterTitle,
          description: chapterDescription || null,
        },
      });
    } else {
      createChapter({
        variables: {
          input: {
            courseId,
            title: chapterTitle,
            description: chapterDescription || null,
          },
        },
      });
    }
  };

  const handleSaveLesson = () => {
    if (editingLesson) {
      updateLesson({
        variables: {
          id: editingLesson.id,
          title: lessonTitle,
          description: lessonDescription || null,
          videoUrl: lessonVideoUrl || null,
          isFree: lessonIsFree,
        },
      });
    } else {
      createLesson({
        variables: {
          input: {
            chapterId: selectedChapterId,
            title: lessonTitle,
            description: lessonDescription || null,
            videoUrl: lessonVideoUrl || null,
            isFree: lessonIsFree,
          },
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "chapter") {
      deleteChapter({ variables: { id: deleteTarget.id } });
    } else {
      deleteLesson({ variables: { id: deleteTarget.id } });
    }
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const course = data?.course;
  const chapters: Chapter[] = course?.chapters || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/admin/courses/${courseId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <Title className="flex items-center gap-2">
              <Layers className="w-6 h-6" />
              Chapters & Lessons
            </Title>
            <Paragraph className="text-muted-foreground">
              {course?.title}
            </Paragraph>
          </div>
        </div>
        <Button onClick={() => openChapterDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Chapter
        </Button>
      </div>

      {/* Chapters List */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No chapters yet</p>
              <Button onClick={() => openChapterDialog()}>Add First Chapter</Button>
            </CardContent>
          </Card>
        ) : (
          chapters
            .sort((a, b) => a.position - b.position)
            .map((chapter, index) => (
              <Card key={chapter.id}>
                <Collapsible
                  open={expandedChapters.has(chapter.id)}
                  onOpenChange={() => toggleChapter(chapter.id)}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="gap-2 p-0 h-auto hover:bg-transparent">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            Chapter {index + 1}: {chapter.title}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({chapter.lessons?.length || 0} lessons)
                          </span>
                        </Button>
                      </CollapsibleTrigger>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openChapterDialog(chapter)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDeleteTarget({ type: "chapter", id: chapter.id, name: chapter.title })
                          }
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-2 ml-8">
                        {chapter.lessons
                          ?.sort((a, b) => a.position - b.position)
                          .map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                <Video className="w-4 h-4 text-primary" />
                                <div>
                                  <p className="font-medium">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  {lesson.isFree && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openLessonDialog(chapter.id, lesson)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setDeleteTarget({ type: "lesson", id: lesson.id, name: lesson.title })
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => openLessonDialog(chapter.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Lesson
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
        )}
      </div>

      {/* Chapter Dialog */}
      <Dialog open={showChapterDialog} onOpenChange={(open) => { setShowChapterDialog(open); if (!open) resetChapterForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChapter ? "Edit Chapter" : "Add Chapter"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Enter chapter title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={chapterDescription}
                onChange={(e) => setChapterDescription(e.target.value)}
                placeholder="Enter chapter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChapterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChapter} disabled={!chapterTitle || creatingChapter || updatingChapter}>
              {(creatingChapter || updatingChapter) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingChapter ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={(open) => { setShowLessonDialog(open); if (!open) resetLessonForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLesson ? "Edit Lesson" : "Add Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Enter lesson title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                placeholder="Enter lesson description"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={lessonVideoUrl}
                onChange={(e) => setLessonVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Free Preview</Label>
                <p className="text-sm text-muted-foreground">Allow anyone to view this lesson</p>
              </div>
              <Switch checked={lessonIsFree} onCheckedChange={setLessonIsFree} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLessonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson} disabled={!lessonTitle || creatingLesson || updatingLesson}>
              {(creatingLesson || updatingLesson) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingLesson ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "chapter" ? "Chapter" : "Lesson"}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? ${deleteTarget?.type === "chapter" ? "This will also delete all lessons in this chapter." : ""} This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deletingChapter || deletingLesson}
        variant="destructive"
      />
    </div>
  );
}
