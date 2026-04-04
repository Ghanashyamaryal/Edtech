"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { RHFInput, RHFTextarea } from "@/components/atoms/rhf-components";
import { Button, Card, CardContent } from "@/components/ui";
import { Mail, Phone, MapPin, Clock, CheckCircle, Loader2 } from "lucide-react";
import { getContactInfo, submitContactMessage, type ContactInfo } from "@/actions/site-settings";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ICON_MAP = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  workingHours: Clock,
} as const;

function buildContactItems(info: ContactInfo) {
  return [
    {
      key: "email" as const,
      title: "Email",
      value: info.email,
      href: `mailto:${info.email}`,
    },
    {
      key: "phone" as const,
      title: "Phone",
      value: info.phone,
      href: `tel:${info.phone.replace(/\s/g, "")}`,
    },
    {
      key: "address" as const,
      title: "Address",
      value: info.address,
      href: null,
    },
    {
      key: "workingHours" as const,
      title: "Working Hours",
      value: info.workingHours,
      href: null,
    },
  ];
}

export default function ContactPage() {
  const [contactInfo, setContactInfo] = React.useState<ContactInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  React.useEffect(() => {
    async function load() {
      const result = await getContactInfo();
      if (result.success) {
        setContactInfo(result.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitContactMessage(data);

    if (result.success) {
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setSubmitError(result.error);
    }

    setSubmitting(false);
  };

  const contactItems = contactInfo ? buildContactItems(contactInfo) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              <Mail className="w-4 h-4" />
              Get in Touch
            </span>
            <Title className="mb-4">Contact Us</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Have questions or need support? We&apos;d love to hear from you. Send us a message and
              our team will respond as soon as possible.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 lg:py-16 bg-background">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="rounded-2xl border-border/60 shadow-medium overflow-hidden">
              <CardContent className="p-8">
                <Subtitle className="mb-6">Send us a Message</Subtitle>

                {submitted && (
                  <div className="flex items-center gap-2 p-4 mb-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">Your message has been sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <RHFInput name="name" control={control} label="Your Name" placeholder="John Doe" />
                    <RHFInput
                      name="email"
                      control={control}
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                  <RHFInput
                    name="subject"
                    control={control}
                    label="Subject"
                    placeholder="How can we help?"
                  />
                  <RHFTextarea
                    name="message"
                    control={control}
                    label="Message"
                    placeholder="Your message details..."
                    className="min-h-[150px]"
                  />
                  <Button type="submit" className="w-full py-6 text-base font-semibold shadow-glow-brand" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div>
              <Subtitle className="mb-6">Get in Touch</Subtitle>
              <div className="space-y-6">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 -m-4">
                      <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
                      <div className="flex-1">
                        <div className="h-5 w-20 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : (
                  contactItems.map((item) => {
                    const Icon = ICON_MAP[item.key];
                    const content = (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                          <Subtitle as="h3" className="text-base mb-1">
                            {item.title}
                          </Subtitle>
                          <Paragraph className="text-muted-foreground">
                            {item.value}
                          </Paragraph>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a
                        key={item.key}
                        href={item.href}
                        className="block group hover:bg-muted/30 p-4 -m-4 rounded-lg transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.key} className="group p-4 -m-4">
                        {content}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Map */}
              <div className="mt-8 bg-muted/30 rounded-xl h-64 flex items-center justify-center overflow-hidden">
                {contactInfo?.mapUrl ? (
                  <iframe
                    src={contactInfo.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location map"
                  />
                ) : (
                  <Paragraph className="text-muted-foreground">
                    Map coming soon
                  </Paragraph>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
