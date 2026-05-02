"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";
import { Paragraph } from "@/components/atoms";
import { RHFInput } from "@/components/atoms/rhf-components";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validate redirectTo to prevent open redirect attacks
  const rawRedirect = searchParams.get("redirectTo") || "/dashboard";
  const redirectTo = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
    ? rawRedirect
    : "/dashboard";

  // Only allow known safe messages to prevent phishing via URL
  const SAFE_MESSAGES: Record<string, string> = {
    "email-confirmed": "Your email has been confirmed. You can now sign in.",
    "password-reset": "Your password has been reset. Please sign in with your new password.",
    "check-email": "Check your email to confirm your account.",
  };
  const messageParam = searchParams.get("message");
  const safeMessage = messageParam ? SAFE_MESSAGES[messageParam] ?? null : null;

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, authLoading, router, redirectTo]);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    const { error } = await signIn(data.email, data.password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect is handled by the useEffect watching isAuthenticated
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-linear-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md border border-indigo-50 bg-white">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-20 h-20 mb-4 overflow-hidden">
            <img src="/assets/logo.png" alt="ITpro Entrance Logo" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to your ITpro Entrance account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {safeMessage && (
              <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
                {safeMessage}
              </div>
            )}

            <RHFInput
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="you@example.com"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading}
            />
            <RHFInput
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button
              type="submit"
              className="w-full h-11 font-semibold text-base shadow-sm hover:shadow-md transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-center text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
            <Paragraph className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Sign up
              </Link>
            </Paragraph>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
