'use client';

import { useAuth } from '@/context/auth-context';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import { Small } from '@/components/atoms';
import { Clock, LogOut, Mail, MessageCircle, Phone } from 'lucide-react';

const WHATSAPP_NUMBER = '+977-9760120739';
const WHATSAPP_LINK_NUMBER = '9779760120739';

export default function PendingVerificationPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm following up on my account verification. Email: ${user?.email || ''}.`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-accent/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Payment Under Verification</CardTitle>
          <CardDescription>
            We&apos;re reviewing your payment. You&apos;ll get access once verified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{user?.email || 'your email'}</span>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp {WHATSAPP_NUMBER}
          </a>

          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex items-start gap-2 text-left">
            <Phone className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <Small className="text-amber-800">
              No WhatsApp? SMS or call <span className="font-semibold">{WHATSAPP_NUMBER}</span>{' '}
              and we&apos;ll reach out to you on WhatsApp.
            </Small>
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
