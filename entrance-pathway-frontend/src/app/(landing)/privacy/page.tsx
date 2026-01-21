import { Title, Subtitle, Paragraph } from "@/components/atoms";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include your name, email address, phone number, and payment information.

We also automatically collect certain information when you use our platform, including your IP address, browser type, device information, and usage data.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Personalize and improve your experience`,
  },
  {
    title: "Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
• Service providers who assist in our operations
• Professional advisors such as lawyers and accountants
• Government authorities when required by law`,
  },
  {
    title: "Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to:
• Access your personal information
• Correct inaccurate information
• Request deletion of your information
• Opt-out of marketing communications
• Data portability where applicable`,
  },
  {
    title: "Cookies",
    content: `We use cookies and similar tracking technologies to collect and track information about your use of our services. You can control cookies through your browser settings.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at privacy@entrancepathway.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Privacy Policy</Title>
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
              At Entrance Pathway, we are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our platform.
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
