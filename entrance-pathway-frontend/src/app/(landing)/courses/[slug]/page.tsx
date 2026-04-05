'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, CardContent } from '@/components/ui';
import {
  Clock,
  Users,
  BookOpen,
  CheckCircle2,
  Star,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Play,
  FileText,
  Video,
  Award,
  ChevronDown,
  ChevronRight,
  Building2,
  Calendar,
  Target,
  Briefcase,
  Sparkles,
  Loader2,
  Lock,
} from 'lucide-react';
import { getCourseBySlug, type Course } from '@/actions';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  position: number;
  isPublished: boolean;
  isFree: boolean;
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
}

// Rich metadata per course slug
const courseInfo: Record<string, {
  university: string;
  duration: string;
  semesters: string;
  credits: string;
  stream: string;
  passingMarks: string;
  examFormat: string;
  examDuration: string;
  totalColleges: string;
  gradient: string;
  iconBg: string;
  entranceSubjects: { name: string; marks: string; topics: string }[];
  eligibility: string[];
  careerPaths: { title: string; description: string }[];
  topColleges: string[];
  feeRange: string;
  whyThisCourse: string[];
  semesterSubjects: { semester: string; subjects: string[] }[];
}> = {
  'bsc-csit': {
    university: 'Tribhuvan University — Institute of Science & Technology',
    duration: '4 Years',
    semesters: '8 Semesters',
    credits: '126 Credit Hours',
    stream: 'Science (+2 with Physics & Math)',
    passingMarks: '35 out of 100',
    examFormat: '100 MCQs, No negative marking',
    examDuration: '2 Hours',
    totalColleges: '133+ Colleges',
    gradient: 'from-brand-primary to-brand-primary/80',
    iconBg: 'bg-brand-primary',
    entranceSubjects: [
      { name: 'Mathematics', marks: '25', topics: 'Algebra, Trigonometry, Calculus, Coordinate Geometry, Vectors, Probability' },
      { name: 'Physics', marks: '25', topics: 'Mechanics, Heat, Optics, Electricity & Magnetism, Modern Physics' },
      { name: 'Chemistry', marks: '25', topics: 'Physical Chemistry, Organic Chemistry, Inorganic Chemistry' },
      { name: 'English', marks: '15', topics: 'Grammar, Vocabulary, Comprehension, Sentence Structure' },
      { name: 'Computer / IT', marks: '10', topics: 'Computer Fundamentals, Number Systems, Boolean Logic, Networking' },
    ],
    eligibility: [
      'Completed +2 in Science stream with Physics & Mathematics (100 marks each)',
      'Minimum Second Division or C grade in all subjects',
      'CTEVT Diploma holders in Engineering also eligible (Second Division)',
    ],
    careerPaths: [
      { title: 'Software Developer', description: 'Build applications for web, mobile, and enterprise systems' },
      { title: 'Data Analyst / AI Engineer', description: 'Work with data science, machine learning, and analytics' },
      { title: 'Network / Cloud Engineer', description: 'Design and manage network infrastructure and cloud systems' },
      { title: 'Cybersecurity Analyst', description: 'Protect organizations from digital threats and vulnerabilities' },
    ],
    topColleges: ['ASCOL (Amrit Science Campus)', 'Central Dept. of CSIT (CDCSIT)', 'Patan Multiple Campus', 'Prime College', 'Texas International College', 'Kathford International College'],
    feeRange: 'Rs. 2,00,000 – 8,00,000',
    whyThisCourse: [
      'Most recognized and in-demand IT degree in Nepal',
      'Strong theoretical foundation in CS with practical labs',
      'Highest number of affiliated colleges (133+) across Nepal',
      'Direct pathway to MSc CSIT and international MS programs',
    ],
    semesterSubjects: [
      { semester: '1st', subjects: ['C Programming', 'Digital Logic', 'Intro to IT', 'Mathematics I', 'Physics'] },
      { semester: '2nd', subjects: ['Discrete Structure', 'Mathematics II', 'Microprocessor', 'OOP (C++)', 'Statistics I'] },
      { semester: '3rd', subjects: ['Computer Architecture', 'Computer Graphics', 'Data Structures', 'Numerical Methods', 'Statistics II'] },
      { semester: '4th', subjects: ['AI', 'Computer Networks', 'DBMS', 'Operating System', 'Theory of Computation'] },
      { semester: '5th', subjects: ['Cryptography', 'Algorithm Design', 'Simulation & Modeling', 'System Analysis', 'Web Technology'] },
      { semester: '6th', subjects: ['Compiler Design', 'E-Governance', 'Net Centric Computing', 'Software Engineering', 'Technical Writing'] },
      { semester: '7th', subjects: ['Advanced Java', 'Data Warehousing', 'Principles of Management', 'Project Work'] },
      { semester: '8th', subjects: ['Advanced Database', 'Internship', 'Elective'] },
    ],
  },
  'bca': {
    university: 'Tribhuvan University — Faculty of Humanities & Social Sciences',
    duration: '4 Years',
    semesters: '8 Semesters',
    credits: '126 Credit Hours',
    stream: 'Any Stream (+2)',
    passingMarks: '40 out of 100',
    examFormat: '100 MCQs, No negative marking',
    examDuration: '2 Hours',
    totalColleges: '127+ Colleges',
    gradient: 'from-blue-600 to-blue-600/80',
    iconBg: 'bg-blue-500',
    entranceSubjects: [
      { name: 'English', marks: '25', topics: 'Grammar, Vocabulary, Comprehension, Sentence Construction' },
      { name: 'Mathematics', marks: '25', topics: 'Algebra, Sets, Statistics, Trigonometry, Coordinate Geometry' },
      { name: 'Logic / Reasoning', marks: '25', topics: 'Logical Reasoning, Analytical Thinking, Puzzles' },
      { name: 'General Knowledge', marks: '25', topics: 'Current Affairs, Science, Technology, Nepal GK' },
    ],
    eligibility: [
      'Completed +2 from any stream (Science, Management, Humanities)',
      'Minimum D grade in all subjects with CGPA 1.8+',
      'OR Second Division in 10+2 or equivalent',
    ],
    careerPaths: [
      { title: 'Web Developer', description: 'Create websites and web applications using modern frameworks' },
      { title: 'Mobile App Developer', description: 'Build iOS and Android apps for businesses and consumers' },
      { title: 'Database Administrator', description: 'Design and manage database systems for organizations' },
      { title: 'IT Officer', description: 'Manage IT infrastructure in banks, NGOs, and government' },
    ],
    topColleges: ['ASCOL (Amrit Science Campus)', 'Patan Multiple Campus', 'Thames International College', 'Kathford International College', 'Kantipur City College', 'Crimson College'],
    feeRange: 'Rs. 3,00,000 – 8,50,000',
    whyThisCourse: [
      'Open to students from any +2 stream — widest accessibility',
      'No Physics/Chemistry required in entrance exam',
      'Strong focus on practical computer applications',
      '127+ colleges across Nepal — maximum availability',
    ],
    semesterSubjects: [
      { semester: '1st', subjects: ['Computer Fundamentals', 'Society & Technology', 'English I', 'Mathematics I', 'Digital Logic'] },
      { semester: '2nd', subjects: ['C Programming', 'Financial Accounting', 'English II', 'Mathematics II', 'Microprocessor'] },
      { semester: '3rd', subjects: ['Data Structures', 'Probability & Statistics', 'System Analysis', 'OOP (Java)', 'Web Technology'] },
      { semester: '4th', subjects: ['Operating System', 'Numerical Methods', 'Software Engineering', 'Scripting Language', 'DBMS'] },
      { semester: '5th', subjects: ['MIS & e-Business', '.NET Technology', 'Computer Networking', 'Management', 'Computer Graphics'] },
      { semester: '6th', subjects: ['Mobile Programming', 'Distributed System', 'Applied Economics', 'Advanced Java', 'Network Programming'] },
      { semester: '7th', subjects: ['Cyber Law', 'Cloud Computing', 'Internship', 'Elective I', 'Elective II'] },
      { semester: '8th', subjects: ['Operations Research', 'Final Project', 'Elective III', 'Elective IV'] },
    ],
  },
  'bit': {
    university: 'Purbanchal University — Faculty of Science & Technology',
    duration: '4 Years',
    semesters: '8 Semesters',
    credits: '140 Credit Hours',
    stream: 'Any Stream (Math 100 marks required)',
    passingMarks: '35 out of 100',
    examFormat: '100 MCQs, No negative marking',
    examDuration: '2 Hours',
    totalColleges: '21+ Colleges',
    gradient: 'from-violet-600 to-violet-600/80',
    iconBg: 'bg-violet-500',
    entranceSubjects: [
      { name: 'Basic Computer', marks: '35', topics: 'Computer Fundamentals, Software, Hardware, Internet, Networking' },
      { name: 'English', marks: '25', topics: 'Grammar, Vocabulary, Reading Comprehension' },
      { name: 'Aptitude / Reasoning', marks: '25', topics: 'Logical Reasoning, Analytical Ability, Problem Solving' },
      { name: 'Mathematics', marks: '15', topics: 'Algebra, Arithmetic, Geometry, Sets, Statistics' },
    ],
    eligibility: [
      'Completed +2 from any stream with Mathematics of 100 marks',
      'Minimum C grade in all subjects with CGPA 2.0+',
      'OR Second Division (45%) in 10+2 or equivalent',
    ],
    careerPaths: [
      { title: 'Software Developer', description: 'Build software products with strong practical skills' },
      { title: 'System Administrator', description: 'Manage servers, networks, and IT infrastructure' },
      { title: 'IT Consultant', description: 'Advise businesses on technology strategy and implementation' },
      { title: 'Mobile App Developer', description: 'Develop cross-platform mobile applications' },
    ],
    topColleges: ['Kantipur City College', 'KIST College', 'Padmashree College', 'MIT Nepal', 'CIT College'],
    feeRange: 'Rs. 3,00,000 – 7,00,000',
    whyThisCourse: [
      'Most practical IT program — project in every semester',
      'Hands-on apprentice project in final semester',
      'Under Purbanchal University — strong industry connections',
      'Computer-heavy entrance exam (35 marks for CS)',
    ],
    semesterSubjects: [
      { semester: '1st', subjects: ['Mathematics I', 'Fundamentals of IT', 'English', 'Electrical Systems', 'Management', 'C Programming'] },
      { semester: '2nd', subjects: ['Mathematics II', 'Electronics', 'Digital Logic', 'OOP (C++)', 'Financial Management'] },
      { semester: '3rd', subjects: ['Data Structures', 'Microprocessor', 'Numerical Methods', 'System Analysis', 'UI Design'] },
      { semester: '4th', subjects: ['Discrete Mathematics', 'Computer Organization', 'DBMS', 'Communication System', 'Web Technology I'] },
      { semester: '5th', subjects: ['Probability & Statistics', 'Operating Systems', 'Data Communication', 'Computer Graphics', 'Web Technology II'] },
      { semester: '6th', subjects: ['Computer Network', 'Advanced OOP', 'Data Mining', 'Embedded Systems', 'Research Methodology'] },
      { semester: '7th', subjects: ['Software Engineering', 'AI', 'Network Programming', 'MIS', 'Elective I'] },
      { semester: '8th', subjects: ['Project Management', 'E-Commerce', 'Wireless Communication', 'Elective II', 'Apprentice Project'] },
    ],
  },
  'bim': {
    university: 'Tribhuvan University — Faculty of Management',
    duration: '4 Years',
    semesters: '8 Semesters',
    credits: '126 Credit Hours',
    stream: 'Any Stream (+2)',
    passingMarks: '40 out of 100 (CMAT)',
    examFormat: '100 MCQs (CMAT), No negative marking',
    examDuration: '90 Minutes',
    totalColleges: '40+ Colleges',
    gradient: 'from-indigo-600 to-indigo-600/80',
    iconBg: 'bg-indigo-500',
    entranceSubjects: [
      { name: 'Verbal Ability (English)', marks: '25', topics: 'Vocabulary, Grammar, Reading Comprehension, Sentence Correction' },
      { name: 'Quantitative Ability (Math)', marks: '25', topics: 'Arithmetic, Algebra, Geometry, Data Interpretation' },
      { name: 'Logical Reasoning', marks: '25', topics: 'Logical Thinking, Puzzles, Patterns, Analytical Reasoning' },
      { name: 'General Awareness', marks: '25', topics: 'Current Affairs, Nepal GK, Science & Technology, Business' },
    ],
    eligibility: [
      'Completed +2 from any stream (Science, Management, Humanities, Education)',
      'Minimum D+ grade in all subjects with CGPA 1.80+',
      'Must pass the CMAT (common exam for BBA, BBM, BIM, BHM, etc.)',
    ],
    careerPaths: [
      { title: 'Business Analyst', description: 'Bridge the gap between IT and business strategy' },
      { title: 'IT Project Manager', description: 'Lead technology projects from planning to delivery' },
      { title: 'ERP Specialist', description: 'Implement and manage enterprise resource planning systems' },
      { title: 'Digital Marketing Manager', description: 'Drive digital strategy and online presence for businesses' },
    ],
    topColleges: ['Nepal Commerce Campus', 'Shanker Dev Campus', 'KCMIT', 'NCCS', 'Asian School of Management', 'St. Xavier\'s College'],
    feeRange: 'Rs. 4,40,000 – 6,00,000',
    whyThisCourse: [
      'Unique blend of IT skills and business management',
      'Uses CMAT exam — more aptitude-based, less technical',
      'Strong demand in banks, financial institutions, and corporates',
      'Great for students interested in both tech and business',
    ],
    semesterSubjects: [
      { semester: '1st', subjects: ['C Programming', 'Basic Mathematics', 'English I', 'Business Management', 'Fundamentals of IT'] },
      { semester: '2nd', subjects: ['Business Communication', 'Digital Logic', 'Discrete Structure', 'OOP (Java)', 'HRM'] },
      { semester: '3rd', subjects: ['Business Statistics', 'Data Structures', 'Financial Accounting', 'Microprocessor', 'Web Technology I'] },
      { semester: '4th', subjects: ['Networking', 'Cost Accounting', 'DBMS', 'Economics', 'Operating System', 'Web Technology II'] },
      { semester: '5th', subjects: ['AI', 'Marketing', 'Information Security', 'Python', 'Software Design'] },
      { semester: '6th', subjects: ['Business Environment', 'BIS', 'Research Methods', 'Corporate Finance', 'IT Ethics', 'Project'] },
      { semester: '7th', subjects: ['E-Commerce', 'Operations Management', 'Sociology', 'Strategic Management', 'Elective I'] },
      { semester: '8th', subjects: ['Business Intelligence', 'Digital Economy', 'ICT Economics', 'Elective II', 'Internship'] },
    ],
  },
};

