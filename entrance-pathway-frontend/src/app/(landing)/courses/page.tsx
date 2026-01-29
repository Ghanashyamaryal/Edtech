'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardContent, Input } from '@/components/ui';
import {
  BookOpen,
  Search,
  Star,
  Users,
  Clock,
  ChevronRight,
  Video,
  FileText,
  Award,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

// Course data
const courses = [
  {
    id: 1,
    slug: 'bsc-csit',
    name: 'BSc CSIT',
    fullName: 'Bachelor in Computer Science & Information Technology',
    description:
      'Complete preparation for TU BSc CSIT entrance examination with comprehensive coverage of all subjects.',
    students: 4500,
    rating: 4.9,
    reviews: 1245,
    duration: '6 months',
    lectures: 250,
    tests: 50,
    color: 'primary',
    features: [
      'Mathematics (Calculus, Algebra, Statistics)',
      'Computer Science Fundamentals',
      'English & Communication',
      'Logical Reasoning',
    ],
    price: {
      original: 15000,
      discounted: 9999,
    },
    isBestseller: true,
  },
  {
    id: 2,
    slug: 'bit',
    name: 'BIT',
    fullName: 'Bachelor in Information Technology',
    description:
      'Comprehensive BIT entrance preparation covering PU and other university patterns.',
    students: 2800,
    rating: 4.8,
    reviews: 876,
    duration: '6 months',
    lectures: 220,
    tests: 45,
    color: 'secondary',
    features: [
      'Mathematics',
      'Computer Science',
      'English',
      'General Knowledge',
    ],
    price: {
      original: 12000,
      discounted: 7999,
    },
    isBestseller: false,
  },
  {
    id: 3,
    slug: 'bca',
    name: 'BCA',
    fullName: 'Bachelor in Computer Application',
    description:
      'Expert-curated BCA entrance preparation with focus on practical problem-solving.',
    students: 2100,
    rating: 4.8,
    reviews: 654,
    duration: '4 months',
    lectures: 180,
    tests: 40,
    color: 'gold',
    features: [
      'Mathematics',
      'English',
      'Computer Awareness',
      'Reasoning & Aptitude',
    ],
    price: {
      original: 10000,
      discounted: 6999,
    },
    isBestseller: false,
  },
  {
    id: 4,
    slug: 'bim',
    name: 'BIM',
    fullName: 'Bachelor in Information Management',
    description:
      'Targeted BIM entrance preparation with management and IT fundamentals.',
    students: 1200,
    rating: 4.7,
    reviews: 432,
    duration: '4 months',
    lectures: 150,
    tests: 35,
    color: 'primary',
    features: [
      'Mathematics',
      'English',
      'General Knowledge',
      'Computer & Management',
    ],
    price: {
      original: 10000,
      discounted: 6999,
    },
    isBestseller: false,
  },
];

// What's included
const inclusions = [
  { icon: Video, text: 'Live Classes' },
  { icon: FileText, text: 'Study Notes' },
  { icon: BookOpen, text: 'Mock Tests' },
  { icon: Award, text: 'Certificate' },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Entrance Preparation Courses
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your <span className="text-gradient-primary">Dream Course</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Comprehensive preparation packages designed by experts with proven track
              records. Join thousands of successful students.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search courses..." className="pl-12 h-12" />
              </div>
              <Button size="lg" variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
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
                          <div
                            className={`w-14 h-14 rounded-2xl bg-${course.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <span
                              className={`font-display font-bold text-xl text-${course.color}`}
                            >
                              {course.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-bold text-xl text-foreground">
                                {course.name}
                              </h3>
                              {course.isBestseller && (
                                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-medium">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {course.fullName}
                            </p>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Features */}
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

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold fill-gold" />
                            {course.rating} ({course.reviews})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
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
                                {course.lectures}+
                              </p>
                              <p className="text-xs text-muted-foreground">Lectures</p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="text-center">
                              <p className="font-bold text-foreground">{course.tests}+</p>
                              <p className="text-xs text-muted-foreground">Tests</p>
                            </div>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div>
                          <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-2xl font-bold text-foreground">
                                Rs. {course.price.discounted.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                Rs. {course.price.original.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-xs text-secondary font-medium">
                              {Math.round(
                                ((course.price.original - course.price.discounted) /
                                  course.price.original) *
                                  100
                              )}
                              % OFF
                            </span>
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
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Why Students Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our courses are designed with one goal in mind - your success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '95% Selection Rate',
                description:
                  'Our students consistently achieve top ranks in entrance exams across Nepal',
                icon: Award,
              },
              {
                title: 'Expert Instructors',
                description:
                  'Learn from educators with 10+ years of experience in entrance preparation',
                icon: Users,
              },
              {
                title: 'Complete Support',
                description:
                  'Get doubt clearing sessions, mentor guidance, and 24/7 study support',
                icon: BookOpen,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
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
