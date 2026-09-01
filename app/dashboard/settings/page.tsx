"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Loader2, Shield, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { changePassword, getSubscriptionInfo, updateUser } from "@/lib/authApi";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const subscription = useQuery({ queryKey: ["subscription"], queryFn: getSubscriptionInfo });
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName, lastName: user.lastName, email: user.email });
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: () => updateUser(profile),
    onSuccess: (updatedUser) => queryClient.setQueryData(["currentUser"], updatedUser),
  });
  const passwordMutation = useMutation({
    mutationFn: () => changePassword(passwords),
    onSuccess: () => setPasswords({ currentPassword: "", newPassword: "" }),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account settings and preferences.</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Profile</CardTitle><CardDescription>Update your personal information.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); profileMutation.mutate(); }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" value={profile.firstName} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" value={profile.lastName} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></div>
            {profileMutation.isError && <Alert variant="destructive"><AlertTitle>Unable to save profile</AlertTitle><AlertDescription>{profileMutation.error.message}</AlertDescription></Alert>}
            {profileMutation.isSuccess && <p className="text-sm text-success">Profile updated successfully.</p>}
            <div className="flex justify-end"><Button type="submit" disabled={profileMutation.isPending}>{profileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{profileMutation.isPending ? "Saving..." : "Save Changes"}</Button></div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5" />Subscription</CardTitle><CardDescription>View your current plan and usage.</CardDescription></CardHeader>
        <CardContent>
          {subscription.isPending && <Loader2 className="h-5 w-5 animate-spin text-accent" />}
          {subscription.isError && <Alert variant="destructive"><AlertTitle>Unable to load subscription</AlertTitle><AlertDescription>{subscription.error.message}</AlertDescription></Alert>}
          {subscription.data && <div className="space-y-4"><div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4"><div><div className="flex items-center gap-2"><p className="font-semibold">{subscription.data.plan}</p><Badge variant="secondary">Current</Badge></div><p className="text-sm text-muted-foreground">{subscription.data.analysesAllowed} analyses per month</p></div></div><div className="text-sm text-muted-foreground"><p>Analyses used: {subscription.data.analysesUsed} of {subscription.data.analysesAllowed}</p><p className="mt-1">Resets on {new Date(subscription.data.endPeriod).toLocaleDateString()}</p></div></div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Shield className="h-5 w-5" />Security</CardTitle><CardDescription>Manage your password and security settings.</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); passwordMutation.mutate(); }}>
            <div className="space-y-2"><Label htmlFor="currentPassword">Current password</Label><Input id="currentPassword" type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required /></div>
            <div className="space-y-2"><Label htmlFor="newPassword">New password</Label><Input id="newPassword" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} minLength={8} required /></div>
            {passwordMutation.isError && <Alert variant="destructive"><AlertTitle>Unable to change password</AlertTitle><AlertDescription>{passwordMutation.error.message}</AlertDescription></Alert>}
            {passwordMutation.isSuccess && <p className="text-sm text-success">Password changed successfully.</p>}
            <div className="flex justify-end"><Button type="submit" variant="outline" disabled={passwordMutation.isPending}>{passwordMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}Change Password</Button></div>
          </form>
          <Separator className="my-6" />
          <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p></div><Button type="button" variant="outline" disabled>Enable</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
