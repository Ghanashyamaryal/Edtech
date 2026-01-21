import { Title, Subtitle, Paragraph } from "@/components/atoms";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using Entrance Pathway's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: "Use of Services",
    content: `You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:
• Use the services in any way that violates applicable laws
• Impersonate any person or entity
• Interfere with or disrupt the services
• Attempt to gain unauthorized access to any part of the services
• Use the services for any commercial purpose without our consent`,
  },
  {
    title: "User Accounts",
    content: `When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.

You must notify us immediately of any unauthorized use of your account or any other breach of security.`,
  },
  {
    title: "Payment Terms",
    content: `Certain services require payment. By purchasing a course or subscription, you agree to pay all applicable fees. All payments are non-refundable unless otherwise stated or required by law.

We reserve the right to change our prices at any time. Price changes will not affect purchases already made.`,
  },
  {
    title: "Intellectual Property",
    content: `All content on our platform, including courses, videos, text, graphics, and logos, is the property of Entrance Pathway or its content suppliers and is protected by intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from our content without our express written permission.`,
  },
  {
    title: "User Content",
    content: `You retain ownership of any content you submit to our platform. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute your content in connection with our services.`,
  },
  {
    title: "Disclaimers",
    content: `Our services are provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted, secure, or error-free.

We are not responsible for the accuracy of educational content or for any outcomes resulting from the use of our services.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, Entrance Pathway shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.`,
  },
  {
    title: "Termination",
    content: `We may terminate or suspend your account and access to our services at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.`,
  },
  {
    title: "Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of our services after changes constitutes acceptance of the new Terms.`,
  },
  {
    title: "Contact Information",
    content: `If you have any questions about these Terms, please contact us at legal@entrancepathway.com.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Terms of Service</Title>
            <Paragraph className="text-muted-foreground">
              Last updated: January 2026
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Paragraph className="mb-8">
              Welcome to Entrance Pathway. These Terms of Service govern your
              use of our website and services. Please read them carefully.
            </Paragraph>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.title}>
                  <Subtitle as="h2" className="mb-4">
                    {section.title}
                  </Subtitle>
                  <Paragraph className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
