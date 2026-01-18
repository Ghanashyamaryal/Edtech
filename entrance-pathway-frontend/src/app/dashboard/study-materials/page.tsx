'use client';

import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import {
  BookOpen,
  FileText,
  Download,
  Eye,
  Search,
  Folder,
  File,
  Star,
} from 'lucide-react';

// Mock data - replace with real API data
const subjects = [
  { id: 1, name: 'Physics', materialCount: 24, icon: '⚛️' },
  { id: 2, name: 'Chemistry', materialCount: 32, icon: '🧪' },
  { id: 3, name: 'Mathematics', materialCount: 28, icon: '📐' },
  { id: 4, name: 'Biology', materialCount: 21, icon: '🧬' },
];

const recentMaterials = [
  {
    id: 1,
    title: 'Physics Formula Sheet',
    subject: 'Physics',
    type: 'PDF',
    size: '2.4 MB',
    downloads: 1234,
    starred: true,
  },
  {
    id: 2,
    title: 'Organic Chemistry Notes',
    subject: 'Chemistry',
    type: 'PDF',
    size: '5.1 MB',
    downloads: 892,
    starred: false,
  },
  {
    id: 3,
    title: 'Calculus Problem Set',
    subject: 'Mathematics',
    type: 'PDF',
    size: '1.8 MB',
    downloads: 567,
    starred: true,
  },
  {
    id: 4,
    title: 'Human Anatomy Diagrams',
    subject: 'Biology',
    type: 'PDF',
    size: '8.2 MB',
    downloads: 2341,
    starred: false,
  },
  {
    id: 5,
    title: 'Previous Year Questions 2025',
    subject: 'All Subjects',
    type: 'PDF',
    size: '12.5 MB',
    downloads: 4521,
    starred: true,
  },
];

export default function StudyMaterialsPage() {
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
        <Input placeholder="Search materials..." className="pl-10" />
      </div>

      {/* Subject Folders */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Subject</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="cursor-pointer hover:border-primary/30 transition-colors group"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-3 group-hover:bg-primary/20 transition-colors">
                    {subject.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {subject.materialCount} materials
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent & Popular Materials */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent & Popular Materials
        </h2>
        <div className="space-y-3">
          {recentMaterials.map((material) => (
            <Card key={material.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <FileText className="w-6 h-6 text-destructive" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">
                        {material.title}
                      </h3>
                      {material.starred && (
                        <Star className="w-4 h-4 text-gold fill-gold flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span>{material.subject}</span>
                      <span>•</span>
                      <span>{material.type}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="w-4 h-4" />
                    <span>{material.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Preview">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Materials</Button>
      </div>
    </div>
  );
}
