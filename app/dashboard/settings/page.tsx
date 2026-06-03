"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Loader2
} from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    weekly: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg bg-accent text-accent-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Change Avatar</Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your analyses via email.
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, email: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">
                Get a weekly summary of your resume performance.
              </p>
            </div>
            <Switch
              checked={notifications.weekly}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weekly: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Receive tips, updates, and promotional offers.
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, marketing: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Free Plan</p>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  3 analyses per month • Basic features
                </p>
              </div>
            </div>
            <Button>Upgrade to Pro</Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Analyses used: 2 of 3 this month</p>
            <p className="mt-1">Resets on May 15, 2026</p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed 30 days ago
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data.
              </p>
            </div>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
