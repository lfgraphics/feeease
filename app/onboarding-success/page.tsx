import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Registration Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Thank you for registering your school with FeeEase. Your account has been created successfully.
          </p>
          
          <div className="bg-secondary p-6 rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
            <p className="text-muted-foreground">
              Our onboarding team will contact you shortly to verify your details and help you set up your school&apos;s dashboard.
              We will assist you with:
            </p>
            <ul className="text-left mt-4 space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>Deploying your dedicated school application</li>
              <li>Configuring your custom features</li>
              <li>Setting up fee structures and student data</li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Support: +91 12345 67890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email: support@feeease.in</span>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/school/profile">
              <Button size="lg" className="w-full md:w-auto">
                Go to School Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
