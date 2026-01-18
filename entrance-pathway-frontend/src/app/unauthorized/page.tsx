'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {from ? (
              <>
                You tried to access <code className="px-1 py-0.5 bg-muted rounded">{from}</code>
              </>
            ) : (
              'The page you requested requires additional permissions.'
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            If you believe this is a mistake, please contact support.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">Go to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UnauthorizedContent />
    </Suspense>
  );
}
