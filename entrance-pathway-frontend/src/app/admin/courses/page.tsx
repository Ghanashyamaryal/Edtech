"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, StatusBadge, ConfirmDialog } from "@/components/molecules/admin";
import { BookOpen, Plus, MoreHorizontal, Pencil, Trash2, Layers, Eye, Loader2 } from "lucide-react";
import { getCourses, deleteCourse, publishCourse, type Course } from "@/actions";
import { useToast } from "@/hooks/use-toast";

export default function AdminCoursesPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  const loadCourses = React.useCallback(async () => {
    setLoading(true);
    const result = await getCourses({ limit: 50 });
    if (result.success) {
      setCourses(result.data);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;
    setDeleting(true);
    const result = await deleteCourse(selectedCourse.id);
    if (result.success) {
      toast({ title: "Course deleted", description: "The course has been successfully deleted." });
      setShowDeleteDialog(false);
      loadCourses();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setDeleting(false);
  };

  const handlePublish = async (courseId: string) => {
    const result = await publishCourse(courseId);
    if (result.success) {
      toast({ title: "Course published", description: "The course is now live." });
      loadCourses();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: Column<Course>[] = [
    {
      key: "course",
      header: "Course",
      cell: (course) => (
        <div className="flex items-center gap-3">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-12 h-8 rounded object-cover"
            />
          ) : (
            <div className="w-12 h-8 rounded bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
          )}
          <div>
            <p className="font-medium">{course.title}</p>
            <p className="text-sm text-muted-foreground">
              {course.chaptersCount || 0} chapters, {course.lessonsCount || 0} lessons
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      cell: (course) => (
        <span className="font-medium">
          {course.price === 0 ? "Free" : `Rs.${course.price}`}
        </span>
      ),
    },
    {
      key: "enrollments",
      header: "Enrollments",
      cell: (course) => course.enrollmentsCount || 0,
    },
    {
      key: "status",
      header: "Status",
      cell: (course) => <StatusBadge status={course.isPublished} />,
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (course) => new Date(course.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (course) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${course.id}/chapters`}>
                <Layers className="w-4 h-4 mr-2" />
                Manage Chapters
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${course.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Course
              </Link>
            </DropdownMenuItem>
            {!course.isPublished && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlePublish(course.id)}>
                  Publish Course
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(course)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Course Management
          </Title>
          <Paragraph className="text-muted-foreground">
            Create and manage courses with chapters and lessons
          </Paragraph>
        </div>
        <Link href="/admin/courses/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Course
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredCourses}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search courses..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No courses found. Create your first course!"
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"? This will also delete all chapters and lessons. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