function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="bg-linear-to-br from-primary/10 to-background pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="h-5 w-40 bg-muted rounded animate-pulse mb-4" />
            <div className="h-12 w-3/4 bg-muted rounded animate-pulse mb-4" />
            <div className="h-5 w-full bg-muted rounded animate-pulse mb-2" />
            <div className="h-5 w-2/3 bg-muted rounded animate-pulse mb-8" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-32 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-3">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The course you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/courses">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Browse All Courses
          </Button>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
      <Icon className="w-5 h-5 text-white/70" />
      <div>
        <p className="text-sm font-bold text-white">{value}</p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </div>
  );
}

function AccordionChapter({ chapter, index, isOpen, onToggle }: {
  chapter: Chapter;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div>
            <p className="font-semibold text-foreground">{chapter.title}</p>
            <p className="text-xs text-muted-foreground">{chapter.lessons.length} lessons</p>
          </div>
        </div>
        <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && chapter.lessons.length > 0 && (
        <div className="border-t border-border/50 bg-muted/20">
          {chapter.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 text-sm border-b border-border/30 last:border-0">
              {lesson.isFree ? (
                <Play className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              )}
              <span className="flex-1 text-foreground/80">{lesson.title}</span>
              {lesson.isFree && (
                <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 rounded-full px-2 py-0.5">Free</span>
              )}
              {lesson.duration && (
                <span className="text-xs text-muted-foreground">{lesson.duration}m</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [course, setCourse] = React.useState<(Course & { chapters: Chapter[] }) | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openChapter, setOpenChapter] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'curriculum' | 'entrance'>('overview');

  React.useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const result = await getCourseBySlug(slug);
      if (result.success) {
        setCourse(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadCourse();
  }, [slug]);

  if (loading) return <CourseDetailSkeleton />;
  if (error) return <CourseNotFound />;
  if (!course) return <CourseNotFound />;

  const meta = courseInfo[slug] || courseInfo['bsc-csit'];
  const originalPrice = course.price;
  const discountedPrice = course.discountedPrice ?? course.price;
  const hasDiscount = course.discountedPrice && course.discountedPrice < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const publishedChapters = course.chapters
    ?.filter((chapter) => chapter.isPublished)
    .sort((a, b) => a.position - b.position)
    .map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons?.filter((lesson) => lesson.isPublished).sort((a, b) => a.position - b.position) || [],
    })) || [];

  const totalLessons = publishedChapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const totalDurationMinutes = publishedChapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((la, l) => la + (l.duration || 0), 0), 0
  );

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'curriculum' as const, label: 'Curriculum' },
    { id: 'entrance' as const, label: 'Entrance Exam' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`relative overflow-hidden pt-28 pb-12 lg:pt-36 lg:pb-16 bg-linear-to-br ${meta.gradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            All Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
                    {meta.university.split('—')[0].trim()}
                  </span>
                  {course.isBestseller && (
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-100 text-xs font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {course.fullName || course.title}
                </h1>

                <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
                  {course.description}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3">
                  {!!course.rating && (
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                      <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span className="text-sm font-semibold text-white">{course.rating.toFixed(1)}</span>
                      {!!course.reviewsCount && <span className="text-xs text-white/60">({course.reviewsCount} reviews)</span>}
                    </div>
                  )}
                  {!!course.studentCount && (
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                      <Users className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white">{course.studentCount.toLocaleString()}+ students</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm text-white">{meta.duration}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky pricing card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-bold text-foreground">
                        Rs. {discountedPrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-base text-muted-foreground line-through">
                          Rs. {originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-sm font-semibold text-brand-primary">{discountPercent}% off — Limited offer</span>
                    )}
                  </div>

                  <Button className="w-full mb-3" size="lg">
                    Enroll Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Try Free Demo
                  </Button>

                  {/* What's included */}
                  <div className="mt-6 pt-5 border-t space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What&apos;s included</p>
                    {[
                      { icon: Video, label: 'Live interactive classes' },
                      { icon: Play, label: `${totalLessons || course.lessonsCount || 0}+ video lectures` },
                      { icon: FileText, label: 'Study notes & formulas' },
                      { icon: Target, label: '10,000+ practice questions' },
                      { icon: BookOpen, label: 'Full mock test series' },
                      { icon: Award, label: 'Certificate of completion' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2.5 text-sm">
                        <item.icon className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground/80">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Course stats */}
                  <div className="mt-5 pt-5 border-t grid grid-cols-2 gap-3">
                    <div className="text-center p-2.5 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-foreground">{publishedChapters.length || course.chaptersCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Chapters</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-foreground">
                        {totalDurationMinutes > 0 ? `${Math.floor(totalDurationMinutes / 60)}h` : `${course.durationHours || 0}h`}
                      </p>
                      <p className="text-xs text-muted-foreground">Content</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 lg:top-20 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* About the program */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">About {course.title}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { icon: Building2, label: 'University', value: meta.university.split('—')[0].trim() },
                      { icon: Clock, label: 'Duration', value: `${meta.duration} (${meta.semesters})` },
                      { icon: BookOpen, label: 'Credits', value: meta.credits },
                      { icon: GraduationCap, label: 'Required Stream', value: meta.stream },
                      { icon: Building2, label: 'Affiliated Colleges', value: meta.totalColleges },
                      { icon: Calendar, label: 'Fee Range', value: meta.feeRange },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Why this course */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Why Choose {course.title}?</h2>
                  <div className="space-y-3">
                    {meta.whyThisCourse.map((reason, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" />
                        <p className="text-foreground/80">{reason}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Eligibility */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Eligibility Criteria</h2>
                  <Card className="border-border/50">
                    <CardContent className="p-5 space-y-3">
                      {meta.eligibility.map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-primary">{i + 1}</span>
                          </div>
                          <p className="text-sm text-foreground/80">{item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>

                {/* Career paths */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Career Prospects</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {meta.careerPaths.map((career) => (
                      <div key={career.title} className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2.5 mb-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <h3 className="font-semibold text-foreground text-sm">{career.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{career.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Top colleges */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Top Colleges</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {meta.topColleges.map((college) => (
                      <div key={college} className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-foreground/80">{college}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <>
                {/* Course chapters (from DB) */}
                {publishedChapters.length > 0 && (
                  <section>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">Course Content</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      {publishedChapters.length} chapters &middot; {totalLessons} lessons
                      {totalDurationMinutes > 0 && ` · ${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m`}
                    </p>
                    <div className="space-y-3">
                      {publishedChapters.map((chapter, i) => (
                        <AccordionChapter
                          key={chapter.id}
                          chapter={chapter}
                          index={i}
                          isOpen={openChapter === chapter.id}
                          onToggle={() => setOpenChapter(openChapter === chapter.id ? null : chapter.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Full university syllabus */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Full {course.title} Syllabus
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Complete semester-wise subject breakdown ({meta.semesters})
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {meta.semesterSubjects.map((sem) => (
                      <Card key={sem.semester} className="border-border/50 overflow-hidden">
                        <div className={`px-4 py-2 bg-linear-to-r ${meta.gradient} bg-opacity-10`}>
                          <p className="text-sm font-bold text-white">Semester {sem.semester}</p>
                        </div>
                        <CardContent className="p-4">
                          <ul className="space-y-1.5">
                            {sem.subjects.map((subj) => (
                              <li key={subj} className="flex items-center gap-2 text-sm text-foreground/80">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                                {subj}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Entrance Exam Tab */}
            {activeTab === 'entrance' && (
              <>
                {/* Exam overview */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    {course.title} Entrance Exam
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Format', value: meta.examFormat.split(',')[0] },
                      { label: 'Duration', value: meta.examDuration },
                      { label: 'Pass Marks', value: meta.passingMarks },
                      { label: 'Negative Marking', value: 'No' },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-muted/40 border border-border/50 text-center">
                        <p className="text-lg font-bold text-foreground mb-1">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Subject-wise breakdown */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Subject-wise Breakdown</h2>
                  <div className="space-y-4">
                    {meta.entranceSubjects.map((subject) => (
                      <Card key={subject.name} className="border-border/50 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between p-4 pb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${meta.iconBg} flex items-center justify-center`}>
                                <span className="text-sm font-bold text-white">{subject.marks}</span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{subject.name}</h3>
                                <p className="text-xs text-muted-foreground">{subject.marks} marks</p>
                              </div>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <div className="flex flex-wrap gap-1.5">
                              {subject.topics.split(', ').map((topic) => (
                                <span
                                  key={topic}
                                  className="text-xs bg-muted border border-border/50 rounded-md px-2 py-1 text-foreground/70"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Total marks visual */}
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-5">Marks Distribution</h2>
                  <Card className="border-border/50">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {meta.entranceSubjects.map((subject) => {
                          const marks = parseInt(subject.marks);
                          return (
                            <div key={subject.name} className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium text-foreground">{subject.name}</span>
                                <span className="text-muted-foreground">{subject.marks} marks</span>
                              </div>
                              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full bg-linear-to-r ${meta.gradient} transition-all duration-700`}
                                  style={{ width: `${marks}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span>100 marks</span>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            )}
          </div>

          {/* Right sidebar on desktop — hidden on mobile (pricing card is in hero) */}
          <div className="hidden lg:block">
            <div className="sticky top-36">
              <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-5">
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">Rs. {discountedPrice.toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">Rs. {originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {hasDiscount && <span className="text-xs font-semibold text-brand-primary">{discountPercent}% off</span>}
                  </div>
                  <Button className="w-full mb-2.5" size="lg">Enroll Now</Button>
                  <Button variant="outline" className="w-full" size="lg">Try Free Demo</Button>

                  {course.features && course.features.length > 0 && (
                    <div className="mt-5 pt-5 border-t space-y-2.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">This course includes</p>
                      {course.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                          <span className="text-foreground/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-brand-primary p-10 md:p-16 text-center shadow-glow-primary">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
            
            <div className="relative max-w-2xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Ready to Start Your {course.title} Preparation?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of students who have cracked the entrance and secured admissions in top colleges across Nepal.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white gap-2 font-bold px-8 h-14 rounded-xl shadow-glow-brand transition-all hover:scale-105 active:scale-95">
                  Enroll Now <ChevronRight className="w-4 h-4" />
                </Button>
                <Link href="/courses">
                  <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 px-8 h-14 rounded-xl">
                    View All Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
