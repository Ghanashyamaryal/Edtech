'use client';

import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { PlayCircle, Clock, BookOpen, Filter, Search } from 'lucide-react';

// Mock data - replace with real API data
const lectures = [
  {
    id: 1,
    title: 'Introduction to Quantum Mechanics',
    subject: 'Physics',
    instructor: 'Dr. Ramesh Sharma',
    duration: '45 min',
    thumbnail: '/thumbnails/physics-1.jpg',
    views: 1234,
    uploadedAt: '2 days ago',
  },
  {
    id: 2,
    title: 'Chemical Bonding - Part 1',
    subject: 'Chemistry',
    instructor: 'Prof. Sita Devi',
    duration: '38 min',
    thumbnail: '/thumbnails/chemistry-1.jpg',
    views: 892,
    uploadedAt: '3 days ago',
  },
  {
    id: 3,
    title: 'Differential Equations Basics',
    subject: 'Mathematics',
    instructor: 'Mr. Binod Thapa',
    duration: '52 min',
    thumbnail: '/thumbnails/math-1.jpg',
    views: 2156,
    uploadedAt: '5 days ago',
  },
  {
    id: 4,
    title: 'Cell Biology: Introduction',
    subject: 'Biology',
    instructor: 'Dr. Anita Gurung',
    duration: '41 min',
    thumbnail: '/thumbnails/biology-1.jpg',
    views: 1567,
    uploadedAt: '1 week ago',
  },
  {
    id: 5,
    title: 'Thermodynamics Fundamentals',
    subject: 'Physics',
    instructor: 'Dr. Ramesh Sharma',
    duration: '55 min',
    thumbnail: '/thumbnails/physics-2.jpg',
    views: 987,
    uploadedAt: '1 week ago',
  },
  {
    id: 6,
    title: 'Organic Chemistry: Alkanes',
    subject: 'Chemistry',
    instructor: 'Prof. Sita Devi',
    duration: '48 min',
    thumbnail: '/thumbnails/chemistry-2.jpg',
    views: 756,
    uploadedAt: '2 weeks ago',
  },
];

const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

export default function RecordedLecturesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Recorded Lectures
        </h1>
        <p className="text-muted-foreground mt-1">
          Watch video lessons at your own pace
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lectures..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {subjects.map((subject) => (
            <Button
              key={subject}
              variant={subject === 'All' ? 'default' : 'outline'}
              size="sm"
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lectures.map((lecture) => (
          <Card
            key={lecture.id}
            className="overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 rounded-full bg-primary/90">
                  <PlayCircle className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                {lecture.duration}
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary/90 text-primary-foreground text-xs font-medium">
                {lecture.subject}
              </div>
            </div>

            <CardContent className="pt-4">
              <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                {lecture.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {lecture.instructor}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{lecture.views.toLocaleString()} views</span>
                <span>{lecture.uploadedAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
