'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Video, Calendar, Clock, Users, Play, Loader2, AlertCircle } from 'lucide-react';
import { getLiveNowClasses, getUpcomingLiveClasses, type LiveClass } from '@/actions';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes} min`;
}

export default function LiveClassesPage() {
  const [liveClasses, setLiveClasses] = React.useState<LiveClass[]>([]);
  const [upcomingClasses, setUpcomingClasses] = React.useState<LiveClass[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadClasses() {
      setLoading(true);
      const [liveResult, upcomingResult] = await Promise.all([
        getLiveNowClasses(),
        getUpcomingLiveClasses(),
      ]);

      if (liveResult.success) setLiveClasses(liveResult.data);
      if (upcomingResult.success) setUpcomingClasses(upcomingResult.data);
      setLoading(false);
    }
    loadClasses();
  }, []);

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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Live Classes</h1>
        <p className="text-muted-foreground mt-1">
          Join interactive live sessions with expert instructors
        </p>
      </div>

      {/* Live Now Section */}
      {liveClasses.length > 0 ? (
        liveClasses.map((liveClass) => (
          <Card key={liveClass.id} className="border-2 border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
                <CardTitle className="text-lg text-destructive">Live Now</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{liveClass.title}</h3>
                  {liveClass.instructor && (
                    <p className="text-muted-foreground mt-1">{liveClass.instructor.fullName}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Started at {formatTime(liveClass.scheduledAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(liveClass.durationMinutes)}
                    </span>
                  </div>
                </div>
                {liveClass.meetingUrl ? (
                  <a href={liveClass.meetingUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Join Now
                    </Button>
                  </a>
                ) : (
                  <Button size="lg" className="gap-2" disabled>
                    <Play className="w-5 h-5" />
                    No Link Available
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border border-border">
          <CardContent className="py-8 text-center">
            <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No classes are live right now</p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Classes */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Classes</h2>
        {upcomingClasses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {classItem.title}
                      </h3>
                      {classItem.instructor && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {classItem.instructor.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(classItem.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(classItem.scheduledAt)} ({formatDuration(classItem.durationMinutes)})
                      </span>
                    </div>
                    {classItem.maxStudents && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Max {classItem.maxStudents} students</span>
                      </div>
                    )}
                    {classItem.course && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs">
                          {classItem.course.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {classItem.meetingUrl ? (
                    <a href={classItem.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        Join When Live
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Link Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No upcoming classes scheduled. Check back soon!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
