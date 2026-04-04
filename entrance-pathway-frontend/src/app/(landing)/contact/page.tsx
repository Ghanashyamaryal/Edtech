"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { RHFInput, RHFTextarea } from "@/components/atoms/rhf-components";
import { Button, Card, CardContent } from "@/components/ui";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@itproentrance.com",
    href: "mailto:info@itproentrance.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+977 9860120739",
    href: "tel:+9779860120739",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Kathmandu, Nepal",
    href: null,
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Sun - Fri: 9AM - 6PM",
    href: null,
  },
];

export default function ContactPage() {
  const { control, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log(data);
    // Handle form submission
    reset();
  };

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
                  <Button type="submit" className="w-full py-6 text-base font-semibold shadow-glow-brand">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="flex flex-col justify-center">
              <Subtitle className="mb-8">Contact Information</Subtitle>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <Card key={item.title} className="group hover:bg-muted/30 transition-colors border-border/40 text-left">
                      <CardContent className="p-5">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5 text-brand-primary" />
                        </div>
                        <Subtitle as="h3" className="text-base mb-1">
                          {item.title}
                        </Subtitle>
                        <Paragraph className="text-sm text-muted-foreground break-all">
                          {item.value}
                        </Paragraph>
                      </CardContent>
                    </Card>
                  );

                  return item.href ? (
                    <a
                      key={item.title}
                      href={item.href}
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.title}>
                      {content}
                    </div>
                  );
                })}
              </div>

              {/* Map Placeholder */}
              <div className="relative rounded-2xl overflow-hidden bg-muted/40 h-48 flex items-center justify-center border-2 border-dashed border-border/60">
                <div className="text-center group cursor-default">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2 group-hover:text-brand-primary transition-colors" />
                  <Paragraph className="text-muted-foreground font-medium text-sm">
                    Kathmandu, Nepal
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
