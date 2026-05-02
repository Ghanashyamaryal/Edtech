'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  User,
  Shield,
  Camera,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';

export default function SettingsPage() {
  const { user, updateProfile, updatePassword, uploadAvatar } = useAuth();
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth || '');

  // Sync form state when user data loads asynchronously
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.date_of_birth || '');
    }
  }, [user]);

  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Avatar upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      toast.error('Error', 'Full name is required');
      return;
    }

    setSaving(true);
    try {
      const { error } = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        date_of_birth: dateOfBirth,
      });

      if (error) {
        toast.error('Error', error.message);
      } else {
        toast.success('Success', 'Profile updated successfully');
      }
    } catch (err) {
      toast.error('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Error', 'Please fill in both fields');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Error', 'Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error('Error', 'Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      toast.error('Error', 'Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      toast.error('Error', 'Password must contain at least one number');
      return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      toast.error('Error', 'Password must contain at least one special character');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Error', 'Passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error('Error', error.message);
      } else {
        toast.success('Success', 'Password updated successfully');
        setShowPasswordDialog(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error('Error', 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Error', 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Error', 'Image must be smaller than 5MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const { url, error } = await uploadAvatar(file);
      if (error) {
        toast.error('Error', error.message);
        return;
      }
      if (url) {
        const { error: profileError } = await updateProfile({ avatar_url: url });
        if (profileError) {
          toast.error('Error', profileError.message);
        } else {
          toast.success('Success', 'Profile photo updated');
        }
      }
    } catch (err) {
      toast.error('Error', 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <Title className="text-2xl md:text-3xl">Profile Settings</Title>
        <Paragraph className="mt-1">
          Manage your account settings and preferences
        </Paragraph>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar.Root className="w-24 h-24 rounded-full overflow-hidden bg-primary">
                <Avatar.Image
                  src={user?.avatar_url || undefined}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
                <Avatar.Fallback className="flex items-center justify-center w-full h-full text-2xl font-medium text-primary-foreground bg-primary">
                  {initials}
                </Avatar.Fallback>
              </Avatar.Root>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>

            {/* Form */}
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Subtitle as="p" className="text-base">Change Password</Subtitle>
                <Small className="text-sm">
                  Update your account password
                </Small>
              </div>
              <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                Change
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {newPassword && (
              <div className="space-y-1 text-sm">
                <p className={newPassword.length >= 8 ? 'text-success' : 'text-muted-foreground'}>
                  {newPassword.length >= 8 ? '\u2713' : '\u2022'} At least 8 characters
                </p>
                <p className={/[A-Z]/.test(newPassword) ? 'text-success' : 'text-muted-foreground'}>
                  {/[A-Z]/.test(newPassword) ? '\u2713' : '\u2022'} One uppercase letter
                </p>
                <p className={/[a-z]/.test(newPassword) ? 'text-success' : 'text-muted-foreground'}>
                  {/[a-z]/.test(newPassword) ? '\u2713' : '\u2022'} One lowercase letter
                </p>
                <p className={/[0-9]/.test(newPassword) ? 'text-success' : 'text-muted-foreground'}>
                  {/[0-9]/.test(newPassword) ? '\u2713' : '\u2022'} One number
                </p>
                <p className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-success' : 'text-muted-foreground'}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? '\u2713' : '\u2022'} One special character
                </p>
              </div>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive">Passwords do not match</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} disabled={changingPassword}>
              {changingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
