import Link from "next/link";
import { notFound } from "next/navigation";
import { Title, Subtitle, Paragraph, Small } from "@/components/atoms";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Star,
  Calendar,
} from "lucide-react";

const coursesData: Record<
  string,
  {
    title: string;
    fullName: string;
    description: string;
    duration: string;
    students: string;
    lectures: number;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    syllabus: { module: string; topics: string[] }[];
    features: string[];
    instructors: { name: string; role: string }[];
  }
> = {
  "bsc-csit": {
    title: "BSc CSIT",
    fullName: "Bachelor of Science in Computer Science and Information Technology",
    description:
      "Comprehensive preparation course for BSc CSIT entrance examination. Covers all subjects including Mathematics, English, Physics, Chemistry, and Computer Science.",
    duration: "3 months",
    students: "5,000+",
    lectures: 120,
    price: 4999,
    originalPrice: 7999,
    rating: 4.8,
    reviews: 2340,
    syllabus: [
      {
        module: "Mathematics",
        topics: [
          "Algebra & Trigonometry",
          "Calculus",
          "Coordinate Geometry",
          "Probability & Statistics",
        ],
      },
      {
        module: "Physics",
        topics: [
          "Mechanics",
          "Heat & Thermodynamics",
          "Waves & Optics",
          "Electricity & Magnetism",
        ],
      },
      {
        module: "Chemistry",
        topics: [
          "Physical Chemistry",
          "Organic Chemistry",
          "Inorganic Chemistry",
        ],
      },
      {
        module: "English",
        topics: [
          "Grammar",
          "Vocabulary",
          "Reading Comprehension",
          "Writing Skills",
        ],
      },
      {
        module: "Computer Science",
        topics: [
          "Computer Fundamentals",
          "Number Systems",
          "Basic Programming",
          "Data Representation",
        ],
      },
    ],
    features: [
      "120+ Video Lectures",
      "Comprehensive Study Notes",
      "10 Full-length Mock Tests",
      "Live Doubt Clearing Sessions",
      "Previous Year Questions",
      "Performance Analytics",
    ],
    instructors: [
      { name: "Dr. Ram Sharma", role: "Mathematics Expert" },
      { name: "Prof. Sita Adhikari", role: "Physics & Chemistry" },
    ],
  },
  bit: {
    title: "BIT",
    fullName: "Bachelor of Information Technology",
    description:
      "Complete preparation course for BIT entrance examination covering all required subjects with expert guidance and comprehensive study materials.",
    duration: "3 months",
    students: "3,000+",
    lectures: 100,
    price: 4499,
    originalPrice: 6999,
    rating: 4.7,
    reviews: 1560,
    syllabus: [
      {
        module: "Mathematics",
        topics: ["Algebra", "Calculus", "Statistics", "Discrete Mathematics"],
      },
      {
        module: "English",
        topics: ["Grammar", "Comprehension", "Vocabulary", "Writing"],
      },
      {
        module: "General Knowledge",
        topics: ["Current Affairs", "Computer Awareness", "Logical Reasoning"],
      },
      {
        module: "Computer Basics",
        topics: [
          "Computer Fundamentals",
          "Operating Systems",
          "Internet Basics",
        ],
      },
    ],
    features: [
      "100+ Video Lectures",
      "Detailed Study Notes",
      "8 Full-length Mock Tests",
      "Weekly Live Classes",
      "PYQ Solutions",
      "24/7 Doubt Support",
    ],
    instructors: [
      { name: "Anil Thapa", role: "IT Expert" },
      { name: "Priya Gurung", role: "Math & English" },
    ],
  },
  bca: {
    title: "BCA",
    fullName: "Bachelor of Computer Applications",
    description:
      "Targeted preparation for BCA entrance exams with focus on Mathematics, English, and Computer fundamentals.",
    duration: "2.5 months",
    students: "4,000+",
    lectures: 90,
    price: 3999,
    originalPrice: 5999,
    rating: 4.6,
    reviews: 1890,
    syllabus: [
      {
        module: "Mathematics",
        topics: ["Basic Algebra", "Sets & Relations", "Probability", "Matrices"],
      },
      {
        module: "English",
        topics: ["Grammar Basics", "Vocabulary", "Comprehension"],
      },
      {
        module: "Computer Fundamentals",
        topics: [
          "Hardware & Software",
          "Number Systems",
          "Basic Programming Logic",
        ],
      },
      {
        module: "Logical Reasoning",
        topics: ["Pattern Recognition", "Puzzles", "Data Interpretation"],
      },
    ],
    features: [
      "90+ Video Lectures",
      "Concise Study Notes",
      "6 Mock Tests",
      "Doubt Sessions",
      "Quick Revision Materials",
      "Mobile App Access",
    ],
    instructors: [
      { name: "Bijay KC", role: "Computer Science" },
      { name: "Sunita Sharma", role: "Mathematics" },
    ],
  },
  bim: {
    title: "BIM",
    fullName: "Bachelor of Information Management",
    description:
      "Specialized preparation for BIM entrance focusing on Management concepts along with IT fundamentals.",
    duration: "2.5 months",
    students: "2,500+",
    lectures: 85,
    price: 3999,
    originalPrice: 5999,
    rating: 4.7,
    reviews: 1230,
    syllabus: [
      {
        module: "Mathematics",
        topics: ["Business Mathematics", "Statistics", "Quantitative Aptitude"],
      },
      {
        module: "English",
        topics: ["Business English", "Communication Skills", "Comprehension"],
      },
      {
        module: "Management",
        topics: [
          "Principles of Management",
          "Business Studies",
          "Organizational Behavior",
        ],
      },
      {
        module: "IT Fundamentals",
        topics: ["Computer Basics", "MIS Concepts", "Database Basics"],
      },
    ],
    features: [
      "85+ Video Lectures",
      "Management Case Studies",
      "6 Mock Tests",
      "GD/PI Preparation",
      "Industry Insights",
      "Career Guidance",
    ],
    instructors: [
      { name: "Dr. Prakash Joshi", role: "Management Expert" },
      { name: "Rajan Shrestha", role: "IT & Business" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(coursesData).map((slug) => ({ slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = coursesData[slug];

  if (!course) {
    notFound();
  }

  const discount = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Small className="text-primary mb-2">{course.title} Entrance Preparation</Small>
              <Title className="mb-4">{course.fullName}</Title>
              <Paragraph className="text-lg text-muted-foreground mb-6">
                {course.description}
              </Paragraph>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">
                    ({course.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
              </div>

              {/* Instructors */}
              <div className="flex flex-wrap gap-4">
                {course.instructors.map((instructor) => (
                  <div
                    key={instructor.name}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {instructor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <Paragraph className="text-sm font-medium">
                        {instructor.name}
                      </Paragraph>
                      <Small className="text-muted-foreground">
                        {instructor.role}
                      </Small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="lg:sticky lg:top-8 h-fit">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl font-bold">
                      Rs. {course.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      Rs. {course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {discount}% off
                  </span>
                </div>

                <Button className="w-full mb-3" size="lg">
                  Enroll Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Try Free Demo
                </Button>

                <div className="mt-6 space-y-3">
                  <Subtitle as="h4" className="text-sm">
                    This course includes:
                  </Subtitle>
                  {course.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="lg:w-2/3">
            <Subtitle className="mb-6">Course Syllabus</Subtitle>
            <div className="space-y-4">
              {course.syllabus.map((module, index) => (
                <Card key={module.module}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                      {module.module}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-2 pl-11">
                      {module.topics.map((topic) => (
                        <div
                          key={topic}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <BookOpen className="w-4 h-4" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Ready to Start Your Preparation?</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Join thousands of students who have successfully prepared with us
              and secured admissions in top colleges.
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
