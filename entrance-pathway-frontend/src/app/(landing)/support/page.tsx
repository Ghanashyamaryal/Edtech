"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { RHFInput, RHFTextarea, RHFSelect } from "@/components/atoms/rhf-components";
import { Button, Card, CardContent } from "@/components/ui";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

const supportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Please provide more details (at least 20 characters)"),
});

type SupportFormData = z.infer<typeof supportSchema>;

const categoryOptions = [
  { value: "account", label: "Account Issues" },
  { value: "payment", label: "Payment & Billing" },
  { value: "course", label: "Course Access" },
  { value: "technical", label: "Technical Problems" },
  { value: "other", label: "Other" },
];

const supportChannels = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support team in real-time.",
    availability: "Available 9 AM - 6 PM",
    action: "Start Chat",
    href: "#",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team.",
    availability: "+977 980-0000-000",
    action: "Call Now",
    href: "tel:+9779800000000",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours.",
    availability: "support@itproentrance.com",
    action: "Send Email",
    href: "mailto:support@itproentrance.com",
  },
];

export default function SupportPage() {
  const { control, handleSubmit, reset } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data: SupportFormData) => {
    console.log(data);
    // Handle form submission
    reset();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              Customer Support
            </span>
            <Title className="mb-4">Technical Support</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Experiencing issues? We&apos;re here to help you get back on track with
              your learning. Our team usually responds within 2-4 hours.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-10 lg:py-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <Subtitle className="text-left mb-8">Contact Options</Subtitle>
          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.title} className="group hover:shadow-medium transition-all duration-300 border-border/60">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <Subtitle as="h3" className="text-left mb-2 text-lg">
                      {channel.title}
                    </Subtitle>
                    <Paragraph className="text-left text-muted-foreground text-sm mb-4 leading-relaxed">
                      {channel.description}
                    </Paragraph>
                    <Paragraph className="text-left text-xs font-semibold text-brand-primary mb-6">
                      {channel.availability}
                    </Paragraph>
                    <Button variant="outline" asChild className="w-full rounded-xl">
                      <a href={channel.href}>{channel.action}</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Subtitle className="text-center mb-2">Submit a Support Ticket</Subtitle>
            <Paragraph className="text-center text-muted-foreground mb-8">
              Fill out the form below and our team will get back to you as soon
              as possible.
            </Paragraph>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <RHFInput
                      name="name"
                      control={control}
                      label="Your Name"
                      placeholder="John Doe"
                    />
                    <RHFInput
                      name="email"
                      control={control}
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>
                  <RHFSelect
                    name="category"
                    control={control}
                    label="Issue Category"
                    placeholder="Select a category"
                    options={categoryOptions}
                  />
                  <RHFInput
                    name="subject"
                    control={control}
                    label="Subject"
                    placeholder="Brief description of your issue"
                  />
                  <RHFTextarea
                    name="description"
                    control={control}
                    label="Description"
                    placeholder="Please describe your issue in detail..."
                    className="min-h-[150px]"
                  />
                  <Button type="submit" className="w-full">
                    Submit Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Average response time: 2-4 hours during business hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Subtitle className="mb-4">Self-Help Resources</Subtitle>
            <Paragraph className="text-muted-foreground mb-6">
              Many common issues can be resolved using our help resources.
            </Paragraph>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/help">Help Center</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faqs">FAQs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/guide">Student Guide</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
