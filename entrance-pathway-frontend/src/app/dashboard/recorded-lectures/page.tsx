'use client';

import * as React from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui';
import { PlayCircle, Clock, Search, Loader2, Video, Eye, X } from 'lucide-react';
import {
  getPublishedLectures,
  getCourseSubjects,
  incrementLectureView,
  type RecordedLecture,
  type Subject,
} from '@/actions';
import { extractYouTubeId, getYouTubeThumbnail } from '@/utils/youtube';
import { useActiveCourse } from '@/context';

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

function formatDuration(minutes?: number): string {
  if (!minutes) return '';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

export default function RecordedLecturesPage() {
  const { activeCourse, loading: activeCourseLoading } = useActiveCourse();
  const [lectures, setLectures] = React.useState<RecordedLecture[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState<string | null>(null);
  const [playingLecture, setPlayingLecture] = React.useState<RecordedLecture | null>(null);

  // Load data
  React.useEffect(() => {
    if (activeCourseLoading) return;
    if (!activeCourse?.id) {
      setLectures([]);
      setSubjects([]);
      setLoading(false);
      return;
    }
    async function loadData() {
      setLoading(true);
      const [lecturesResult, courseSubjectsResult] = await Promise.all([
        getPublishedLectures({ courseId: activeCourse!.id }),
        getCourseSubjects(activeCourse!.id),
      ]);

      if (lecturesResult.success) setLectures(lecturesResult.data);
      if (courseSubjectsResult.success) {
        setSubjects(
          courseSubjectsResult.data
            .map((cs) => cs.subject)
            .filter((s): s is Subject => Boolean(s))
        );
      }
      setLoading(false);
    }
    loadData();
  }, [activeCourse?.id, activeCourseLoading]);

  // Reload on filter change (debounced)
  React.useEffect(() => {
    if (activeCourseLoading || !activeCourse?.id) return;
    async function filterLectures() {
      const result = await getPublishedLectures({
        courseId: activeCourse!.id,
        subjectId: selectedSubject || undefined,
        search: search || undefined,
      });
      if (result.success) setLectures(result.data);
    }

    const debounce = setTimeout(filterLectures, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedSubject, activeCourse?.id, activeCourseLoading]);

  function handlePlayLecture(lecture: RecordedLecture) {
    setPlayingLecture(lecture);
    incrementLectureView(lecture.id);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

      {/* Video Player Modal */}
      {playingLecture && (
        <Card className="border-2 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground truncate mr-4">
                {playingLecture.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPlayingLecture(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {extractYouTubeId(playingLecture.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(playingLecture.videoUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={playingLecture.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
            {playingLecture.description && (
              <p className="text-sm text-muted-foreground mt-3">
                {playingLecture.description}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lectures..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedSubject === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSubject(null)}
          >
            All
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant={selectedSubject === subject.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject(subject.id)}
            >
              {subject.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {lectures.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lectures.map((lecture) => {
            const thumbnail = lecture.thumbnailUrl || getYouTubeThumbnail(lecture.videoUrl);

            return (
              <Card
                key={lecture.id}
                className="overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer"
                onClick={() => handlePlayLecture(lecture)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 rounded-full bg-primary/90">
                      <PlayCircle className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  {lecture.durationMinutes && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">
                      {formatDuration(lecture.durationMinutes)}
                    </div>
                  )}
                  {lecture.subject && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary/90 text-primary-foreground text-xs font-medium">
                      {lecture.subject.name}
                    </div>
                  )}
                </div>

                <CardContent className="pt-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                    {lecture.title}
                  </h3>
                  {lecture.instructor && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {lecture.instructor.fullName}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {lecture.viewCount.toLocaleString()} views
                    </span>
                    <span>{getRelativeTime(lecture.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {search || selectedSubject
                ? 'No lectures found matching your filters'
                : 'No recorded lectures available yet. Check back soon!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
