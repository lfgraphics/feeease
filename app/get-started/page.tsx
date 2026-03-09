import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Get Started with FeeEase</h1>
          <p className="text-slate-600">Register your school today and streamline your operations.</p>
        </div>
        <OnboardingForm />
      </main>
    </div>
  );
}
