"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Badge,
} from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import { DataTable, Column, StatusBadge, ConfirmDialog } from "@/components/molecules/admin";
import { FileText, Plus, MoreHorizontal, Pencil, Trash2, Download, Eye, CheckCircle } from "lucide-react";
import { GET_ADMIN_NOTES } from "@/graphql/queries/notes";
import { DELETE_NOTE, PUBLISH_NOTE } from "@/graphql/mutations/notes";
import { useToast } from "@/hooks/use-toast";

const NOTE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  notes: { label: "Notes", color: "bg-blue-100 text-blue-800" },
  question_paper: { label: "Question Paper", color: "bg-purple-100 text-purple-800" },
  solution: { label: "Solution", color: "bg-green-100 text-green-800" },
  syllabus: { label: "Syllabus", color: "bg-orange-100 text-orange-800" },
  formula_sheet: { label: "Formula Sheet", color: "bg-pink-100 text-pink-800" },
};

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
}

interface Note {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  noteType: string;
  subject: Subject | null;
  topic: Topic | null;
  year: number | null;
  isPremium: boolean;
  isPublished: boolean;
  downloadCount: number;
  uploader: User | null;
  createdAt: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function AdminNotesPage() {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const { data, loading, refetch } = useQuery(GET_ADMIN_NOTES, {
    variables: { limit: 100 },
  });

  const [deleteNote, { loading: deleting }] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted.",
      });
      setShowDeleteDialog(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [publishNote] = useMutation(PUBLISH_NOTE, {
    onCompleted: () => {
      toast({
        title: "Note published",
        description: "The note is now visible to users.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (note: Note) => {
    setSelectedNote(note);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedNote) {
      deleteNote({ variables: { id: selectedNote.id } });
    }
  };

  const handlePublish = (note: Note) => {
    publishNote({ variables: { id: note.id } });
  };

  const notes: Note[] = data?.notes || [];

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      note.subject?.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns: Column<Note>[] = [
    {
      key: "note",
      header: "Note",
      cell: (note) => (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{note.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {note.description || "No description"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (note) => {
        const typeInfo = NOTE_TYPE_LABELS[note.noteType] || { label: note.noteType, color: "bg-gray-100 text-gray-800" };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        );
      },
    },
    {
      key: "subject",
      header: "Subject",
      cell: (note) => (
        <div className="text-sm">
          <p className="font-medium">{note.subject?.name || "-"}</p>
          {note.topic && (
            <p className="text-xs text-muted-foreground">{note.topic.name}</p>
          )}
        </div>
      ),
    },
    {
      key: "file",
      header: "File",
      cell: (note) => (
        <div className="text-sm">
          <p className="text-muted-foreground truncate max-w-[150px]" title={note.fileName}>
            {note.fileName}
          </p>
          <p className="text-xs text-muted-foreground">{formatFileSize(note.fileSize)}</p>
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
      cell: (note) => note.year || "-",
    },
    {
      key: "downloads",
      header: "Downloads",
      cell: (note) => (
        <div className="flex items-center gap-1 text-sm">
          <Download className="w-3 h-3 text-muted-foreground" />
          {note.downloadCount}
        </div>
      ),
    },
    {
      key: "premium",
      header: "Access",
      cell: (note) => (
        <Badge variant={note.isPremium ? "default" : "secondary"}>
          {note.isPremium ? "Premium" : "Free"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (note) => <StatusBadge status={note.isPublished} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      cell: (note) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/notes/${note.id}`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </a>
            </DropdownMenuItem>
            {!note.isPublished && (
              <DropdownMenuItem onClick={() => handlePublish(note)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(note)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Notes & Study Materials
          </Title>
          <Paragraph className="text-muted-foreground">
            Upload and manage notes, question papers, and study materials
          </Paragraph>
        </div>
        <Link href="/admin/notes/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Note
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-sm text-muted-foreground">Total Notes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {notes.filter((n) => n.isPublished).length}
            </div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {notes.filter((n) => n.noteType === "question_paper").length}
            </div>
            <p className="text-sm text-muted-foreground">Question Papers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {notes.reduce((sum, n) => sum + n.downloadCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={filteredNotes}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search notes by title or subject..."
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            emptyMessage="No notes found. Upload your first note!"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Note"
        description={`Are you sure you want to delete "${selectedNote?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  );
}
