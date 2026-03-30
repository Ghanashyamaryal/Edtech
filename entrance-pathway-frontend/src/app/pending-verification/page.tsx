'use client';

import { useAuth } from '@/context/auth-context';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import { Clock, LogOut, Mail } from 'lucide-react';

export default function PendingVerificationPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-accent/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is awaiting admin verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{user?.email || 'your email'}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            An administrator needs to verify your account before you can access the dashboard.
            You will be able to access all features once your account has been approved.
          </p>
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            If you believe this is taking too long, please contact the administrator.
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
