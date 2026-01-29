"use client";

import * as React from "react";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import {
  Users,
  BookOpen,
  HelpCircle,
  ClipboardList,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { GET_USERS, GET_ADMIN_COURSES, GET_SUBJECTS, GET_ADMIN_EXAMS } from "@/graphql/queries/admin";
import Link from "next/link";
import { Button } from "@/components/ui";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, href, loading }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mt-2" />
              ) : (
                <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: { limit: 1 },
  });

  const { data: coursesData, loading: coursesLoading } = useQuery(GET_ADMIN_COURSES, {
    variables: { limit: 1 },
  });

  const { data: subjectsData, loading: subjectsLoading } = useQuery(GET_SUBJECTS);

  const { data: examsData, loading: examsLoading } = useQuery(GET_ADMIN_EXAMS, {
    variables: { limit: 1 },
  });

  // Calculate totals from data
  const totalUsers = usersData?.users?.length || 0;
  const totalCourses = coursesData?.courses?.length || 0;
  const totalSubjects = subjectsData?.subjects?.length || 0;
  const totalQuestions = subjectsData?.subjects?.reduce(
    (acc: number, subject: { questionsCount: number }) => acc + (subject.questionsCount || 0),
    0
  ) || 0;
  const totalExams = examsData?.exams?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Title>Admin Dashboard</Title>
        <Paragraph className="text-muted-foreground">
          Manage your platform content and users
        </Paragraph>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-6 h-6" />}
          href="/admin/users"
          loading={usersLoading}
        />
        <StatCard
          title="Courses"
          value={totalCourses}
          icon={<BookOpen className="w-6 h-6" />}
          href="/admin/courses"
          loading={coursesLoading}
        />
        <StatCard
          title="Questions"
          value={totalQuestions}
          icon={<HelpCircle className="w-6 h-6" />}
          href="/admin/question-bank"
          loading={subjectsLoading}
        />
        <StatCard
          title="Exams"
          value={totalExams}
          icon={<ClipboardList className="w-6 h-6" />}
          href="/admin/exams"
          loading={examsLoading}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/courses/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="w-4 h-4" />
                Add New Course
              </Button>
            </Link>
            <Link href="/admin/question-bank/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <HelpCircle className="w-4 h-4" />
                Add Question
              </Button>
            </Link>
            <Link href="/admin/exams/new">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ClipboardList className="w-4 h-4" />
                Create Exam
              </Button>
            </Link>
            <Link href="/admin/subjects">
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="w-4 h-4" />
                Manage Subjects
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : usersData?.users?.length > 0 ? (
              <div className="space-y-3">
                {usersData.users.slice(0, 5).map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-secondary px-2 py-1 rounded capitalize">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : coursesData?.courses?.length > 0 ? (
              <div className="space-y-3">
                {coursesData.courses.slice(0, 5).map((course: any) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{course.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.chaptersCount || 0} chapters
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        course.isPublished
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No courses found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
