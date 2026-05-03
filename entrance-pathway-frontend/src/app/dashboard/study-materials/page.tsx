'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import {
  FileText,
  Download,
  Search,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { getNotes, getCourseSubjects, incrementNoteDownload, getNoteDownloadUrl, type Note, type Subject } from '@/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useActiveCourse } from '@/context';

export default function StudyMaterialsPage() {
  const { activeCourse, loading: activeCourseLoading } = useActiveCourse();
  const router = useRouter();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courseSubjectIds, setCourseSubjectIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Load the course's subjects once
  useEffect(() => {
    if (activeCourseLoading) return;
    if (!activeCourse?.id) {
      setSubjects([]);
      setCourseSubjectIds([]);
      return;
    }
    async function loadSubjects() {
      const result = await getCourseSubjects(activeCourse!.id);
      if (result.success) {
        const subjectList = result.data
          .map((cs) => cs.subject)
          .filter((s): s is Subject => Boolean(s));
        setSubjects(subjectList);
        setCourseSubjectIds(subjectList.map((s) => s.id));
      }
    }
    loadSubjects();
  }, [activeCourse?.id, activeCourseLoading]);

  const loadData = useCallback(async () => {
    if (activeCourseLoading) return;
    if (!activeCourse?.id) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const notesResult = await getNotes({
      isPublished: true,
      subjectId: selectedSubject || undefined,
      subjectIds: selectedSubject ? undefined : courseSubjectIds,
      limit: 50,
    });

    if (notesResult.success) setNotes(notesResult.data);
    setLoading(false);
  }, [activeCourse?.id, activeCourseLoading, selectedSubject, courseSubjectIds]);

  useEffect(() => {
    // Wait until subject IDs are populated before fetching notes (avoids unscoped pull)
    if (selectedSubject || courseSubjectIds.length > 0) {
      loadData();
    } else if (!activeCourseLoading && !activeCourse?.id) {
      setLoading(false);
    }
  }, [loadData, selectedSubject, courseSubjectIds, activeCourseLoading, activeCourse?.id]);

  const handleDownload = async (note: Note) => {
    const result = await getNoteDownloadUrl(note.id);
    if (!result.success) {
      if (note.isPremium) {
        toast({
          title: 'Premium required',
          description: 'Get premium access to download this note.',
        });
        router.push('/pricing');
        return;
      }
      toast({
        title: 'Download failed',
        description: result.error || 'Could not get the download link.',
        variant: 'destructive',
      });
      return;
    }
    await incrementNoteDownload(note.id);
    window.open(result.data.url, '_blank');
    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id ? { ...n, downloadCount: n.downloadCount + 1 } : n
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter by search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
      note.subject?.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Study Materials</h1>
        <p className="text-muted-foreground mt-1">
          Access notes, PDFs, and study resources
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Subject Folders */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Subject</h2>
        {subjects.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className={`cursor-pointer transition-colors group ${
                selectedSubject === null
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/30'
              }`}
              onClick={() => setSelectedSubject(null)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-3 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">All Subjects</h3>
                  <p className="text-sm text-muted-foreground">
                    {notes.length} materials
                  </p>
                </div>
              </CardContent>
            </Card>
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-colors group ${
                  selectedSubject === subject.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-3 group-hover:bg-primary/20 transition-colors">
                      {subject.icon || <BookOpen className="w-6 h-6 text-primary" />}
                    </div>
                    <h3 className="font-semibold text-foreground">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subject.notesCount || 0} materials
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-muted animate-pulse mb-3" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No subjects found</p>
        )}
      </div>

      {/* Materials List */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {selectedSubject
            ? `${subjects.find((s) => s.id === selectedSubject)?.name || ''} Materials`
            : 'All Materials'}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading materials...</span>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="p-3 rounded-lg bg-destructive/10 shrink-0 self-start">
                      <FileText className="w-6 h-6 text-destructive" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          {note.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                        {note.subject && <span>{note.subject.name}</span>}
                        <span>{note.fileType?.toUpperCase() || 'PDF'}</span>
                        <span>{formatFileSize(note.fileSize)}</span>
                        {note.year && <span>Year: {note.year}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Download className="w-4 h-4" />
                        <span>{note.downloadCount.toLocaleString()}</span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDownload(note)}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              {searchValue ? 'No materials match your search' : 'No materials available yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
