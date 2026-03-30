import { LandingHeader, LandingFooter } from "@/components/organisms/landing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "IT Pro Entrance",
  url: "https://itpro-entrance.com",
  description:
    "Nepal's leading IT entrance exam preparation platform for BIT, BCA, BSc CSIT, and BIM.",
  sameAs: [],
  offers: {
    "@type": "Offer",
    category: "IT Entrance Exam Preparation",
  },
  areaServed: {
    "@type": "Country",
    name: "Nepal",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <LandingFooter />
    </div>
  );
}
