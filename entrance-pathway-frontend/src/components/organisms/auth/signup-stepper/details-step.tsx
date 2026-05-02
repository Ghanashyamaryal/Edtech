"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { RHFInput, RHFSelect, type SelectOption } from "@/components/atoms/rhf-components";
import { signupDetailsSchema, type SignupDetailsFormData } from "@/utils/validation";
import { getPublishedCourses } from "@/actions";

interface CourseLite {
  id: string;
  title: string;
  price: number;
  discountedPrice?: number;
}

interface DetailsStepProps {
  initialValues: SignupDetailsFormData;
  onNext: (
    data: SignupDetailsFormData & {
      courseTitle: string;
      coursePrice: number;
      courseDiscountedPrice?: number;
    }
  ) => void;
}

export function DetailsStep({ initialValues, onNext }: DetailsStepProps) {
  const [courses, setCourses] = useState<CourseLite[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const { control, handleSubmit } = useForm<SignupDetailsFormData>({
    resolver: zodResolver(signupDetailsSchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const courseOptions: SelectOption[] = courses.map((c) => ({
    value: c.id,
    label: c.title,
  }));

  const submit = (values: SignupDetailsFormData) => {
    const course = courses.find((c) => c.id === values.courseId);
    onNext({
      ...values,
      courseTitle: course?.title || values.courseId,
      coursePrice: course?.price ?? 0,
      courseDiscountedPrice: course?.discountedPrice,
    });
  };

  useEffect(() => {
    let cancelled = false;
    getPublishedCourses({ limit: 100 }).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setCourses(
          result.data.map((c) => ({
            id: c.id,
            title: c.title,
            price: c.price,
            discountedPrice: c.discountedPrice,
          }))
        );
      }
      setCoursesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <RHFInput
        name="fullName"
        control={control}
        label="Full Name"
        type="text"
        placeholder="John Doe"
        className="h-11"
      />
      <RHFInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="you@example.com"
        className="h-11"
      />
      <RHFInput
        name="phone"
        control={control}
        label="Phone Number"
        type="tel"
        placeholder="+9779812345678"
        className="h-11"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <RHFInput
          name="password"
          control={control}
          label="Password"
          type="password"
          placeholder="Create a password"
          helperText="8+ chars with upper, lower, number & symbol"
          className="h-11"
        />
        <RHFInput
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          className="h-11"
        />
      </div>
      <RHFSelect
        name="courseId"
        control={control}
        label="Select Course"
        placeholder={coursesLoading ? "Loading courses..." : "Choose a course"}
        options={courseOptions}
        disabled={coursesLoading}
      />
      <Button type="submit" className="w-full h-11">
        Continue
      </Button>
    </form>
  );
}
