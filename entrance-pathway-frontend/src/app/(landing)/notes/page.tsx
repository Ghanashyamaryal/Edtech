'use client';

import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Clock,
  FileText,
  ChevronRight,
  Filter,
  BookMarked,
  Sparkles,
  Lock,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { GET_SUBJECTS_WITH_NOTES, GET_LANDING_NOTES } from '@/graphql/queries/notes';
import { INCREMENT_NOTE_DOWNLOAD } from '@/graphql/mutations/notes';
import { useState } from 'react';

// Types
interface Subject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  topicsCount: number;
  questionsCount: number;
  notesCount: number;
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
  subject: { id: string; name: string; icon: string | null } | null;
  year: number | null;
  isPremium: boolean;
  downloadCount: number;
  createdAt: string;
}

const NOTE_TYPE_LABELS: Record<string, string> = {
  notes: 'Notes',
  question_paper: 'Question Paper',
  solution: 'Solution',
  syllabus: 'Syllabus',
  formula_sheet: 'Formula Sheet',
};

// Default icons for subjects without custom icons
const DEFAULT_SUBJECT_ICONS: Record<string, string> = {
  'mathematics': '📐',
  'physics': '⚛️',
  'chemistry': '🧪',
  'biology': '🧬',
  'english': '📝',
  'computer science': '💻',
  'computer': '💻',
  'logical reasoning': '🧠',
  'general knowledge': '🌍',
  'gk': '🌍',
  'nepali': '🇳🇵',
  'economics': '📊',
  'accountancy': '📒',
  'default': '📚',
};

function getSubjectIcon(name: string, icon: string | null): string {
  if (icon) return icon;
  const normalizedName = name.toLowerCase();
  return DEFAULT_SUBJECT_ICONS[normalizedName] || DEFAULT_SUBJECT_ICONS['default'];
}

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

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch subjects with notes count
  const { data: subjectsData, loading: loadingSubjects } = useQuery(GET_SUBJECTS_WITH_NOTES);
  const subjects: Subject[] = subjectsData?.subjects?.filter((s: Subject) => s.notesCount > 0) || [];

  // Fetch recent/featured notes
  const { data: notesData, loading: loadingNotes, refetch } = useQuery(GET_LANDING_NOTES, {
    variables: { limit: 20 },
  });
  const allNotes: Note[] = notesData?.notes || [];

  // Featured notes (most downloaded)
  const featuredNotes = [...allNotes]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 4);

  // Recent notes
  const recentNotes = [...allNotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Increment download count
  const [incrementDownload] = useMutation(INCREMENT_NOTE_DOWNLOAD);

  const handleDownload = async (note: Note) => {
    await incrementDownload({ variables: { id: note.id } });
    // Open file in new tab
    window.open(note.fileUrl, '_blank');
    refetch();
  };

  const isLoading = loadingSubjects || loadingNotes;

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Study Materials
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Comprehensive <span className="text-gradient-primary">Study Notes</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Access well-structured notes, formula sheets, and study materials prepared
              by expert educators to boost your preparation.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search notes by topic or subject..."
                  className="pl-12 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="gap-2">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Browse by Subject
              </h2>
              <p className="text-muted-foreground mt-1">
                Find notes organized by subject for easy access
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              All Subjects
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse mx-auto mb-3" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto mb-2" />
                    <div className="h-3 w-16 bg-muted rounded animate-pulse mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : subjects.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/notes/subject/${subject.id}`}>
                    <Card className="h-full hover:shadow-medium hover:border-primary/30 transition-all cursor-pointer group">
                      <CardContent className="pt-6 text-center">
                        <div className="text-4xl mb-3">
                          {getSubjectIcon(subject.name, subject.icon)}
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-1">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {subject.notesCount} Notes
                        </p>
                        {subject.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {subject.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No subjects with notes available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Notes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4" />
                Featured
              </span>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Most Popular Notes
              </h2>
            </div>
            <Link href="/notes/all">
              <Button variant="ghost" className="gap-2">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="pt-6">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse mb-4" />
                    <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse mb-4" />
                    <div className="h-5 w-full bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredNotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-strong transition-all hover:-translate-y-1 group">
                    <CardContent className="pt-6">
                      {/* Header badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {note.subject?.name || 'General'}
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

                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>

                      {/* Content */}
                      <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                        {note.title}
                      </h3>
                      {note.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {note.description}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookMarked className="w-4 h-4" />
                          {formatFileSize(note.fileSize)}
                        </span>
                        {note.year && (
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                            {note.year}
                          </span>
                        )}
                      </div>

                      {/* Downloads and actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {note.downloadCount.toLocaleString()} downloads
                        </span>
                        <div className="flex items-center gap-2">
                          <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">No notes available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Uploads */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Notes List */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Recently Uploaded
              </h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <Card key={index}>
                      <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                          <div className="flex-1">
                            <div className="h-5 w-48 bg-muted rounded animate-pulse mb-2" />
                            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recentNotes.length > 0 ? (
                <div className="space-y-4">
                  {recentNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-medium transition-shadow">
                        <CardContent className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {note.title}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span>{note.subject?.name || 'General'}</span>
                                <span>•</span>
                                <span>{formatFileSize(note.fileSize)}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {getRelativeTime(note.createdAt)}
                                </span>
                              </div>
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No recent notes available.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Premium Notes Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      Unlock All Notes
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Get access to premium notes, formula sheets, and exclusive
                      study materials.
                    </p>
                    <ul className="text-sm text-left space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-secondary" />
                        </div>
                        <span>All subject notes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-secondary" />
                        </div>
                        <span>Downloadable PDFs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-secondary" />
                        </div>
                        <span>Regular updates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                          <ChevronRight className="w-3 h-3 text-secondary" />
                        </div>
                        <span>Expert-curated content</span>
                      </li>
                    </ul>
                    <Link href="/pricing">
                      <Button className="w-full">Get Premium Access</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Request Notes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Can&apos;t Find What You Need?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Request specific notes or topics and our expert educators will create
                  them for you.
                </p>
                <Button variant="outline" className="gap-2">
                  Request Notes
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
