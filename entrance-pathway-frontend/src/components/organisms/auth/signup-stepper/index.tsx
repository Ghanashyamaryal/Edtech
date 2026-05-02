"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { Stepper, Paragraph } from "@/components/atoms";
import { useAuth } from "@/context";
import { DetailsStep } from "./details-step";
import { PaymentStep } from "./payment-step";
import { OtpStep } from "./otp-step";
import { PreviewStep } from "./preview-step";
import { SuccessModal } from "./success-modal";
import type { SignupDetailsFormData, SignupPaymentFormData } from "@/utils/validation";

const STEPS = [
  { label: "User Details" },
  { label: "Auth OTP" },
  { label: "Payment Info" },
  { label: "Preview Form" },
];

interface FormState extends SignupDetailsFormData, SignupPaymentFormData {
  courseTitle: string;
  coursePrice: number;
  courseDiscountedPrice?: number;
}

const INITIAL_STATE: FormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  courseId: "",
  courseTitle: "",
  coursePrice: 0,
  courseDiscountedPrice: undefined,
  paymentReference: "",
};

export function SignupStepper() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(INITIAL_STATE);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect already-authenticated users away from signup. We intentionally allow
  // the OTP step to keep the user signed-in mid-flow — this guard only fires
  // before they start, so isAuthenticated changes during step 3 won't bounce them.
  useEffect(() => {
    if (isAuthenticated && !authLoading && step === 0) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router, step]);

  const handleDetailsNext = (
    values: SignupDetailsFormData & {
      courseTitle: string;
      coursePrice: number;
      courseDiscountedPrice?: number;
    }
  ) => {
    setData((prev) => ({ ...prev, ...values }));
    setStep(1);
  };

  const handleOtpVerified = () => {
    setStep(2);
  };

  const handlePaymentNext = (values: SignupPaymentFormData) => {
    setData((prev) => ({ ...prev, ...values }));
    setStep(3);
  };

  const handleAccountExists = () => {
    setTimeout(() => {
      router.push("/auth/login?message=check-email");
    }, 1500);
  };

  const handleSubmitted = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // User is signed-in but is_verified=false — middleware will redirect to /pending-verification
    router.push("/dashboard");
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
      <Card className="w-full max-w-xl border-indigo-50 bg-white">
        <CardHeader className="space-y-4 pb-2">
          <CardTitle className="text-2xl font-bold text-center">
            Create an Account
          </CardTitle>
          <Stepper steps={STEPS} currentStep={step} />
        </CardHeader>
        <CardContent className="pt-6">
          {step === 0 && (
            <DetailsStep
              initialValues={{
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phone: data.phone,
                courseId: data.courseId,
              }}
              onNext={handleDetailsNext}
            />
          )}
          {step === 1 && (
            <OtpStep
              email={data.email}
              password={data.password}
              fullName={data.fullName}
              onVerified={handleOtpVerified}
              onBack={() => setStep(0)}
              onAccountExists={handleAccountExists}
            />
          )}
          {step === 2 && (
            <PaymentStep
              initialValues={{ paymentReference: data.paymentReference }}
              fullName={data.fullName}
              courseTitle={data.courseTitle}
              coursePrice={data.coursePrice}
              courseDiscountedPrice={data.courseDiscountedPrice}
              email={data.email}
              onNext={handlePaymentNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <PreviewStep
              data={{
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                courseTitle: data.courseTitle,
                courseId: data.courseId,
                paymentReference: data.paymentReference,
              }}
              onSubmitted={handleSubmitted}
              onBack={() => setStep(2)}
            />
          )}

          <Paragraph className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:text-primary/80"
            >
              Sign in
            </Link>
          </Paragraph>
        </CardContent>
      </Card>

      <SuccessModal open={showSuccess} onClose={handleSuccessClose} />
    </div>
  );
}
