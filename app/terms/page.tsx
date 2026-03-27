import React from "react";
import { Gavel, Globe, Info, PackageOpen, LayoutDashboard, Clock } from "lucide-react";
import Script from "next/script";

export const metadata = {
  title: "Terms of Service - FeeEase",
  description: "Terms and conditions for using FeeEase school management system.",
};

const TermsOfService = () => {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-12 flex gap-4 items-center">
            <Clock size={18} /> Last Updated: March 26, 2026
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold flex gap-3 items-center mb-6">
                <Gavel className="text-primary" /> 1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using FeeEase, you agree to be bound by these Terms. If you do not agree to all terms and conditions, you may not access or use our services.
              </p>
            </div>
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold flex gap-3 items-center mb-6">
                <PackageOpen className="text-primary" /> 2. License to Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                FeeEase grants you a non-transferable, non-exclusive, revocable license to access the platform for your institution&apos;s administrative purposes.
              </p>
            </div>
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold flex gap-3 items-center mb-6">
                <LayoutDashboard className="text-primary" /> 3. User Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
            <div className="bg-secondary/30 p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold flex gap-3 items-center mb-6">
                <Globe className="text-primary" /> 4. Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Access to FeeEase is subject to our subscription plans. Quarterly or annual billing cycles are applied as per your chosen plan.
              </p>
            </div>
          </div>

          <section className="bg-card p-10 rounded-2xl border border-border shadow-xl mb-16">
            <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center">
              <Info className="text-primary" /> 5. Service Availability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain 99.9% uptime. However, FeeEase does not guarantee that the service will be uninterrupted or error-free. We may perform scheduled maintenance with advance notice.
            </p>
          </section>

          <section className="md:px-8">
            <h3 className="text-xl font-bold mb-4">6. Limitation of Liability</h3>
            <p className="text-muted-foreground leading-relaxed">
              FeeEase and its parent company, Cod Vista, shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="md:px-8 mt-12 pb-16 border-b border-border">
            <h3 className="text-xl font-bold mb-4">7. Governing Law</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of Uttar Pradesh, India, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>

      <Script
        type="text/javascript"
        src="https://d3mkw6s8thqya7.cloudfront.net/integration-plugin.js"
        id="aisensy-wa-widget"
        widget-id="aab0a4"
      />
    </>
  );
};

export default TermsOfService;
