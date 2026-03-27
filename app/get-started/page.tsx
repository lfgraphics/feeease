import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import Script from "next/script";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Get Started with FeeEase</h1>
          <p className="text-muted-foreground">Register your school today and streamline your operations.</p>
        </div>
        <OnboardingForm />
      </main>

      <Script
        type="text/javascript"
        src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
        id="aisensy-wa-widget"
        widget-id="aab0a4"
      />
    </div>
  );
}
