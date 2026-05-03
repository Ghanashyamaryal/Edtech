"use client";

import * as React from "react";
import { getActiveCourse, type ActiveCourse } from "@/actions";
import { useAuth } from "@/context/auth-context";

interface ActiveCourseContextValue {
  activeCourse: ActiveCourse | null;
  loading: boolean;
}

const ActiveCourseContext = React.createContext<ActiveCourseContextValue>({
  activeCourse: null,
  loading: true,
});

export function ActiveCourseProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [activeCourse, setActiveCourse] = React.useState<ActiveCourse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setActiveCourse(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getActiveCourse().then((result) => {
      if (cancelled) return;
      setActiveCourse(result.success ? result.data : null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  return (
    <ActiveCourseContext.Provider value={{ activeCourse, loading }}>
      {children}
    </ActiveCourseContext.Provider>
  );
}

export function useActiveCourse() {
  return React.useContext(ActiveCourseContext);
}
