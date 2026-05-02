'use client';

import * as React from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  FileText,
  BookMarked,
  Lock,
  Clock,
} from 'lucide-react';
import { getNotesBySubject, incrementNoteDownload, type Note } from '@/actions/notes';
import { getSubject, type Subject } from '@/actions/subjects';

const NOTE_TYPE_LABELS: Record<string, string> = {
  notes: 'Notes',
  question_paper: 'Question Paper',
  solution: 'Solution',
  syllabus: 'Syllabus',
  formula_sheet: 'Formula Sheet',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

export default function SubjectNotesPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  const [subject, setSubject] = React.useState<Subject | null>(null);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFoundFlag, setNotFoundFlag] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [subjectResult, notesResult] = await Promise.all([
        getSubject(subjectId),
        getNotesBySubject(subjectId),
      ]);

      if (!subjectResult.success) {
        setNotFoundFlag(true);
        setIsLoading(false);
        return;
      }

      setSubject(subjectResult.data);
      if (notesResult.success) {
        setNotes(notesResult.data.filter((n) => n.isPublished));
      }
      setIsLoading(false);
    }
    if (subjectId) load();
  }, [subjectId]);

  React.useEffect(() => {
    if (notFoundFlag) notFound();
  }, [notFoundFlag]);

  const handleDownload = async (note: Note) => {
    await incrementNoteDownload(note.id);
    window.open(note.fileUrl, '_blank');
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, downloadCount: n.downloadCount + 1 } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-10 lg:py-12">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <Button
            variant="ghost"
            className="gap-2 mb-6"
            onClick={() => router.push('/notes')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all subjects
          </Button>

          <div className="flex items-start gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {isLoading ? 'Loading…' : subject?.name || 'Subject'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isLoading
                  ? ''
                  : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'} available`}
              </p>
              {subject?.description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  {subject.description}
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse mb-4" />
                    <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse mb-4" />
                    <div className="h-5 w-full bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-medium hover:-translate-y-1 transition-all group">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {subject?.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            {NOTE_TYPE_LABELS[note.noteType] || note.noteType}
                          </span>
                          {note.isPremium && (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>

                      <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {note.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookMarked className="w-4 h-4" />
                          {formatFileSize(note.fileSize)}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          {getRelativeTime(note.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {note.downloadCount.toLocaleString()} downloads
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={note.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="icon" title="Preview">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Download"
                            onClick={() => handleDownload(note)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  No notes available for this subject yet.
                </p>
                <Link href="/notes">
                  <Button variant="outline">Browse other subjects</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
