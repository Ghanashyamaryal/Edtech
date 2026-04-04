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
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              Assistance Center
            </span>
            <Title className="mb-4">Help Center</Title>
            <Paragraph className="text-lg text-muted-foreground mb-8">
              Find answers to your questions and learn how to get the most out
              of ITpro Entrance.
            </Paragraph>
            {/* Search placeholder */}
            <div className="max-w-md mx-auto bg-background rounded-2xl border border-border/60 shadow-sm p-1.5 flex items-center group focus-within:border-brand-primary/50 transition-colors">
              <input
                type="search"
                placeholder="Search for help..."
                className="w-full px-4 py-2.5 bg-transparent border-0 focus:outline-none text-sm"
              />
              <Button size="sm" className="bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <Subtitle className="text-left mb-8">Browse by Category</Subtitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} href={category.href}>
                  <Card className="h-full group hover:shadow-medium transition-all duration-300 border-border/60">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-brand-primary" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-brand-primary transition-colors">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Paragraph className="text-sm text-muted-foreground leading-relaxed">
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
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left">
            <Subtitle className="mb-8">Popular Articles</Subtitle>
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
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-2xl text-left">
            <Subtitle className="mb-4">Still Need Help?</Subtitle>
            <Paragraph className="text-muted-foreground mb-8">
              Can&apos;t find what you&apos;re looking for? Our support team is here to
              help you every step of the way.
            </Paragraph>
            <div className="flex flex-wrap gap-4">
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
