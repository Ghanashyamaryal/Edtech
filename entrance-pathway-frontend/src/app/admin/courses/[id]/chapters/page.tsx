"use client";

import * as React from "react";
import { useParams } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  ClipboardList,
  BookOpen,
  X,
} from "lucide-react";
import {
  getCourseWithChapters,
  getCourseExams,
  getExams,
  getCourseSubjects,
  getSubjects,
  createChapter,
  updateChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
  linkExamToCourse,
  unlinkExamFromCourse,
  linkSubjectToCourse,
  unlinkSubjectFromCourse,
  type Course,
  type Chapter,
  type Lesson,
  type CourseExam,
  type Exam,
  type CourseSubject,
  type Subject,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const EXAM_TYPE_LABELS: Record<string, string> = {
  full_model: "Full Model",
  subject: "Subject",
  chapter: "Chapter",
  practice: "Practice",
  previous_year: "Previous Year",
};

export default function ChaptersPage() {
  const params = useParams();
  const { toast } = useToast();
  const courseId = params.id as string;

  // Data states
  const [course, setCourse] = React.useState<(Course & { chapters: (Chapter & { lessons: Lesson[] })[] }) | null>(null);
  const [linkedExams, setLinkedExams] = React.useState<CourseExam[]>([]);
  const [allExams, setAllExams] = React.useState<Exam[]>([]);
  const [linkedSubjects, setLinkedSubjects] = React.useState<CourseSubject[]>([]);
  const [allSubjects, setAllSubjects] = React.useState<Subject[]>([]);

  // Loading states
  const [loading, setLoading] = React.useState(true);
  const [loadingExams, setLoadingExams] = React.useState(true);
  const [loadingSubjects, setLoadingSubjects] = React.useState(true);

  // UI states
  const [expandedChapters, setExpandedChapters] = React.useState<Set<string>>(new Set());
  const [showChapterDialog, setShowChapterDialog] = React.useState(false);
  const [showLessonDialog, setShowLessonDialog] = React.useState(false);
  const [editingChapter, setEditingChapter] = React.useState<Chapter | null>(null);
  const [editingLesson, setEditingLesson] = React.useState<Lesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ type: "chapter" | "lesson"; id: string; name: string } | null>(null);
  const [selectedExamToAdd, setSelectedExamToAdd] = React.useState("");
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = React.useState("");

  // Action loading states
  const [creatingChapter, setCreatingChapter] = React.useState(false);
  const [updatingChapter, setUpdatingChapter] = React.useState(false);
  const [deletingChapter, setDeletingChapter] = React.useState(false);
  const [creatingLesson, setCreatingLesson] = React.useState(false);
  const [updatingLesson, setUpdatingLesson] = React.useState(false);
  const [deletingLesson, setDeletingLesson] = React.useState(false);
  const [linkingExam, setLinkingExam] = React.useState(false);
  const [unlinkingExam, setUnlinkingExam] = React.useState(false);
  const [linkingSubject, setLinkingSubject] = React.useState(false);
  const [unlinkingSubject, setUnlinkingSubject] = React.useState(false);

  // Chapter form state
  const [chapterTitle, setChapterTitle] = React.useState("");
  const [chapterDescription, setChapterDescription] = React.useState("");

  // Lesson form state
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [lessonDescription, setLessonDescription] = React.useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = React.useState("");
  const [lessonIsFree, setLessonIsFree] = React.useState(false);

  // Load course data
  const loadCourse = React.useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    const result = await getCourseWithChapters(courseId);
    if (result.success) {
      setCourse(result.data as any);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [courseId, toast]);

  // Load course exams
  const loadCourseExams = React.useCallback(async () => {
    if (!courseId) return;
    setLoadingExams(true);
    const result = await getCourseExams(courseId);
    if (result.success) {
      setLinkedExams(result.data);
    }
    setLoadingExams(false);
  }, [courseId]);

  // Load all exams
  const loadAllExams = React.useCallback(async () => {
    const result = await getExams({ limit: 100 });
    if (result.success) {
      setAllExams(result.data);
    }
  }, []);

  // Load course subjects
  const loadCourseSubjects = React.useCallback(async () => {
    if (!courseId) return;
    setLoadingSubjects(true);
    const result = await getCourseSubjects(courseId);
    if (result.success) {
      setLinkedSubjects(result.data);
    }
    setLoadingSubjects(false);
  }, [courseId]);

  // Load all subjects
  const loadAllSubjects = React.useCallback(async () => {
    const result = await getSubjects();
    if (result.success) {
      setAllSubjects(result.data);
    }
  }, []);

  // Initial data load
  React.useEffect(() => {
    loadCourse();
    loadCourseExams();
    loadAllExams();
    loadCourseSubjects();
    loadAllSubjects();
  }, [loadCourse, loadCourseExams, loadAllExams, loadCourseSubjects, loadAllSubjects]);

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

  const handleSaveChapter = async () => {
    if (editingChapter) {
      setUpdatingChapter(true);
      const result = await updateChapter(editingChapter.id, {
        title: chapterTitle,
        description: chapterDescription || undefined,
      });
      if (result.success) {
        toast({ title: "Chapter updated" });
        setShowChapterDialog(false);
        resetChapterForm();
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setUpdatingChapter(false);
    } else {
      setCreatingChapter(true);
      const result = await createChapter({
        courseId,
        title: chapterTitle,
        description: chapterDescription || undefined,
      });
      if (result.success) {
        toast({ title: "Chapter created" });
        setShowChapterDialog(false);
        resetChapterForm();
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setCreatingChapter(false);
    }
  };

  const handleSaveLesson = async () => {
    if (editingLesson) {
      setUpdatingLesson(true);
      const result = await updateLesson(editingLesson.id, {
        title: lessonTitle,
        description: lessonDescription || undefined,
        videoUrl: lessonVideoUrl || undefined,
        isFree: lessonIsFree,
      });
      if (result.success) {
        toast({ title: "Lesson updated" });
        setShowLessonDialog(false);
        resetLessonForm();
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setUpdatingLesson(false);
    } else {
      if (!selectedChapterId) return;
      setCreatingLesson(true);
      const result = await createLesson({
        chapterId: selectedChapterId,
        title: lessonTitle,
        description: lessonDescription || undefined,
        videoUrl: lessonVideoUrl || undefined,
        isFree: lessonIsFree,
      });
      if (result.success) {
        toast({ title: "Lesson created" });
        setShowLessonDialog(false);
        resetLessonForm();
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setCreatingLesson(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "chapter") {
      setDeletingChapter(true);
      const result = await deleteChapter(deleteTarget.id);
      if (result.success) {
        toast({ title: "Chapter deleted" });
        setDeleteTarget(null);
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setDeletingChapter(false);
    } else {
      setDeletingLesson(true);
      const result = await deleteLesson(deleteTarget.id);
      if (result.success) {
        toast({ title: "Lesson deleted" });
        setDeleteTarget(null);
        loadCourse();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
      setDeletingLesson(false);
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

  const handleLinkExam = async () => {
    if (!selectedExamToAdd) return;
    setLinkingExam(true);
    const result = await linkExamToCourse(selectedExamToAdd, courseId);
    if (result.success) {
      toast({ title: "Exam linked", description: "The exam has been added to this course." });
      setSelectedExamToAdd("");
      loadCourseExams();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLinkingExam(false);
  };

  const handleUnlinkExam = async (examId: string) => {
    setUnlinkingExam(true);
    const result = await unlinkExamFromCourse(examId, courseId);
    if (result.success) {
      toast({ title: "Exam unlinked", description: "The exam has been removed from this course." });
      loadCourseExams();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setUnlinkingExam(false);
  };

  const handleLinkSubject = async () => {
    if (!selectedSubjectToAdd) return;
    setLinkingSubject(true);
    const result = await linkSubjectToCourse(courseId, selectedSubjectToAdd);
    if (result.success) {
      toast({ title: "Subject linked", description: "The subject has been added to this course." });
      setSelectedSubjectToAdd("");
      loadCourseSubjects();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLinkingSubject(false);
  };

  const handleUnlinkSubject = async (subjectId: string) => {
    setUnlinkingSubject(true);
    const result = await unlinkSubjectFromCourse(courseId, subjectId);
    if (result.success) {
      toast({ title: "Subject unlinked", description: "The subject has been removed from this course." });
      loadCourseSubjects();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setUnlinkingSubject(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const chapters = course?.chapters || [];
  const linkedExamIds = linkedExams.map((ce) => ce.examId);
  const availableExams = allExams.filter((exam) => !linkedExamIds.includes(exam.id));
  const linkedSubjectIds = linkedSubjects.map((cs) => cs.subjectId);
  const availableSubjects = allSubjects.filter((subject) => !linkedSubjectIds.includes(subject.id));

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
                  <CardHeader className="px-3 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="gap-2 p-0 h-auto hover:bg-transparent min-w-0">
                          <GripVertical className="w-4 h-4 shrink-0 text-muted-foreground" />
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="w-4 h-4 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 shrink-0" />
                          )}
                          <span className="font-semibold truncate">
                            Chapter {index + 1}: {chapter.title}
                          </span>
                          <span className="text-sm text-muted-foreground ml-2 shrink-0 hidden sm:inline">
                            ({chapter.lessons?.length || 0} lessons)
                          </span>
                        </Button>
                      </CollapsibleTrigger>
                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
                    <CardContent className="px-3 sm:px-6 pt-0">
                      <div className="space-y-2 ml-2 sm:ml-8">
                        {chapter.lessons
                          ?.sort((a, b) => a.position - b.position)
                          .map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <GripVertical className="w-4 h-4 shrink-0 text-muted-foreground hidden sm:block" />
                                <Video className="w-4 h-4 shrink-0 text-primary" />
                                <div className="min-w-0">
                                  <p className="font-medium truncate">
                                    {lessonIndex + 1}. {lesson.title}
                                  </p>
                                  {lesson.isFree && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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

      {/* Exams Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Course Exams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Exam */}
          {availableExams.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedExamToAdd}
                onValueChange={setSelectedExamToAdd}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select an exam to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableExams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.title}
                      {exam.examType && ` (${EXAM_TYPE_LABELS[exam.examType] || exam.examType})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleLinkExam}
                disabled={!selectedExamToAdd || linkingExam}
                className="gap-2"
              >
                {linkingExam ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </Button>
            </div>
          )}

          {/* Linked Exams List */}
          {loadingExams ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : linkedExams.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No exams linked to this course</p>
              <p className="text-sm text-muted-foreground">
                Add exams above or{" "}
                <Link href="/admin/exams/new" className="text-primary hover:underline">
                  create a new exam
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedExams
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((courseExam) => (
                  <div
                    key={courseExam.id}
                    className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <GripVertical className="w-4 h-4 shrink-0 text-muted-foreground hidden sm:block" />
                      <ClipboardList className="w-4 h-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{courseExam.exam?.title}</p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          {courseExam.exam?.examType && (
                            <span className="bg-muted px-1.5 py-0.5 rounded">
                              {EXAM_TYPE_LABELS[courseExam.exam.examType] || courseExam.exam.examType}
                              {courseExam.exam.setNumber && courseExam.exam.setNumber > 1 && ` Set ${courseExam.exam.setNumber}`}
                            </span>
                          )}
                          <span>{courseExam.exam?.durationMinutes} min</span>
                          <span>{courseExam.exam?.totalMarks} marks</span>
                          <span>{courseExam.exam?.questionsCount || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Link href={`/admin/exams/${courseExam.examId}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnlinkExam(courseExam.examId)}
                        disabled={unlinkingExam}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {availableExams.length === 0 && linkedExams.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              All available exams have been linked.{" "}
              <Link href="/admin/exams/new" className="text-primary hover:underline">
                Create a new exam
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Subjects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Subject */}
          {availableSubjects.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedSubjectToAdd}
                onValueChange={setSelectedSubjectToAdd}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a subject to add" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                      {(subject.questionsCount ?? 0) > 0 && ` (${subject.questionsCount} questions)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleLinkSubject}
                disabled={!selectedSubjectToAdd || linkingSubject}
                className="gap-2"
              >
                {linkingSubject ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </Button>
            </div>
          )}

          {/* Linked Subjects List */}
          {loadingSubjects ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : linkedSubjects.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No subjects linked to this course</p>
              <p className="text-sm text-muted-foreground">
                Add subjects above or{" "}
                <Link href="/admin/subjects" className="text-primary hover:underline">
                  manage subjects
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedSubjects
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((courseSubject) => (
                  <div
                    key={courseSubject.id}
                    className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg border bg-muted/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <GripVertical className="w-4 h-4 shrink-0 text-muted-foreground hidden sm:block" />
                      <BookOpen className="w-4 h-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{courseSubject.subject?.name}</p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          <span>{courseSubject.subject?.topicsCount || 0} topics</span>
                          <span>{courseSubject.subject?.questionsCount || 0} questions</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnlinkSubject(courseSubject.subjectId)}
                      disabled={unlinkingSubject}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          {availableSubjects.length === 0 && linkedSubjects.length > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              All available subjects have been linked.{" "}
              <Link href="/admin/subjects" className="text-primary hover:underline">
                Create a new subject
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

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
          <DialogFooter className="flex-col sm:flex-row gap-2">
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
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
