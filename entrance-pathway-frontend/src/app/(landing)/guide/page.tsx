import Link from "next/link";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  UserPlus,
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up for free and complete your profile to get personalized recommendations.",
    tips: [
      "Use a valid email address for account verification",
      "Create a strong password",
      "Complete your profile for personalized content",
    ],
  },
  {
    step: 2,
    icon: BookOpen,
    title: "Choose Your Course",
    description:
      "Browse our courses and select the entrance exam you're preparing for.",
    tips: [
      "Read course descriptions carefully",
      "Check the syllabus coverage",
      "Look at student reviews and ratings",
    ],
  },
  {
    step: 3,
    icon: Video,
    title: "Watch Video Lectures",
    description:
      "Access high-quality video lectures taught by experienced instructors.",
    tips: [
      "Take notes while watching",
      "Pause and rewind as needed",
      "Complete each module before moving on",
    ],
  },
  {
    step: 4,
    icon: FileText,
    title: "Study the Materials",
    description:
      "Download and study comprehensive notes and reference materials.",
    tips: [
      "Review notes regularly",
      "Highlight important concepts",
      "Create your own summary notes",
    ],
  },
  {
    step: 5,
    icon: CheckCircle,
    title: "Practice with Mock Tests",
    description:
      "Test your knowledge with practice questions and full-length mock tests.",
    tips: [
      "Simulate exam conditions",
      "Review wrong answers carefully",
      "Track your progress over time",
    ],
  },
  {
    step: 6,
    icon: Trophy,
    title: "Achieve Success",
    description:
      "Apply what you've learned and ace your entrance exam with confidence!",
    tips: [
      "Stay consistent with your preparation",
      "Join live doubt-clearing sessions",
      "Stay positive and confident",
    ],
  },
];

const quickLinks = [
  { title: "How to enroll in a course", href: "/help/enroll-course" },
  { title: "Joining live classes", href: "/help/join-live-class" },
  { title: "Downloading study materials", href: "/help/download-materials" },
  { title: "Taking mock tests", href: "/help/mock-tests" },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Student Guide</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Everything you need to know to make the most of your learning
              journey with Entrance Pathway.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-12">Getting Started</Subtitle>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-full bg-border -z-10" />
                    )}
                    <Card>
                      <CardHeader className="flex flex-row items-start gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Step {step.step}
                          </div>
                          <CardTitle>{step.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pl-20">
                        <Paragraph className="text-muted-foreground mb-4">
                          {step.description}
                        </Paragraph>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <Paragraph className="font-medium text-sm mb-2">
                            Tips:
                          </Paragraph>
                          <ul className="space-y-1">
                            {step.tips.map((tip) => (
                              <li
                                key={tip}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-primary mt-1">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Subtitle className="text-center mb-8">Quick Links</Subtitle>
            <div className="grid md:grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
                >
                  <Paragraph>{link.title}</Paragraph>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Ready to Start?</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Join thousands of students who are already preparing for their
              entrance exams with us.
            </Paragraph>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
