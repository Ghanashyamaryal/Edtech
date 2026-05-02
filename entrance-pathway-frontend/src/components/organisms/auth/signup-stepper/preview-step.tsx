"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Paragraph, Small } from "@/components/atoms";
import { saveSignupRequest } from "@/actions";

interface PreviewData {
  fullName: string;
  email: string;
  phone: string;
  courseTitle: string;
  courseId: string;
  paymentReference?: string;
}

interface PreviewStepProps {
  data: PreviewData;
  onSubmitted: () => void;
  onBack: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <Small className="text-gray-500 shrink-0">{label}</Small>
      <Small className="text-gray-900 font-medium text-right break-all">
        {value || "—"}
      </Small>
    </div>
  );
}

export function PreviewStep({ data, onSubmitted, onBack }: PreviewStepProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const result = await saveSignupRequest({
      phone: data.phone,
      courseId: data.courseId,
      paymentReference: data.paymentReference,
    });

    if (!result.success) {
      setError(result.error || "Failed to submit. Please try again.");
      setSubmitting(false);
      return;
    }

    onSubmitted();
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <Paragraph className="font-semibold text-gray-900">
          Review your details
        </Paragraph>
        <Small className="text-gray-500">
          Confirm everything looks right before submitting
        </Small>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Row label="Full Name" value={data.fullName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        <Row label="Course" value={data.courseTitle} />
        <Row label="Payment Ref" value={data.paymentReference || "—"} />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-11"
          onClick={onBack}
          disabled={submitting}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 h-11"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
