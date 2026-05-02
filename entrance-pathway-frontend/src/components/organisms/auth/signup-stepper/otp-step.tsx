"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui";
import { RHFInput } from "@/components/atoms/rhf-components";
import { Paragraph, Small } from "@/components/atoms";
import { signupOtpSchema, type SignupOtpFormData } from "@/utils/validation";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";

interface OtpStepProps {
  email: string;
  password: string;
  fullName: string;
  onVerified: () => void;
  onBack: () => void;
  onAccountExists: () => void;
}

export function OtpStep({
  email,
  password,
  fullName,
  onVerified,
  onBack,
  onAccountExists,
}: OtpStepProps) {
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<SignupOtpFormData>({
    resolver: zodResolver(signupOtpSchema),
    defaultValues: { otp: "" },
    mode: 'onTouched',
  });

  const handleSendCode = async () => {
    setSending(true);
    setError(null);
    setInfo(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "student" },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSending(false);
      return;
    }

    // Supabase returns user with empty identities array if email is already registered.
    if (data.user && (data.user.identities?.length ?? 0) === 0) {
      setError("An account with this email already exists.");
      setSending(false);
      onAccountExists();
      return;
    }

    setSent(true);
    setInfo(`We've sent a 6-digit code to ${email}. Please check your inbox.`);
    setSending(false);
  };

  const handleVerify = async (formData: SignupOtpFormData) => {
    setVerifying(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: formData.otp,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setVerifying(false);
      return;
    }

    onVerified();
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <Paragraph className="font-semibold text-gray-900">
          Verify your email
        </Paragraph>
        <Small className="text-gray-500">
          We&apos;ll send a 6-digit code to <span className="font-medium">{email}</span>
        </Small>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
          {error.toLowerCase().includes("already exists") && (
            <div className="mt-2">
              <Link
                href="/auth/login"
                className="font-semibold underline"
              >
                Go to login
              </Link>
            </div>
          )}
        </div>
      )}
      {info && !error && (
        <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
          {info}
        </div>
      )}

      {!sent ? (
        <Button
          type="button"
          className="w-full h-11"
          onClick={handleSendCode}
          disabled={sending}
        >
          {sending ? "Sending code..." : "Send code"}
        </Button>
      ) : (
        <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
          <RHFInput
            name="otp"
            control={control}
            label="6-digit code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="h-11 text-center text-lg tracking-widest"
          />
          <Button type="submit" className="w-full h-11" disabled={verifying}>
            {verifying ? "Verifying..." : "Verify"}
          </Button>
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sending}
            className="text-sm text-primary hover:underline w-full text-center"
          >
            {sending ? "Resending..." : "Resend code"}
          </button>
        </form>
      )}

      <div className="flex">
        <Button type="button" variant="outline" className="w-full h-11" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
