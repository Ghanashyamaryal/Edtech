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
    value: "info@entrancepathway.com",
    href: "mailto:info@entrancepathway.com",
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
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Contact Us</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardContent className="pt-6">
                <Subtitle className="mb-6">Send us a Message</Subtitle>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <RHFInput name="name" control={control} label="Your Name" />
                  <RHFInput
                    name="email"
                    control={control}
                    label="Email Address"
                    type="email"
                  />
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
                    placeholder="Your message..."
                    className="min-h-[120px]"
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div>
              <Subtitle className="mb-6">Get in Touch</Subtitle>
              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
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
                      key={item.title}
                      href={item.href}
                      className="block hover:bg-muted/30 p-4 -m-4 rounded-lg transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.title} className="p-4 -m-4">
                      {content}
                    </div>
                  );
                })}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                <Paragraph className="text-muted-foreground">
                  Map coming soon
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
