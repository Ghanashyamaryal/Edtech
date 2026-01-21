import Link from "next/link";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";

const openings = [
  {
    title: "Senior Content Developer",
    department: "Content",
    location: "Kathmandu, Nepal",
    type: "Full-time",
    description:
      "Create high-quality educational content for IT entrance exams.",
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build and maintain our web platform using React and Next.js.",
  },
  {
    title: "Student Success Manager",
    department: "Operations",
    location: "Kathmandu, Nepal",
    type: "Full-time",
    description: "Help students achieve their goals through personalized support.",
  },
  {
    title: "Video Editor",
    department: "Content",
    location: "Remote",
    type: "Part-time",
    description: "Edit and produce educational video content for our courses.",
  },
];

const benefits = [
  "Competitive salary and benefits",
  "Flexible working hours",
  "Remote work options",
  "Professional development opportunities",
  "Health insurance",
  "Paid time off",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Join Our Team</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Help us transform education in Nepal. We're looking for passionate
              individuals who want to make a difference.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-8">Why Work With Us</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <Paragraph>{benefit}</Paragraph>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-8">Open Positions</Subtitle>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {openings.map((job) => (
              <Card key={job.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Paragraph className="text-muted-foreground mb-4">
                    {job.description}
                  </Paragraph>
                  <Button variant="outline" size="sm">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Don't See a Perfect Fit?</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              We're always looking for talented individuals. Send us your resume
              and we'll keep you in mind for future opportunities.
            </Paragraph>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
