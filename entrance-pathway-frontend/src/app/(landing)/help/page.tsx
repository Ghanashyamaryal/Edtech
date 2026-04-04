import Link from "next/link";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  BookOpen,
  CreditCard,
  User,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react";

const helpCategories = [
  {
    icon: BookOpen,
    title: "Courses",
    description: "Browse available courses and start your preparation journey.",
    href: "/courses",
  },
  {
    icon: FileText,
    title: "Study Notes",
    description: "Download notes, formula sheets, and study materials.",
    href: "/notes",
  },
  {
    icon: Video,
    title: "Online Classes",
    description: "Join live sessions and access recorded lectures.",
    href: "/online-classes",
  },
  {
    icon: HelpCircle,
    title: "Mock Tests",
    description: "Practice with realistic mock tests to boost your confidence.",
    href: "/mock-tests",
  },
  {
    icon: User,
    title: "FAQs",
    description: "Find answers to frequently asked questions.",
    href: "/faqs",
  },
  {
    icon: CreditCard,
    title: "Contact Support",
    description: "Get in touch with our team for any issues or queries.",
    href: "/support",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-accent to-background py-12 md:py-20 pt-24 md:pt-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Help Center</Title>
            <Paragraph className="text-lg text-muted-foreground mb-6">
              Find answers to your questions and learn how to get the most out
              of ITpro Entrance.
            </Paragraph>
            {/* Search placeholder */}
            <div className="max-w-md mx-auto bg-background rounded-lg shadow-sm p-2">
              <input
                type="search"
                placeholder="Search for help..."
                className="w-full px-4 py-2 bg-transparent border-0 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-8">Browse by Category</Subtitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="h-full hover:shadow-medium transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Paragraph className="text-muted-foreground">
                        {category.description}
                      </Paragraph>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Still Need Help?</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to
              help you.
            </Paragraph>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faqs">View FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
