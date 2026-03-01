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
import {
  PlayCircle,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import {
  getRecordedLectures,
  deleteRecordedLecture,
  publishRecordedLecture,
  type RecordedLecture,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";

export default function AdminRecordedLecturesPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedLecture, setSelectedLecture] = React.useState<RecordedLecture | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [lectures, setLectures] = React.useState<RecordedLecture[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  const loadLectures = React.useCallback(async () => {
    setLoading(true);
    const result = await getRecordedLectures({ limit: 50 });
    if (result.success) {
      setLectures(result.data);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  React.useEffect(() => {
    loadLectures();
  }, [loadLectures]);

  const handleDelete = (lecture: RecordedLecture) => {
    setSelectedLecture(lecture);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedLecture) return;
    setDeleting(true);
    const result = await deleteRecordedLecture(selectedLecture.id);
    if (result.success) {
      toast({ title: "Deleted", description: "Lecture has been deleted." });
      setShowDeleteDialog(false);
      loadLectures();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setDeleting(false);
  };

  const handlePublish = async (lecture: RecordedLecture) => {
    const result = await publishRecordedLecture(lecture.id);
    if (result.success) {
      toast({ title: "Published", description: "Lecture is now visible to students." });
      loadLectures();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const filteredLectures = lectures.filter((l) =>
    l.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Stats
  const published = lectures.filter((l) => l.isPublished).length;
  const totalViews = lectures.reduce((sum, l) => sum + (l.viewCount || 0), 0);

  const columns: Column<RecordedLecture>[] = [
    {
      key: "lecture",
      header: "Lecture",
      cell: (l) => (
        <div>
          <p className="font-medium">{l.title}</p>
          {l.instructor && (
            <p className="text-sm text-muted-foreground">{l.instructor.fullName}</p>
          )}
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      cell: (l) =>
        l.subject ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
            {l.subject.name}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (l) => (l.durationMinutes ? `${l.durationMinutes} min` : "-"),
    },
    {
      key: "views",
      header: "Views",
      cell: (l) => (
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm">{l.viewCount?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (l) => <StatusBadge status={l.isPublished} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (l) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/recorded-lectures/${l.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            {l.videoUrl && (
              <DropdownMenuItem asChild>
                <a href={l.videoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview Video
                </a>
              </DropdownMenuItem>
            )}
            {!l.isPublished && (
              <DropdownMenuItem onClick={() => handlePublish(l)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(l)} className="text-red-600">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6" />
            Recorded Lectures
          </Title>
          <Paragraph className="text-muted-foreground">
            Manage recorded video lectures
          </Paragraph>
        </div>
        <Link href="/admin/recorded-lectures/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Lecture
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{lectures.length}</p>
            <p className="text-sm text-muted-foreground">Total Lectures</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-2xl font-bold">{published}</p>
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <DataTable
            data={filteredLectures}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search lectures..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No recorded lectures found. Add your first lecture!"
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Lecture"
        description={`Are you sure you want to delete "${selectedLecture?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
