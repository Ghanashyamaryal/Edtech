'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui';
import { Stepper, Paragraph } from '@/components/atoms';
import { RHFInput } from '@/components/atoms/rhf-components';
import { supabase } from '@/lib/supabase';
import {
  forgotPasswordSchema,
  signupOtpSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type SignupOtpFormData,
  type ResetPasswordFormData,
} from '@/utils/validation';
import { Mail, KeyRound, Lock, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Email' },
  { label: 'Verify Code' },
  { label: 'New Password' },
];

type Stage = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = stage === 'email' ? 0 : stage === 'otp' ? 1 : 2;

  // Stage 1 — email
  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  // Stage 2 — OTP
  const otpForm = useForm<SignupOtpFormData>({
    resolver: zodResolver(signupOtpSchema),
    defaultValues: { otp: '' },
    mode: 'onTouched',
  });

  // Stage 3 — new password
  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const sendCode = async (targetEmail: string) => {
    setSubmitting(true);
    setError(null);
    setInfo(null);

    const { error: sendError } = await supabase.auth.resetPasswordForEmail(targetEmail);

    if (sendError) {
      setError(sendError.message);
      setSubmitting(false);
      return false;
    }

    setInfo(`We've sent a 6-digit code to ${targetEmail}.`);
    setSubmitting(false);
    return true;
  };

  const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
    const ok = await sendCode(data.email);
    if (!ok) return;
    setEmail(data.email);
    setStage('otp');
  };

  const handleOtpSubmit = async (data: SignupOtpFormData) => {
    setSubmitting(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: data.otp,
      type: 'recovery',
    });

    if (verifyError) {
      setError(verifyError.message);
      setSubmitting(false);
      return;
    }

    setInfo(null);
    setSubmitting(false);
    setStage('password');
  };

  const handlePasswordSubmit = async (data: ResetPasswordFormData) => {
    setSubmitting(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    // Sign out so user must re-authenticate with their new password
    await supabase.auth.signOut();

    setStage('success');
    setSubmitting(false);

    setTimeout(() => {
      router.push('/auth/login?message=password-reset');
    }, 2000);
  };

  const handleResend = async () => {
    if (!email) return;
    await sendCode(email);
  };

  if (stage === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-linear-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md text-center border-indigo-50 bg-white">
          <CardHeader>
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Password updated</CardTitle>
            <CardDescription>Redirecting you to sign in...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-linear-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-xl border-indigo-50 bg-white">
        <CardHeader className="space-y-4 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Reset your password
          </CardTitle>
          <Stepper steps={STEPS} currentStep={stepIndex} />
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
              {info}
            </div>
          )}

          {stage === 'email' && (
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <Paragraph className="text-sm text-gray-500">
                  Enter the email associated with your account and we&apos;ll send a 6-digit code.
                </Paragraph>
              </div>
              <RHFInput
                name="email"
                control={emailForm.control}
                label="Email"
                type="email"
                placeholder="you@example.com"
                className="h-11"
                disabled={submitting}
              />
              <Button type="submit" className="w-full h-11" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send code'}
              </Button>
            </form>
          )}

          {stage === 'otp' && (
            <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <Paragraph className="text-sm text-gray-500">
                  Enter the 6-digit code sent to <span className="font-medium">{email}</span>.
                </Paragraph>
              </div>
              <RHFInput
                name="otp"
                control={otpForm.control}
                label="6-digit code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="h-11 text-center text-lg tracking-widest"
                disabled={submitting}
              />
              <Button type="submit" className="w-full h-11" disabled={submitting}>
                {submitting ? 'Verifying...' : 'Verify'}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStage('email');
                    setInfo(null);
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={submitting}
                  className="text-primary hover:underline"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          {stage === 'password' && (
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <Paragraph className="text-sm text-gray-500">
                  Choose a strong new password for your account.
                </Paragraph>
              </div>
              <RHFInput
                name="password"
                control={passwordForm.control}
                label="New password"
                type="password"
                placeholder="At least 8 characters"
                className="h-11"
                disabled={submitting}
              />
              <RHFInput
                name="confirmPassword"
                control={passwordForm.control}
                label="Confirm password"
                type="password"
                placeholder="Re-enter your new password"
                className="h-11"
                disabled={submitting}
              />
              <Button type="submit" className="w-full h-11" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          )}

          <Paragraph className="text-sm text-center text-gray-600 pt-2">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:text-primary/80"
            >
              Sign in
            </Link>
          </Paragraph>
        </CardContent>
      </Card>
    </div>
  );
}
