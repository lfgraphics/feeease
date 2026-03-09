import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Bell, Settings as SettingsIcon } from "lucide-react";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6 container max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account password and security preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              <ChangePasswordForm />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
