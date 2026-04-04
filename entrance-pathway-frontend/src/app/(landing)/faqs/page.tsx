import {
  Title,
  Subtitle,
  Paragraph,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/atoms";
import { Button } from "@/components/ui";
import Link from "next/link";

const faqCategories = [
  {
    category: "General",
    questions: [
      {
        question: "What is ITpro Entrance?",
        answer:
          "ITpro Entrance is Nepal's leading platform for IT entrance exam preparation. We provide comprehensive courses, study materials, mock tests, and live classes to help students prepare for entrance exams like BSc CSIT, BIT, BCA, and BIM.",
      },
      {
        question: "Who can use ITpro Entrance?",
        answer:
          "Anyone preparing for IT entrance exams in Nepal can use our platform. Whether you're a +2 student, a graduate, or someone looking to pursue IT education, our courses are designed for all levels.",
      },
      {
        question: "How do I create an account?",
        answer:
          "Click on the 'Sign Up' button on the top right corner of the homepage. Fill in your details, verify your email, and you're ready to start learning!",
      },
    ],
  },
  {
    category: "Courses",
    questions: [
      {
        question: "What courses do you offer?",
        answer:
          "We offer preparation courses for BSc CSIT, BIT, BCA, BIM, and other IT-related entrance exams. Each course includes video lectures, study notes, practice questions, and mock tests.",
      },
      {
        question: "How long do I have access to a course?",
        answer:
          "Once you enroll in a course, you typically have access for one year from the date of enrollment. Some courses may have different access periods, which will be clearly mentioned on the course page.",
      },
      {
        question: "Can I download course materials?",
        answer:
          "Yes, study notes and PDF materials can be downloaded for offline access. However, video lectures can only be streamed through our platform.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept eSewa, Khalti, bank transfers, and credit/debit cards. All transactions are secure and encrypted.",
      },
      {
        question: "Is there a refund policy?",
        answer:
          "Yes, we offer a 7-day money-back guarantee for most courses. If you're not satisfied with a course, you can request a refund within 7 days of purchase.",
      },
      {
        question: "Do you offer discounts or scholarships?",
        answer:
          "Yes, we regularly offer discounts during special occasions. We also have a scholarship program for deserving students. Contact our support team to learn more.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        question: "What devices can I use to access courses?",
        answer:
          "You can access our platform on any device with a web browser - desktop, laptop, tablet, or smartphone. We also have mobile apps for iOS and Android (coming soon).",
      },
      {
        question: "What internet speed do I need for video lectures?",
        answer:
          "We recommend a minimum of 2 Mbps for smooth video playback. Our videos are available in multiple quality settings to accommodate different internet speeds.",
      },
      {
        question: "I'm having trouble logging in. What should I do?",
        answer:
          "First, try resetting your password using the 'Forgot Password' link. If the issue persists, clear your browser cache and cookies. If you still can't log in, contact our support team.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-brand-primary/5 to-background pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-6">
              Assistance Center
            </span>
            <Title className="mb-4">Frequently Asked Questions</Title>
            <Paragraph className="text-lg text-muted-foreground">
              Find answers to common questions about ITpro Entrance.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 lg:py-12">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-3xl text-left space-y-12">
            {faqCategories.map((category) => (
              <div key={category.category}>
                <Subtitle className="text-left mb-6">{category.category}</Subtitle>
                <Accordion
                  type="single"
                  collapsible
                  className="bg-background rounded-xl border"
                >
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`${category.category}-${index}`}
                      className="last:border-0"
                    >
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-10 lg:py-16 bg-muted/30">
        <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
          <div className="max-w-2xl text-left">
            <Subtitle className="mb-4">Still Have Questions?</Subtitle>
            <Paragraph className="text-muted-foreground mb-8">
              Can&apos;t find the answer you&apos;re looking for? Reach out to our
              friendly support team and we&apos;ll get back to you shortly.
            </Paragraph>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
