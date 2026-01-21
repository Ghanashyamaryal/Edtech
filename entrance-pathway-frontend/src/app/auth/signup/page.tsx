"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context";
import { signupSchema, type SignupFormData } from "@/utils/validation";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { Paragraph, Small, Label } from "@/components/atoms";
import { RHFInput } from "@/components/atoms/rhf-components";
import type { UserRole } from "@/types";

// Role selection card component
function RoleCard({
  role,
  title,
  description,
  icon,
  selected,
  onSelect,
}: {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 py-3 cursor-pointer rounded-lg border-2 text-left transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div>
          <Paragraph className="text-base">{title}</Paragraph>
        </div>
      </div>
    </button>
  );
}

// Icons
function StudentIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function MentorIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

// Google brand colors icon
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const {
    signUp,
    signInWithProvider,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "student",
    },
  });

  const selectedRole = watch("role");

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);

    const { error } = await signUp(
      data.email,
      data.password,
      data.fullName,
      data.role,
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/auth/login?message=Check your email to confirm your account");
  };

  const handleGoogleLogin = async () => {
    setSocialLoading("google");
    setError(null);

    const { error } = await signInWithProvider("google");

    if (error) {
      setError(error.message);
      setSocialLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-linear-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md border-indigo-50 bg-white">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <RHFInput
              name="fullName"
              control={control}
              label="Full Name"
              type="text"
              placeholder="John Doe"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading || !!socialLoading}
            />
            <RHFInput
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="you@example.com"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading || !!socialLoading}
            />
            <RHFInput
              name="password"
              control={control}
              label="Password"
              type="password"
              placeholder="Create a password"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading || !!socialLoading}
            />
            <RHFInput
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
              disabled={loading || !!socialLoading}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-2 text-gray-700">
                I want to join as
              </Label>
              <div className="grid grid-cols-2 mt-2 gap-3">
                <RoleCard
                  role="student"
                  title="Student"
                  description="Learn and grow"
                  icon={<StudentIcon />}
                  selected={selectedRole === "student"}
                  onSelect={() => setValue("role", "student")}
                />
                <RoleCard
                  role="mentor"
                  title="Mentor"
                  description="Teach and guide"
                  icon={<MentorIcon />}
                  selected={selectedRole === "mentor"}
                  onSelect={() => setValue("role", "mentor")}
                />
              </div>
              {errors.role && (
                <Small className="text-sm text-destructive">
                  {errors.role.message}
                </Small>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !!socialLoading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
              onClick={handleGoogleLogin}
              disabled={!!socialLoading || loading}
            >
              {socialLoading === "google" ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="ml-3 text-gray-700 font-medium">
                    Continue with Google
                  </span>
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
