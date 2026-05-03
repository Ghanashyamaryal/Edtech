"use client";

import { Small } from "@/components/atoms";
import { MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "+977-9860120739";
const WHATSAPP_LINK_NUMBER = "9779860120739";

interface PaymentQrProps {
  amountLabel: string;
  whatsappMessage: string;
  hint?: string;
}

export function PaymentQr({ amountLabel, whatsappMessage, hint }: PaymentQrProps) {
  const whatsappHref = `https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">{amountLabel}</p>
        <Small className="text-gray-500">
          {hint ?? "Scan the QR below with any payment app"}
        </Small>
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
            Replace /public/assets/payment-qr.png with your payment QR
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
    </div>
  );
}
