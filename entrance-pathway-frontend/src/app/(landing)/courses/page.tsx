'use client';

import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import {
  BookOpen,
  Star,
  Users,
  Clock,
  ChevronRight,
  Video,
  FileText,
  Award,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { GET_LANDING_COURSES } from '@/graphql/queries/courses';
import {
  HeroSection,
  SectionHeader,
  FeatureGrid,
  DataState,
} from '@/components/molecules';

// Course type from API
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
  instructor: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
  chaptersCount: number | null;
  lessonsCount: number | null;
}

// What's included
const inclusions = [
  { icon: Video, text: 'Live Classes' },
  { icon: FileText, text: 'Study Notes' },
  { icon: BookOpen, text: 'Mock Tests' },
  { icon: Award, text: 'Certificate' },
];

// Why choose us features
const whyChooseUs = [
  {
    icon: Award,
    title: '95% Selection Rate',
    description: 'Our students consistently achieve top ranks in entrance exams across Nepal',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from educators with 10+ years of experience in entrance preparation',
  },
  {
    icon: BookOpen,
    title: 'Complete Support',
    description: 'Get doubt clearing sessions, mentor guidance, and 24/7 study support',
  },
];

// Course Card Component
function CourseCard({ course, index }: { course: Course; index: number }) {
  const originalPrice = course.price;
  const discountedPrice = course.discountedPrice ?? course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-strong transition-all group">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-5">
            {/* Left - Course Info */}
            <div className="md:col-span-3 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="font-display font-bold text-xl text-primary">
                    {course.title.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {course.title}
                    </h3>
                    {course.isBestseller && (
                      <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
                        Bestseller
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.fullName || course.title}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Features */}
              {course.features && course.features.length > 0 && (
                <div className="space-y-2 mb-4">
                  {course.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                  {course.features.length > 3 && (
                    <span className="text-sm text-primary">
                      +{course.features.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {course.studentCount && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.studentCount.toLocaleString()}
                  </span>
                )}
                {course.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    {course.rating.toFixed(1)}
                    {course.reviewsCount && ` (${course.reviewsCount})`}
                  </span>
                )}
                {course.durationHours && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.durationHours} hours
                  </span>
                )}
              </div>
            </div>

            {/* Right - Pricing & CTA */}
            <div className="md:col-span-2 p-6 bg-muted/30 flex flex-col justify-between">
              <div>
                {/* Inclusions */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {inclusions.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Course metrics */}
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-foreground">
                      {course.lessonsCount ?? 0}+
                    </p>
                    <p className="text-xs text-muted-foreground">Lectures</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="font-bold text-foreground">
                      {course.chaptersCount ?? 0}+
                    </p>
                    <p className="text-xs text-muted-foreground">Chapters</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-foreground">
                      Rs. {discountedPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs text-secondary font-medium">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <Link href={`/courses/${course.slug}`}>
                  <Button className="w-full gap-2">
                    View Course
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CoursesPage() {
  const { data, loading, error } = useQuery(GET_LANDING_COURSES);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section - Now uses reusable component */}
      <HeroSection
        badge={{ icon: BookOpen, text: 'Entrance Preparation Courses' }}
        title="Choose Your"
        highlightedText="Dream Course"
        description="Comprehensive preparation packages designed by experts with proven track records. Join thousands of successful students."
        showSearch
        searchPlaceholder="Search courses..."
        showFilter
      />

      {/* Courses Grid - Now uses DataState for loading/error/empty */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <DataState
            data={data?.courses}
            loading={loading}
            error={error}
            emptyIcon={BookOpen}
            emptyTitle="No courses available"
            emptyDescription="Check back later for new courses."
            skeletonCount={4}
            skeletonColumns={2}
          >
            {(courses: Course[]) => (
              <div className="grid lg:grid-cols-2 gap-8">
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            )}
          </DataState>
        </div>
      </section>

      {/* Why Choose Us - Now uses reusable components */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Why Students Choose Us"
            description="Our courses are designed with one goal in mind - your success"
          />
          <FeatureGrid features={whyChooseUs} columns={3} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary border-0">
            <CardContent className="py-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Not Sure Which Course to Choose?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                Talk to our counselors and get personalized guidance based on your goals
                and academic background.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 gap-2"
                >
                  Get Free Counseling
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Compare Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
