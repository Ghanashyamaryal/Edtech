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
  ArrowRight,
} from "lucide-react";

const helpCategories = [
  {
    icon: User,
    title: "Account & Profile",
    description: "Manage your account settings, password, and profile information.",
    href: "/help/account",
  },
  {
    icon: BookOpen,
    title: "Courses & Enrollment",
    description: "Learn how to browse, enroll, and access your courses.",
    href: "/help/courses",
  },
  {
    icon: CreditCard,
    title: "Payments & Billing",
    description: "Payment methods, invoices, and subscription management.",
    href: "/help/billing",
  },
  {
    icon: Video,
    title: "Live Classes",
    description: "Join live sessions, recordings, and technical requirements.",
    href: "/help/live-classes",
  },
  {
    icon: FileText,
    title: "Study Materials",
    description: "Download notes, access resources, and study guides.",
    href: "/help/materials",
  },
  {
    icon: HelpCircle,
    title: "Technical Support",
    description: "Troubleshooting common issues and technical problems.",
    href: "/support",
  },
];

const popularArticles = [
  { title: "How to reset your password", href: "/help/reset-password" },
  { title: "Enrolling in a new course", href: "/help/enroll-course" },
  { title: "Accessing course materials", href: "/help/access-materials" },
  { title: "Payment methods accepted", href: "/help/payment-methods" },
  { title: "Joining live classes", href: "/help/join-live-class" },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Help Center</Title>
            <Paragraph className="text-lg text-muted-foreground mb-6">
              Find answers to your questions and learn how to get the most out
              of Entrance Pathway.
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-8">Browse by Category</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
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

      {/* Popular Articles */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Subtitle className="text-center mb-8">Popular Articles</Subtitle>
            <div className="space-y-3">
              {popularArticles.map((article) => (
                <Link
                  key={article.title}
                  href={article.href}
                  className="flex items-center justify-between p-4 bg-background rounded-lg hover:shadow-md transition-shadow"
                >
                  <Paragraph>{article.title}</Paragraph>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
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
