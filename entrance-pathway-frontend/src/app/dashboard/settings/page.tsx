'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Label } from '@/components/ui';
import { Title, Subtitle, Paragraph, Small } from '@/components/atoms';
import {
  User,
  Calendar,
  Bell,
  Shield,
  Globe,
  Camera,
  Loader2,
} from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');

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
        phone: phone.trim() || undefined,
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
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="w-4 h-4" />
                Change Photo
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
                  defaultValue=""
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

      {/* Exam Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Exam Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examType">Target Exam</Label>
              <select
                id="examType"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                defaultValue="csit"
              >
                <option value="csit">BSc CSIT Entrance</option>
                <option value="bit">BIT Entrance</option>
                <option value="bca">BCA Entrance</option>
                <option value="bim">BIM Entrance</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Expected Exam Date</Label>
              <Input id="examDate" type="date" defaultValue="2026-03-15" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <Button variant="outline">Update Exam Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 'liveClass',
                label: 'Live Class Reminders',
                description: 'Get notified before live classes start',
              },
              {
                id: 'mockTest',
                label: 'Mock Test Reminders',
                description: 'Reminders for scheduled mock tests',
              },
              {
                id: 'mentorFeedback',
                label: 'Mentor Feedback',
                description: 'Notifications when mentors respond',
              },
              {
                id: 'dailyTasks',
                label: 'Daily Task Updates',
                description: 'Daily study reminders and task updates',
              },
              {
                id: 'announcements',
                label: 'Announcements',
                description: 'Important updates and announcements',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <Subtitle as="p" className="text-base">{item.label}</Subtitle>
                  <Small className="text-sm">{item.description}</Small>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Subtitle as="p" className="text-base">Language</Subtitle>
                <Small className="text-sm">
                  Choose your preferred language
                </Small>
              </div>
              <select className="h-9 px-3 rounded-md border border-input bg-background text-foreground">
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Subtitle as="p" className="text-base">Dark Mode</Subtitle>
                <Small className="text-sm">
                  Toggle dark theme
                </Small>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-ring after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
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
              <Button variant="outline">Change</Button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Subtitle as="p" className="text-base">Two-Factor Authentication</Subtitle>
                <Small className="text-sm">
                  Add an extra layer of security
                </Small>
              </div>
              <Button variant="outline">Enable</Button>
            </div>

            <div className="flex items-center justify-between py-2 pt-4 border-t border-border">
              <div>
                <Subtitle as="p" className="text-base text-destructive">Delete Account</Subtitle>
                <Small className="text-sm">
                  Permanently delete your account and data
                </Small>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
