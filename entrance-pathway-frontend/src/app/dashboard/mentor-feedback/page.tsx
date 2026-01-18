'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import {
  MessageSquare,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Star,
} from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';

// Mock data - replace with real API data
const mentors = [
  {
    id: 1,
    name: 'Dr. Ramesh Sharma',
    subject: 'Physics',
    avatar: null,
    rating: 4.9,
    responseTime: '~2 hours',
  },
  {
    id: 2,
    name: 'Prof. Sita Devi',
    subject: 'Chemistry',
    avatar: null,
    rating: 4.8,
    responseTime: '~4 hours',
  },
];

const feedbackHistory = [
  {
    id: 1,
    mentor: 'Dr. Ramesh Sharma',
    subject: 'Physics',
    topic: 'Electromagnetic Waves Assignment',
    feedback:
      'Great work on understanding the concepts! Focus more on the mathematical derivations. Your diagrams are excellent.',
    date: '2 days ago',
    status: 'completed',
    rating: 5,
  },
  {
    id: 2,
    mentor: 'Prof. Sita Devi',
    subject: 'Chemistry',
    topic: 'Organic Chemistry Lab Report',
    feedback:
      'Good analysis of the reaction mechanisms. Consider adding more details about the yield calculations in future reports.',
    date: '5 days ago',
    status: 'completed',
    rating: 4,
  },
  {
    id: 3,
    mentor: 'Dr. Ramesh Sharma',
    subject: 'Physics',
    topic: 'Mock Test Performance Review',
    feedback: null,
    date: 'Submitted yesterday',
    status: 'pending',
    rating: null,
  },
];

const pendingRequests = [
  {
    id: 1,
    topic: 'Help with Calculus Integration',
    mentor: 'Mr. Binod Thapa',
    submittedAt: '3 hours ago',
  },
];

export default function MentorFeedbackPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mentor Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Get personalized guidance from expert mentors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Total Feedbacks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Clock className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Request Feedback */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request New Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Select Mentor
                </label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground">
                  <option value="">Choose a mentor...</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Physics Assignment - Chapter 5"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Your Question or Submission
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what you need help with or attach your work for review..."
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Attachments (optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or{' '}
                    <span className="text-primary cursor-pointer">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, or images up to 10MB
                  </p>
                </div>
              </div>

              <Button className="w-full gap-2">
                <Send className="w-4 h-4" />
                Submit for Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Your Mentors */}
        <Card>
          <CardHeader>
            <CardTitle>Your Mentors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border"
              >
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden bg-primary">
                  <Avatar.Image src={mentor.avatar || undefined} alt={mentor.name} />
                  <Avatar.Fallback className="flex items-center justify-center w-full h-full text-sm font-medium text-primary-foreground bg-primary">
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground">{mentor.subject}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gold">
                    <Star className="w-4 h-4 fill-gold" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{mentor.responseTime}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackHistory.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border ${
                  item.status === 'pending'
                    ? 'border-gold/50 bg-gold/5'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{item.topic}</h3>
                      {item.status === 'pending' ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gold/20 text-gold">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-secondary/20 text-secondary">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.mentor} • {item.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    {item.rating && (
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < item.rating ? 'text-gold fill-gold' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {item.feedback ? (
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-sm text-foreground">{item.feedback}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Awaiting mentor response...
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
