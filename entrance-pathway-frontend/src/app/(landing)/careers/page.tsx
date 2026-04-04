import Link from "next/link";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { MapPin, Clock, Briefcase, ArrowRight, GraduationCap, Heart, Calendar } from "lucide-react";

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
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              Join Our Mission
            </span>
            <Title className="mb-4">Join Our Team</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Help us transform education in Nepal. We&apos;re looking for passionate
              individuals who want to make a difference in the lives of thousands
              of students.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <Subtitle className="text-left mb-10">Why Work With Us</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, text: "Competitive salary and benefits" },
              { icon: Clock, text: "Flexible working hours" },
              { icon: MapPin, text: "Remote work options" },
              { icon: GraduationCap, text: "Professional development" },
              { icon: Heart, text: "Health insurance" },
              { icon: Calendar, text: "Paid time off" },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-5 bg-muted/40 rounded-xl border border-transparent hover:border-brand-primary/20 hover:bg-white transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 text-brand-primary" />
                </div>
                <Paragraph className="font-medium">{item.text}</Paragraph>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left mb-10">
            <Subtitle className="mb-4">Open Positions</Subtitle>
            <Paragraph className="text-muted-foreground">
              Find the perfect role that matches your skills and passion.
            </Paragraph>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {openings.map((job) => (
              <Card key={job.title} className="group hover:shadow-medium transition-all duration-300 border-border/60">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl group-hover:text-brand-primary transition-colors">{job.title}</CardTitle>
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-brand-primary/70" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-primary/70" />
                      {job.location}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Paragraph className="text-muted-foreground mb-6 line-clamp-2">
                    {job.description}
                  </Paragraph>
                  <Button variant="outline" className="group-hover:bg-brand-primary group-hover:text-white transition-all w-full sm:w-auto">
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
      <section className="py-10 lg:py-16">
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
