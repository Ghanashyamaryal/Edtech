'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import {
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { GET_COURSE } from '@/graphql/queries/courses';

// Types
interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  position: number;
  isPublished: boolean;
  isFree: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  fullName: string | null;
  description: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  discountedPrice: number | null;
  durationHours: number | null;
  studentCount: number | null;
  rating: number | null;
  reviewsCount: number | null;
  features: string[] | null;
  isBestseller: boolean | null;
  isPublished: boolean;
  instructor: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
  chapters: Chapter[];
}

// Loading skeleton
function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse mb-2" />
              <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex gap-6 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
                <div className="h-12 w-full bg-muted rounded animate-pulse mb-3" />
                <div className="h-12 w-full bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Error component
function CourseNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto p-8">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="font-display font-semibold text-xl text-foreground mb-2">
            Course Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The course you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/courses">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

// Error component for API errors
function CourseError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto p-8">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="font-display font-semibold text-xl text-foreground mb-2">
            Failed to Load Course
          </h2>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Link href="/courses">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                All Courses
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: { slug },
    skip: !slug,
  });

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return <CourseError message={error.message} />;
  }

  const course: Course | null = data?.course;

  if (!course) {
    return <CourseNotFound />;
  }

  const originalPrice = course.price;
  const discountedPrice = course.discountedPrice ?? course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  // Filter published chapters and lessons
  const publishedChapters = course.chapters
    ?.filter((chapter) => chapter.isPublished)
    .sort((a, b) => a.position - b.position)
    .map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons
        ?.filter((lesson) => lesson.isPublished)
        .sort((a, b) => a.position - b.position) || [],
    })) || [];

  // Calculate total lessons
  const totalLessons = publishedChapters.reduce(
    (acc, chapter) => acc + chapter.lessons.length,
    0
  );

  // Calculate total duration
  const totalDurationMinutes = publishedChapters.reduce(
    (acc, chapter) =>
      acc + chapter.lessons.reduce((lessonAcc, lesson) => lessonAcc + (lesson.duration || 0), 0),
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Small className="text-primary mb-2">
                {course.title} Entrance Preparation
              </Small>
              <Title className="mb-4">
                {course.fullName || course.title}
              </Title>
              <Paragraph className="text-lg text-muted-foreground mb-6">
                {course.description}
              </Paragraph>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{course.rating.toFixed(1)}</span>
                    {course.reviewsCount && (
                      <span className="text-muted-foreground">
                        ({course.reviewsCount.toLocaleString()} reviews)
                      </span>
                    )}
                  </div>
                )}
                {course.studentCount && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>{course.studentCount.toLocaleString()}+ students</span>
                  </div>
                )}
                {(course.durationHours || totalDurationMinutes > 0) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>
                      {course.durationHours
                        ? `${course.durationHours} hours`
                        : `${Math.round(totalDurationMinutes / 60)} hours`}
                    </span>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {course.instructor.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <Paragraph className="text-sm font-medium">
                        {course.instructor.fullName}
                      </Paragraph>
                      <Small className="text-muted-foreground">Instructor</Small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Card */}
            <Card className="lg:sticky lg:top-8 h-fit">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-muted-foreground line-through">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-sm text-green-600 font-medium">
                      {discountPercent}% off
                    </span>
                  )}
                </div>

                <Button className="w-full mb-3" size="lg">
                  Enroll Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Try Free Demo
                </Button>

                {course.features && course.features.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <Subtitle as="h4" className="text-sm">
                      This course includes:
                    </Subtitle>
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Course Stats */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Chapters</span>
                    <span className="font-medium">{publishedChapters.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{totalLessons}</span>
                  </div>
                  {totalDurationMinutes > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Duration</span>
                      <span className="font-medium">
                        {Math.floor(totalDurationMinutes / 60)}h {totalDurationMinutes % 60}m
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Content */}
      {publishedChapters.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="lg:w-2/3">
              <Subtitle className="mb-6">Course Syllabus</Subtitle>
              <div className="space-y-4">
                {publishedChapters.map((chapter, index) => (
                  <Card key={chapter.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                        {chapter.title}
                      </CardTitle>
                      {chapter.description && (
                        <p className="text-sm text-muted-foreground pl-11">
                          {chapter.description}
                        </p>
                      )}
                    </CardHeader>
                    {chapter.lessons.length > 0 && (
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-2 pl-11">
                          {chapter.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <BookOpen className="w-4 h-4 shrink-0" />
                              <span className="truncate">{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                  Free
                                </span>
                              )}
                              {lesson.duration && (
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {lesson.duration}m
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Ready to Start Your Preparation?</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Join thousands of students who have successfully prepared with us and
              secured admissions in top colleges.
            </Paragraph>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">Enroll Now</Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/courses">View All Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
