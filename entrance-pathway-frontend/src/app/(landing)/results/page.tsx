'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  Trophy,
  Search,
  Star,
  Medal,
  Crown,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  ChevronRight,
  Award,
  Target,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for top performers
const topPerformers = [
  {
    rank: 1,
    name: 'Aarav Sharma',
    score: 198,
    total: 200,
    percentage: 99,
    course: 'BSc CSIT',
    college: 'TU',
    batch: '2025',
    image: null,
  },
  {
    rank: 2,
    name: 'Priya Thapa',
    score: 195,
    total: 200,
    percentage: 97.5,
    course: 'BSc CSIT',
    college: 'TU',
    batch: '2025',
    image: null,
  },
  {
    rank: 3,
    name: 'Bikash Gurung',
    score: 192,
    total: 200,
    percentage: 96,
    course: 'BIT',
    college: 'PU',
    batch: '2025',
    image: null,
  },
];

// Extended results list
const allResults = [
  { rank: 4, name: 'Sita Rai', score: 190, course: 'BCA', percentage: 95 },
  { rank: 5, name: 'Krishna Bhattarai', score: 188, course: 'BSc CSIT', percentage: 94 },
  { rank: 6, name: 'Anita Shrestha', score: 186, course: 'BIM', percentage: 93 },
  { rank: 7, name: 'Ramesh Poudel', score: 185, course: 'BIT', percentage: 92.5 },
  { rank: 8, name: 'Maya Karki', score: 183, course: 'BSc CSIT', percentage: 91.5 },
  { rank: 9, name: 'Sunil Adhikari', score: 181, course: 'BCA', percentage: 90.5 },
  { rank: 10, name: 'Gita Basnet', score: 180, course: 'BIM', percentage: 90 },
];

// Statistics
const stats = [
  { icon: Users, value: '2,456', label: 'Students Qualified', color: 'primary' },
  { icon: Trophy, value: '95%', label: 'Selection Rate', color: 'gold' },
  { icon: Target, value: '89%', label: 'Avg. Score', color: 'secondary' },
  { icon: Award, value: '156', label: 'Top 100 Ranks', color: 'primary' },
];

// Exam categories
const examCategories = [
  { name: 'All Exams', count: 2456 },
  { name: 'TU Entrance', count: 1245 },
  { name: 'PU Entrance', count: 678 },
  { name: 'KU Entrance', count: 345 },
  { name: 'PoU Entrance', count: 188 },
];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-gold" />;
    case 2:
      return <Medal className="w-6 h-6 text-muted-foreground" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-700" />;
    default:
      return null;
  }
}

function getRankBg(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-gold/20 to-gold/10 border-gold/30';
    case 2:
      return 'bg-gradient-to-r from-muted to-muted/50 border-muted-foreground/20';
    case 3:
      return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-200';
    default:
      return 'bg-card border-border';
  }
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Entrance Exam Results 2025
            </span>
            <Title className="font-display text-4xl md:text-5xl mb-4">
              Celebrating Our <span className="text-gradient-accent">Champions</span>
            </Title>
            <Paragraph className="text-lg mb-8">
              Proud moments of our students who achieved exceptional results in various
              entrance examinations across Nepal.
            </Paragraph>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  className="pl-12 h-12"
                />
              </div>
              <Button size="lg" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter Results
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`w-7 h-7 text-${stat.color}`} />
                  </div>
                  <Subtitle as="p" className="font-display text-3xl">
                    {stat.value}
                  </Subtitle>
                  <Small className="text-sm">{stat.label}</Small>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Filter by Exam</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {examCategories.map((category) => (
                    <button
                      key={category.name}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-left hover:bg-muted transition-colors"
                    >
                      <span className="font-medium text-foreground">
                        {category.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Results Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Top 3 Performers */}
              <div>
                <Subtitle as="h2" className="font-display text-2xl mb-6">
                  Top Performers
                </Subtitle>
                <div className="grid md:grid-cols-3 gap-6">
                  {topPerformers.map((performer, index) => (
                    <motion.div
                      key={performer.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`overflow-hidden ${getRankBg(performer.rank)} hover:shadow-strong transition-shadow`}
                      >
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="relative inline-block mb-4">
                              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-display text-2xl font-bold text-primary">
                                  {performer.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </span>
                              </div>
                              <div className="absolute -top-2 -right-2">
                                {getRankIcon(performer.rank)}
                              </div>
                            </div>
                            <Subtitle as="h3" className="font-display text-lg">
                              {performer.name}
                            </Subtitle>
                            <Small className="text-sm mb-4 block">
                              {performer.course} · {performer.college}
                            </Small>
                            <div className="p-4 rounded-xl bg-background/50">
                              <Subtitle as="p" className="text-3xl font-display text-primary">
                                {performer.percentage}%
                              </Subtitle>
                              <Small className="text-sm">
                                {performer.score}/{performer.total} marks
                              </Small>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2">
                              <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium">
                                Rank #{performer.rank}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Full Results Table */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <Subtitle as="h2" className="font-display text-2xl">
                    All Results
                  </Subtitle>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-border bg-muted/50">
                          <tr>
                            <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                              Rank
                            </th>
                            <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                              Student Name
                            </th>
                            <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                              Course
                            </th>
                            <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                              Score
                            </th>
                            <th className="text-left px-6 py-4 font-medium text-muted-foreground">
                              Percentage
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allResults.map((result, index) => (
                            <motion.tr
                              key={result.rank}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <span className="font-semibold text-foreground">
                                  #{result.rank}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-medium text-foreground">
                                  {result.name}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                  {result.course}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-foreground">
                                {result.score}/200
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-secondary rounded-full"
                                      style={{ width: `${result.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-secondary">
                                    {result.percentage}%
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center mt-6">
                  <Button variant="outline" className="gap-2">
                    Load More Results
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <Subtitle as="h2" className="font-display text-2xl md:text-3xl mb-4">
              Want to See Your Name Here?
            </Subtitle>
            <Paragraph className="mb-6">
              Join Entrance Pathway and start your preparation journey today. Our
              comprehensive courses and expert guidance have helped thousands achieve
              their dreams.
            </Paragraph>
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2">
                Start Your Journey
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
