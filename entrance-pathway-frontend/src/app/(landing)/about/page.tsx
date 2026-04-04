import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent } from "@/components/ui";
import { GraduationCap, Users, Target, Award } from "lucide-react";

const stats = [
  { label: "Students Enrolled", value: "10,000+" },
  { label: "Success Rate", value: "95%" },
  { label: "Expert Mentors", value: "50+" },
  { label: "Courses Available", value: "20+" },
];

const values = [
  {
    icon: GraduationCap,
    title: "Quality Education",
    description:
      "We provide high-quality education materials and courses designed by experts in the field.",
  },
  {
    icon: Users,
    title: "Student-Centric",
    description:
      "Our approach puts students first, ensuring personalized learning experiences for everyone.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description:
      "We focus on helping students achieve their goals with structured learning paths.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in everything we do, from content creation to student support.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">About ITpro Entrance</Title>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Empowering Students
            </span>
            <Title className="mb-4">About ITpro Entrance</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Nepal's leading platform for IT entrance exam preparation. We're
              dedicated to helping students achieve their dreams of pursuing IT
              education in top universities.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 lg:py-16 border-y border-border/50">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-left group">
                <div className="text-4xl lg:text-5xl font-bold text-brand-primary mb-2 flex items-center gap-2">
                  {stat.value}
                  <div className="w-2 h-2 rounded-full bg-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <Paragraph className="text-muted-foreground font-medium">
                  {stat.label}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left">
            <Subtitle className="mb-4">Our Mission</Subtitle>
            <Paragraph className="text-lg">
              To democratize IT education in Nepal by providing accessible,
              affordable, and high-quality entrance exam preparation resources
              to students across the country. We believe every student deserves
              the opportunity to succeed.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left mb-12">
            <Subtitle className="mb-4">Our Values</Subtitle>
            <Paragraph className="text-muted-foreground">
              Our core principles guide every decision we make and every course we build.
            </Paragraph>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="group hover:shadow-medium transition-all duration-300 border-border/60">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <Subtitle as="h3" className="text-lg mb-2 group-hover:text-brand-primary transition-colors">
                      {value.title}
                    </Subtitle>
                    <Paragraph className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </Paragraph>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left">
            <Subtitle className="text-left mb-8">Our Story</Subtitle>
            <div className="space-y-4">
              <Paragraph>
                ITpro Entrance was founded with a simple yet powerful vision:
                to make quality IT entrance exam preparation accessible to every
                student in Nepal, regardless of their location or background.
              </Paragraph>
              <Paragraph className="leading-relaxed">
                What started as a small initiative by a group of passionate
                educators has grown into Nepal's most trusted platform for IT
                entrance preparation. Today, we serve thousands of students
                annually, helping them achieve their dreams of pursuing careers
                in technology.
              </Paragraph>
              <Paragraph className="leading-relaxed">
                Our team of experienced educators, industry professionals, and
                technology experts work tirelessly to create comprehensive study
                materials, conduct live classes, and provide personalized
                mentorship to our students.
              </Paragraph>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
