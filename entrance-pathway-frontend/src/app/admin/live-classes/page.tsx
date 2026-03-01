"use client";

import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, ConfirmDialog } from "@/components/molecules/admin";
import {
  Video,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Radio,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import {
  getLiveClasses,
  deleteLiveClass,
  updateLiveClass,
  type LiveClass,
} from "@/actions";
import { useToast } from "@/hooks/use-toast";

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  live: { label: "Live Now", variant: "destructive" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminLiveClassesPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState<LiveClass | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [classes, setClasses] = React.useState<LiveClass[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  const loadClasses = React.useCallback(async () => {
    setLoading(true);
    const result = await getLiveClasses({ limit: 50 });
    if (result.success) {
      setClasses(result.data);
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setLoading(false);
  }, [toast]);

  React.useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const handleDelete = (liveClass: LiveClass) => {
    setSelectedClass(liveClass);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedClass) return;
    setDeleting(true);
    const result = await deleteLiveClass(selectedClass.id);
    if (result.success) {
      toast({ title: "Deleted", description: "Live class has been deleted." });
      setShowDeleteDialog(false);
      loadClasses();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setDeleting(false);
  };

  const handleStatusChange = async (liveClass: LiveClass, status: "live" | "completed" | "cancelled") => {
    const result = await updateLiveClass(liveClass.id, { status });
    if (result.success) {
      toast({ title: "Updated", description: `Class marked as ${status}.` });
      loadClasses();
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const filteredClasses = classes.filter((c) =>
    c.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Stats
  const upcoming = classes.filter((c) => c.status === "scheduled").length;
  const liveNow = classes.filter((c) => c.status === "live").length;
  const completed = classes.filter((c) => c.status === "completed").length;

  const columns: Column<LiveClass>[] = [
    {
      key: "class",
      header: "Class",
      cell: (c) => (
        <div>
          <p className="font-medium">{c.title}</p>
          {c.instructor && (
            <p className="text-sm text-muted-foreground">{c.instructor.fullName}</p>
          )}
        </div>
      ),
    },
    {
      key: "scheduled",
      header: "Scheduled",
      cell: (c) => (
        <span className="text-sm">{formatDateTime(c.scheduledAt)}</span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      cell: (c) => `${c.durationMinutes} min`,
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => {
        const style = STATUS_STYLES[c.status] || STATUS_STYLES.scheduled;
        return <Badge variant={style.variant}>{style.label}</Badge>;
      },
    },
    {
      key: "link",
      header: "Link",
      cell: (c) =>
        c.meetingUrl ? (
          <a href={c.meetingUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <ExternalLink className="w-4 h-4 text-primary" />
            </Button>
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (c) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/live-classes/${c.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            {c.status === "scheduled" && (
              <DropdownMenuItem onClick={() => handleStatusChange(c, "live")}>
                <Radio className="w-4 h-4 mr-2" />
                Mark as Live
              </DropdownMenuItem>
            )}
            {c.status === "live" && (
              <DropdownMenuItem onClick={() => handleStatusChange(c, "completed")}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(c)} className="text-red-600">
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
            <Video className="w-6 h-6" />
            Live Classes
          </Title>
          <Paragraph className="text-muted-foreground">
            Schedule and manage live class sessions
          </Paragraph>
        </div>
        <Link href="/admin/live-classes/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Class
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{classes.length}</p>
            <p className="text-sm text-muted-foreground">Total Classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-2xl font-bold">{upcoming}</p>
            </div>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-destructive" />
              <p className="text-2xl font-bold">{liveNow}</p>
            </div>
            <p className="text-sm text-muted-foreground">Live Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-2xl font-bold">{completed}</p>
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <DataTable
            data={filteredClasses}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search classes..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No live classes found. Schedule your first class!"
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Live Class"
        description={`Are you sure you want to delete "${selectedClass?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
