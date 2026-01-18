'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Video, Calendar, Clock, Users, Play } from 'lucide-react';

// Mock data - replace with real API data
const upcomingClasses = [
  {
    id: 1,
    title: 'Physics: Electromagnetic Waves',
    instructor: 'Dr. Ramesh Sharma',
    date: '2026-01-19',
    time: '10:00 AM',
    duration: '90 min',
    students: 45,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Chemistry: Organic Reactions',
    instructor: 'Prof. Sita Devi',
    date: '2026-01-19',
    time: '2:00 PM',
    duration: '60 min',
    students: 38,
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Mathematics: Calculus Integration',
    instructor: 'Mr. Binod Thapa',
    date: '2026-01-20',
    time: '11:00 AM',
    duration: '90 min',
    students: 52,
    status: 'upcoming',
  },
];

const liveNow = {
  id: 0,
  title: 'Biology: Cell Division & Mitosis',
  instructor: 'Dr. Anita Gurung',
  startedAt: '9:30 AM',
  duration: '90 min',
  students: 67,
};

export default function LiveClassesPage() {
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
      <Card className="border-2 border-destructive/50 bg-destructive/5">
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
              <h3 className="text-xl font-semibold text-foreground">{liveNow.title}</h3>
              <p className="text-muted-foreground mt-1">{liveNow.instructor}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Started at {liveNow.startedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {liveNow.students} students
                </span>
              </div>
            </div>
            <Button size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Join Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Classes */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Classes</h2>
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {classItem.instructor}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(classItem.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.time} ({classItem.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{classItem.students} enrolled</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
