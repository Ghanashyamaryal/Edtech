"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { PaymentQr } from "@/components/molecules/payment-qr";
import { Title, Paragraph, Small } from "@/components/atoms";
import { BookOpen, Check } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { PREMIUM_NOTES_PRICE_NPR, formatNpr } from "@/lib/pricing";

const PERKS = [
  "Access every premium subject note",
  "Formula sheets & cheat sheets",
  "Solved past-paper PDFs",
  "Lifetime download access",
];

export default function PricingPage() {
  const { user } = useAuth();
  const amountLabel = formatNpr(PREMIUM_NOTES_PRICE_NPR);

  const fullName = user?.full_name || "";
  const email = user?.email || "";
  const whatsappMessage = `Hi, I've sent the payment of ${amountLabel} for Premium Notes Access.${
    fullName ? ` Name: ${fullName}.` : ""
  }${email ? ` Email: ${email}.` : ""}`;

  return (
    <section className="py-12 lg:py-20">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="text-center mb-10">
          <Title className="text-3xl md:text-4xl">Premium Notes Access</Title>
          <Paragraph className="mt-2 max-w-2xl mx-auto">
            One flat price. Lifetime access to every premium note, formula sheet,
            and solved past-paper on the platform.
          </Paragraph>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Plan summary */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <CardTitle className="text-xl">Premium Notes</CardTitle>
                  <Small className="text-gray-500">Lifetime access</Small>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-bold text-foreground">
                  {amountLabel}
                </span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-sm text-foreground">{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Payment / QR */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Pay & get access</CardTitle>
              <Small className="text-gray-500">
                Send payment via the QR, then ping us on WhatsApp with a screenshot.
                We&apos;ll grant access within a few hours.
              </Small>
            </CardHeader>
            <CardContent className="flex-1">
              <PaymentQr
                amountLabel={amountLabel}
                whatsappMessage={whatsappMessage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
