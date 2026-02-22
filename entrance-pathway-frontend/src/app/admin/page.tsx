import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Title, Paragraph } from "@/components/atoms";
import {
  Users,
  BookOpen,
  HelpCircle,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { getUsers, getCourses, getSubjects, getExams } from "@/actions";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
}

function StatCard({ title, value, icon, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{value}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [usersResult, coursesResult, subjectsResult, examsResult] = await Promise.all([
    getUsers({ limit: 10 }),
    getCourses({ limit: 10 }),
    getSubjects(),
    getExams({ limit: 100 }),
  ]);

  const users = usersResult.success ? usersResult.data : [];
  const courses = coursesResult.success ? coursesResult.data : [];
  const subjects = subjectsResult.success ? subjectsResult.data : [];
  const exams = examsResult.success ? examsResult.data : [];

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalQuestions = subjects.reduce(
    (acc, subject) => acc + (subject.questionsCount || 0),
    0
  );
  const totalExams = exams.length;

  return (
    <div className="space-y-8">
      <div>
        <Title>Admin Dashboard</Title>
        <Paragraph className="text-muted-foreground">
          Manage your platform content and users
        </Paragraph>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-6 h-6" />}
          href="/admin/users"
        />
        <StatCard
          title="Courses"
          value={totalCourses}
          icon={<BookOpen className="w-6 h-6" />}
          href="/admin/courses"
        />
        <StatCard
          title="Questions"
          value={totalQuestions}
          icon={<HelpCircle className="w-6 h-6" />}
          href="/admin/question-bank"
        />
        <StatCard
          title="Exams"
          value={totalExams}
          icon={<ClipboardList className="w-6 h-6" />}
          href="/admin/exams"
        />
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-3 p-2 sm:p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {user.fullName?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-secondary px-2 py-1 rounded capitalize shrink-0">
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
            {courses.length > 0 ? (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 p-2 sm:p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{course.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.chaptersCount || 0} chapters
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded shrink-0 ${
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
