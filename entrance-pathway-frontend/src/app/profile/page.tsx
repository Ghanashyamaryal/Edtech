'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context';
import { profileSchema, type ProfileFormData } from '@/utils/validation';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';

function UserAvatar({ src, name, size = 'lg' }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium`}
    >
      {initials}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, updateProfile, uploadAvatar, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      avatarUrl: '',
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.full_name || '',
        phone: user.phone || '',
        avatarUrl: user.avatar_url || '',
      });
      setPreviewUrl(user.avatar_url || null);
    }
  }, [user, reset]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirectTo=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setAvatarUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    const { url, error: uploadError } = await uploadAvatar(file);

    if (uploadError) {
      setError(uploadError.message);
      setAvatarUploading(false);
      return;
    }

    if (url) {
      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: url });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess('Profile picture updated successfully');
        setPreviewUrl(url);
      }
    }

    setAvatarUploading(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await updateProfile({
      full_name: data.fullName,
      phone: data.phone || undefined,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('Profile updated successfully');
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              {/* Avatar with upload */}
              <div className="relative group">
                <UserAvatar
                  src={previewUrl || user.avatar_url}
                  name={user.full_name}
                  size="lg"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {avatarUploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <CameraIcon />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <Subtitle as="h2" className="mt-4 text-xl">{user.full_name}</Subtitle>
              <Paragraph>{user.email}</Paragraph>
              <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
                <Small className="text-xs">
                  Email cannot be changed
                </Small>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  {...register('fullName')}
                  disabled={loading}
                />
                {errors.fullName && (
                  <Small className="text-sm text-destructive">{errors.fullName.message}</Small>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  {...register('phone')}
                  disabled={loading}
                />
                {errors.phone && (
                  <Small className="text-sm text-destructive">{errors.phone.message}</Small>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  type="text"
                  value={user.role}
                  disabled
                  className="bg-muted capitalize"
                />
                <Small className="text-xs">
                  Contact support to change your role
                </Small>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading || !isDirty}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Subtitle as="h4" className="text-base">Change Password</Subtitle>
                <Small className="text-sm">
                  Update your password to keep your account secure
                </Small>
              </div>
              <Button variant="outline" onClick={() => router.push('/auth/forgot-password')}>
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div>
                <Subtitle as="h4" className="text-base text-destructive">Sign Out</Subtitle>
                <Small className="text-sm">
                  Sign out of your account on this device
                </Small>
              </div>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              <div className="py-3 flex justify-between">
                <dt className="text-muted-foreground">Account ID</dt>
                <dd className="font-mono text-sm">{user.id.slice(0, 8)}...</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-muted-foreground">Email Verified</dt>
                <dd>
                  {user.email_verified ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-muted-foreground">Member Since</dt>
                <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
