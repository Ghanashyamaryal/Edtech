import { Title, Subtitle, Paragraph } from "@/components/atoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const cookieTypes = [
  {
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure areas access, and remembering your login status.",
    examples: ["Session cookies", "Authentication cookies", "Security cookies"],
    canDisable: false,
  },
  {
    title: "Functional Cookies",
    description:
      "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.",
    examples: [
      "Language preferences",
      "Video player settings",
      "User preferences",
    ],
    canDisable: true,
  },
  {
    title: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
    examples: [
      "Google Analytics",
      "Page view tracking",
      "User behavior analysis",
    ],
    canDisable: true,
  },
  {
    title: "Marketing Cookies",
    description:
      "These cookies are used to track visitors across websites to display relevant advertisements.",
    examples: [
      "Advertising cookies",
      "Social media cookies",
      "Remarketing cookies",
    ],
    canDisable: true,
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    content:
      "Cookies are small text files that are stored on your device when you visit a website. They help the website remember your preferences and improve your browsing experience.",
  },
  {
    title: "How We Use Cookies",
    content:
      "We use cookies to understand how you use our platform, remember your preferences, provide personalized content, and improve our services. We also use cookies for analytics and, with your consent, for marketing purposes.",
  },
  {
    title: "Third-Party Cookies",
    content:
      "Some cookies on our website are set by third-party services that appear on our pages. We do not control these cookies and you should check the third-party websites for more information about their cookies.",
  },
  {
    title: "Managing Cookies",
    content:
      "You can control and manage cookies in various ways. Most browsers allow you to refuse or delete cookies through their settings. Please note that removing or blocking cookies may impact your user experience and some features may not function properly.",
  },
  {
    title: "Cookie Retention",
    content:
      "The length of time a cookie remains on your device depends on whether it is a 'persistent' or 'session' cookie. Session cookies are deleted when you close your browser, while persistent cookies remain until they expire or are deleted.",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Title className="mb-4">Cookie Policy</Title>
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
              This Cookie Policy explains how Entrance Pathway uses cookies and
              similar technologies to recognize you when you visit our platform.
              It explains what these technologies are and why we use them, as
              well as your rights to control our use of them.
            </Paragraph>

            {/* General Sections */}
            <div className="space-y-8 mb-12">
              {sections.map((section) => (
                <div key={section.title}>
                  <Subtitle as="h2" className="mb-4">
                    {section.title}
                  </Subtitle>
                  <Paragraph className="text-muted-foreground">
                    {section.content}
                  </Paragraph>
                </div>
              ))}
            </div>

            {/* Cookie Types */}
            <Subtitle as="h2" className="mb-6">
              Types of Cookies We Use
            </Subtitle>
            <div className="space-y-4">
              {cookieTypes.map((cookie) => (
                <Card key={cookie.title}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cookie.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          cookie.canDisable
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {cookie.canDisable ? "Optional" : "Required"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Paragraph className="text-muted-foreground mb-3">
                      {cookie.description}
                    </Paragraph>
                    <div className="flex flex-wrap gap-2">
                      {cookie.examples.map((example) => (
                        <span
                          key={example}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-12 p-6 bg-muted/30 rounded-lg">
              <Subtitle as="h2" className="mb-4">
                Questions About Cookies?
              </Subtitle>
              <Paragraph className="text-muted-foreground">
                If you have any questions about our use of cookies or other
                technologies, please email us at{" "}
                <a
                  href="mailto:privacy@entrancepathway.com"
                  className="text-primary hover:underline"
                >
                  privacy@entrancepathway.com
                </a>
                .
              </Paragraph>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
