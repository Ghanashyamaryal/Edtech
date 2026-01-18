'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Star,
  Clock,
  FileText,
  Folder,
  ChevronRight,
  Filter,
  BookMarked,
  Sparkles,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

// Subject categories with notes
const subjects = [
  {
    id: 1,
    name: 'Mathematics',
    icon: '📐',
    noteCount: 45,
    color: 'primary',
    description: 'Calculus, Algebra, Statistics & more',
  },
  {
    id: 2,
    name: 'Computer Science',
    icon: '💻',
    noteCount: 52,
    color: 'secondary',
    description: 'Programming, Data Structures, OS',
  },
  {
    id: 3,
    name: 'English',
    icon: '📝',
    noteCount: 28,
    color: 'gold',
    description: 'Grammar, Comprehension, Writing',
  },
  {
    id: 4,
    name: 'Physics',
    icon: '⚛️',
    noteCount: 38,
    color: 'primary',
    description: 'Mechanics, Optics, Electricity',
  },
  {
    id: 5,
    name: 'Logical Reasoning',
    icon: '🧠',
    noteCount: 32,
    color: 'secondary',
    description: 'Puzzles, Patterns, Aptitude',
  },
  {
    id: 6,
    name: 'General Knowledge',
    icon: '🌍',
    noteCount: 25,
    color: 'gold',
    description: 'Current Affairs, History, Geography',
  },
];

// Featured notes
const featuredNotes = [
  {
    id: 1,
    title: 'Complete Mathematics Formula Sheet',
    subject: 'Mathematics',
    author: 'Dr. Ramesh Sharma',
    pages: 45,
    downloads: 12500,
    rating: 4.9,
    isFree: true,
    isNew: true,
  },
  {
    id: 2,
    title: 'Data Structures & Algorithms Handbook',
    subject: 'Computer Science',
    author: 'Prof. Sita Devi',
    pages: 120,
    downloads: 8900,
    rating: 4.8,
    isFree: false,
    isNew: false,
  },
  {
    id: 3,
    title: 'English Grammar Comprehensive Guide',
    subject: 'English',
    author: 'Mr. John Thapa',
    pages: 68,
    downloads: 7500,
    rating: 4.7,
    isFree: true,
    isNew: false,
  },
  {
    id: 4,
    title: 'Physics Problem Solving Techniques',
    subject: 'Physics',
    author: 'Dr. Anita Gurung',
    pages: 85,
    downloads: 6200,
    rating: 4.9,
    isFree: false,
    isNew: true,
  },
];

// Recent uploads
const recentNotes = [
  {
    id: 1,
    title: 'Probability & Statistics Notes',
    subject: 'Mathematics',
    uploadedAt: '2 hours ago',
    pages: 32,
  },
  {
    id: 2,
    title: 'Operating System Concepts',
    subject: 'Computer Science',
    uploadedAt: '5 hours ago',
    pages: 48,
  },
  {
    id: 3,
    title: 'Verbal Reasoning Shortcuts',
    subject: 'Logical Reasoning',
    uploadedAt: '1 day ago',
    pages: 25,
  },
  {
    id: 4,
    title: 'Current Affairs Jan 2026',
    subject: 'General Knowledge',
    uploadedAt: '2 days ago',
    pages: 18,
  },
];

export default function NotesPage() {
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/notes/${subject.name.toLowerCase().replace(' ', '-')}`}>
                  <Card className="h-full hover:shadow-medium hover:border-primary/30 transition-all cursor-pointer group">
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl mb-3">{subject.icon}</div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {subject.noteCount} Notes
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {subject.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
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
                        {note.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        {note.isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                            New
                          </span>
                        )}
                        {!note.isFree && (
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
                    <p className="text-sm text-muted-foreground mb-4">
                      By {note.author}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookMarked className="w-4 h-4" />
                        {note.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        {note.rating}
                      </span>
                    </div>

                    {/* Downloads and actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {note.downloads.toLocaleString()} downloads
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="Preview">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
                              <span>{note.subject}</span>
                              <span>•</span>
                              <span>{note.pages} pages</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {note.uploadedAt}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
                      Get access to 200+ premium notes, formula sheets, and exclusive
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
