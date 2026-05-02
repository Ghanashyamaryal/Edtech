"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { RHFInput } from "@/components/atoms/rhf-components";
import { Paragraph, Small } from "@/components/atoms";
import { signupPaymentSchema, type SignupPaymentFormData } from "@/utils/validation";
import { MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "+977-9760120739";
const WHATSAPP_LINK_NUMBER = "9779760120739";

interface PaymentStepProps {
  initialValues: SignupPaymentFormData;
  fullName: string;
  courseTitle: string;
  email: string;
  onNext: (data: SignupPaymentFormData) => void;
  onBack: () => void;
}

export function PaymentStep({
  initialValues,
  fullName,
  courseTitle,
  email,
  onNext,
  onBack,
}: PaymentStepProps) {
  const { control, handleSubmit } = useForm<SignupPaymentFormData>({
    resolver: zodResolver(signupPaymentSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const whatsappMessage = encodeURIComponent(
    `Hi, I've sent the payment for course "${courseTitle}". Name: ${fullName}, Email: ${email}.`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${whatsappMessage}`;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="text-center space-y-1">
        <Paragraph className="font-semibold text-gray-900">
          Please send the course fee through this QR
        </Paragraph>
        <Small className="text-gray-500">Scan with any payment app</Small>
      </div>

      <div className="flex justify-center">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <img
            src="/assets/payment-qr.png"
            alt="Payment QR Code"
            className="w-56 h-56 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            className="hidden w-56 h-56 items-center justify-center text-xs text-gray-400 text-center px-4"
            style={{ display: "none" }}
          >
            Replace /public/payment-qr.png with your payment QR
          </div>
        </div>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        WhatsApp {WHATSAPP_NUMBER}
      </a>

      <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
        <Phone className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <Small className="text-amber-800">
          No WhatsApp? SMS or call <span className="font-semibold">{WHATSAPP_NUMBER}</span>{" "}
          and we&apos;ll reach out to you on WhatsApp.
        </Small>
      </div>

      <RHFInput
        name="paymentReference"
        control={control}
        label="Transaction Reference (optional)"
        type="text"
        placeholder="e.g. eSewa transaction ID"
        helperText="Helps us match your payment faster"
        className="h-11"
      />

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1 h-11" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1 h-11">
          Continue
        </Button>
      </div>
    </form>
  );
}
