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
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">About Entrance Pathway</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Nepal's leading platform for IT entrance exam preparation. We're
              dedicated to helping students achieve their dreams of pursuing IT
              education.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <Paragraph className="text-muted-foreground">
                  {stat.label}
                </Paragraph>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-12">Our Values</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Subtitle as="h3" className="mb-2">
                      {value.title}
                    </Subtitle>
                    <Paragraph className="text-muted-foreground">
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Subtitle className="text-center mb-8">Our Story</Subtitle>
            <div className="space-y-4">
              <Paragraph>
                Entrance Pathway was founded with a simple yet powerful vision:
                to make quality IT entrance exam preparation accessible to every
                student in Nepal, regardless of their location or background.
              </Paragraph>
              <Paragraph>
                What started as a small initiative by a group of passionate
                educators has grown into Nepal's most trusted platform for IT
                entrance preparation. Today, we serve thousands of students
                annually, helping them achieve their dreams of pursuing careers
                in technology.
              </Paragraph>
              <Paragraph>
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
