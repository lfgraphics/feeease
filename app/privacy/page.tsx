import React from "react";
import { ShieldAlert, BookOpen, Clock, UserCheck, Smartphone } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - FeeEase",
  description: "Learn about how FeeEase handles and protects your data.",
};

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12 flex gap-4 items-center">
          <Clock size={18} /> Last Updated: March 26, 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section className="bg-secondary/30 p-8 rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center">
              <ShieldAlert className="text-primary" /> 1. Commitment to Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At FeeEase, we understand that we manage your school&apos;s most sensitive information. Our approach to data is simple: we only collect what is necessary to serve you, and we do not store sensitive records longer than required to fulfill your requests.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6 flex gap-3 items-center">
              <UserCheck className="text-primary" /> 2. Data Collection (Institutes)
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We don&apos;t collect any data other than the <strong className="text-foreground">institute&apos;s identity</strong>. This information is collected solely for the purpose of authentication and providing the requested services.
            </p>
          </section>

          <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
            <h3 className="text-xl font-bold mb-6 flex gap-3 items-center">
              <Smartphone className="text-primary" /> 3. Student Data Handling
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We collect minimal student data including <strong className="text-foreground">name, parent&apos;s name, mobile number, due amount, and due period</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold mb-2">Purpose of Collection</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This data is only used to notify the parents upon your explicit request (e.g., fee reminders via WhatsApp or SMS) to fulfill that specific transaction.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold mb-2 text-primary">No Storage Policy</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Important: We do not store student data beyond the scope of providing the requested service. Your records remain your own and are processed only as long as necessary to complete your requests.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">4. Sharing of Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              FeeEase does not share your data with third parties except when required to fulfill service requests (like sending notification through our communication providers). We do not sell your data to any third parties for any purpose.
            </p>
          </section>

          <section className="bg-card p-10 rounded-2xl border border-border shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex gap-3 items-center">
              <BookOpen className="text-primary" /> 5. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You maintain full ownership of your data. You can export your data at any time or request complete deletion of your institution&apos;s account and any transient processing records.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
