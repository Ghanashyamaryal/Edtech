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
    availability: "support@entrancepathway.com",
    action: "Send Email",
    href: "mailto:support@entrancepathway.com",
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
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Technical Support</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Experiencing issues? We're here to help you get back on track with
              your learning.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Subtitle className="text-center mb-8">Contact Options</Subtitle>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Subtitle as="h3" className="mb-2">
                      {channel.title}
                    </Subtitle>
                    <Paragraph className="text-muted-foreground mb-2">
                      {channel.description}
                    </Paragraph>
                    <Paragraph className="text-sm text-primary mb-4">
                      {channel.availability}
                    </Paragraph>
                    <Button variant="outline" asChild className="w-full">
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
      <section className="py-16 bg-muted/30">
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
      <section className="py-16">
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
