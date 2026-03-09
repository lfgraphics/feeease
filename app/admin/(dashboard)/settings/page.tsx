import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <p>System wide settings will appear here.</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Configure email and SMS notifications.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
