'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Mock data - replace with real API data
const availableTests = [
  {
    id: 1,
    title: 'Full Model Test - Set A',
    description: 'Complete entrance exam simulation',
    questions: 200,
    duration: '3 hours',
    difficulty: 'Hard',
    category: 'Full Test',
  },
  {
    id: 2,
    title: 'Physics Unit Test: Mechanics',
    description: 'Test your understanding of mechanics concepts',
    questions: 50,
    duration: '45 min',
    difficulty: 'Medium',
    category: 'Subject',
  },
  {
    id: 3,
    title: 'Chemistry Quick Quiz',
    description: 'Quick revision of organic chemistry',
    questions: 25,
    duration: '20 min',
    difficulty: 'Easy',
    category: 'Quick Quiz',
  },
  {
    id: 4,
    title: 'Biology Chapter Test: Genetics',
    description: 'Comprehensive genetics assessment',
    questions: 40,
    duration: '40 min',
    difficulty: 'Medium',
    category: 'Subject',
  },
];

const completedTests = [
  {
    id: 101,
    title: 'Full Model Test - Set B',
    completedAt: '2 days ago',
    score: 156,
    totalScore: 200,
    percentage: 78,
    rank: 45,
    totalParticipants: 234,
  },
  {
    id: 102,
    title: 'Mathematics Unit Test',
    completedAt: '1 week ago',
    score: 42,
    totalScore: 50,
    percentage: 84,
    rank: 12,
    totalParticipants: 189,
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-secondary bg-secondary/10';
    case 'medium':
      return 'text-gold bg-gold/10';
    case 'hard':
      return 'text-destructive bg-destructive/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
}

export default function MockTestsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mock Tests</h1>
        <p className="text-muted-foreground mt-1">
          Practice with exam-style questions and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Tests Taken</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">76%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <Trophy className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">#23</p>
                <p className="text-xs text-muted-foreground">Best Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">18h</p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tests */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Tests</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {availableTests.map((test) => (
            <Card key={test.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-muted text-muted-foreground">
                        {test.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(
                          test.difficulty
                        )}`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{test.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {test.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {test.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration}
                  </span>
                </div>

                <Button className="w-full gap-2">
                  Start Test
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Results</h2>
        <div className="space-y-3">
          {completedTests.map((test) => (
            <Card key={test.id}>
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        test.percentage >= 70
                          ? 'bg-secondary/10'
                          : 'bg-destructive/10'
                      }`}
                    >
                      {test.percentage >= 70 ? (
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{test.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed {test.completedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">
                        {test.score}/{test.totalScore}
                      </p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-lg font-bold ${
                          test.percentage >= 70 ? 'text-secondary' : 'text-destructive'
                        }`}
                      >
                        {test.percentage}%
                      </p>
                      <p className="text-xs text-muted-foreground">Percentage</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gold">#{test.rank}</p>
                      <p className="text-xs text-muted-foreground">
                        of {test.totalParticipants}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
