"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle2, Clipboard, Star, Calendar, Zap, Building2, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { SCHOOL_FEATURES, DEFAULT_FEATURES } from "@/lib/features";
import { Separator } from "@/components/ui/separator";

// Dynamically generate the features schema
const featuresSchema = z.object(
  SCHOOL_FEATURES.reduce((acc, feature) => {
    acc[feature.id] = z.boolean();
    return acc;
  }, {} as Record<string, z.ZodBoolean>)
);

const formSchema = z.object({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolLogo: z.string().min(1, "School logo is required"), // Base64 string
  schoolShortName: z.string().optional(),
  schoolAddress: z.string().min(5, "Address must be at least 5 characters"),
  adminName: z.string().min(2, "Admin name must be at least 2 characters"),
  adminMobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  adminEmail: z.string().email("Invalid email address"),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().length(6, "Referral code must be 6 digits").optional().or(z.literal("")),
  plan: z.string(),
  features: featuresSchema,
});

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"Basic" | "Custom" | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      schoolLogo: "",
      schoolShortName: "",
      schoolAddress: "",
      adminName: "",
      adminMobile: "",
      adminEmail: "",
      adminPassword: "",
      referralCode: "",
      plan: "",
      features: DEFAULT_FEATURES,
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        form.setValue("schoolLogo", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlanSelect = (plan: "Basic" | "Custom") => {
    setSelectedPlan(plan);
    form.setValue("plan", plan);
    if (plan === "Basic") {
      // Reset features for Basic plan
      form.setValue("features", DEFAULT_FEATURES);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("School registered successfully! Our team will contact you shortly.");

      // Auto-login the user
      const loginResult = await signIn("credentials", {
        email: values.adminEmail,
        password: values.adminPassword,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.push("/onboarding-success");
      } else {
        router.push("/");
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (!selectedPlan) {
    return (
      <div className="w-full pb-10">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center space-y-3 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              No hidden fees. Everything you need to streamline school operations with professional data migration included.
            </p>
          </div>

          {/* Key Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 mb-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Free Data Migration
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                Our team assists you with all data transfer needs
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-green-900 dark:text-green-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No Hidden Costs
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                Transparent pricing, nothing more
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Add Features Anytime
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                Scale as your school grows
              </p>
            </div>
          </div>

          {/* Pricing Cards - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Standard Plan */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Standard Plan</h3>
                <p className="text-blue-100 text-sm">Perfect for most schools</p>
              </div>

              {/* Pricing */}
              <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Installation</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">₹8,500</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">One-time</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-end justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Monthly Billing</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">₹850</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">/month</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">
                    Quarterly & Annual billing also available
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="px-6 py-8 flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium text-sm">Free Thermal Printer</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Complimentary with first installation</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium text-sm">Free Data Migration</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Professional team assists you with all data transfer needs</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Student & Fee Management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Attendance Tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">ID Card Generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Financial Reports & Analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Admin Portal Access</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <div className="px-6 py-6">
                <Button
                  onClick={() => handlePlanSelect("Basic")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Continue with Standard
                </Button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-500 overflow-hidden flex flex-col h-full relative">
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
                RECOMMENDED
              </div>

              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white pt-12">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Professional Plan</h3>
                <p className="text-purple-100 text-sm">Everything you need to grow</p>
              </div>

              {/* Pricing */}
              <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Installation</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">₹8,500</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">One-time + Additional features</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-end justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Monthly Billing</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">₹850</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">/month + any plan specific external charges (if any)</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">
                    Choose your billing cycle & add custom features
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="px-6 py-8 flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Everything in Standard +</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">WhatsApp Automation (SMS & Receipts)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Teachers Portal & Access Control</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Parent Portal & Notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Exam sheet and result management System</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Staff Payroll Management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 text-sm">Advanced Reporting & Dashboards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-purple-500 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium text-sm">Custom Features</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tailored to your school's specific needs</p>
                    </div>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  Request as many features as you want, features billing is made at installation time or whenever you choose to add them.
                </p>
              </div>

              {/* CTA Button */}
              <div className="px-6 py-6">
                <Button
                  onClick={() => handlePlanSelect("Custom")}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Choose Professional
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 min-h-screen py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="text-white hover:bg-white/20 -ml-2">
              ← Back to Plans
            </Button>
            <div className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              {selectedPlan === "Basic" ? (
                <>
                  <Clipboard className="w-4 h-4" /> Standard
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" /> Professional
                </>
              )}
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Complete Your Registration</CardTitle>
          <CardDescription className="text-slate-300 mt-2">
            {selectedPlan === "Basic"
              ? "Get started with essential school management tools. Installation: ₹8,500 | Monthly: ₹850"
              : "Unlock advanced features for your school. Installation: ₹8,500 | Monthly: ₹850 + custom features"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Billing Options for Professional Plan */}
            {selectedPlan === "Custom" && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Select Your Billing Cycle
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center p-3 border-2 border-purple-200 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                    <input type="radio" name="billingCycle" value="monthly" className="mr-3" defaultChecked />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Monthly</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">₹850/month</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border-2 border-purple-200 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                    <input type="radio" name="billingCycle" value="quarterly" className="mr-3" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Quarterly</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">₹2,400 (save 6%)</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border-2 border-purple-200 dark:border-purple-700 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors">
                    <input type="radio" name="billingCycle" value="annual" className="mr-3" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Annual</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">₹9,180 (save 12%)</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Custom Features Selection */}
            {selectedPlan === "Custom" && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> Select Custom Features
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Add any features tailored to your school's needs. These are billed at your installation cost with custom pricing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SCHOOL_FEATURES.map((feature) => (
                    <label key={feature.id} className="flex items-start space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                      <Checkbox
                        id={feature.id}
                        checked={form.watch(`features.${feature.id}` as any)}
                        onCheckedChange={(checked) => form.setValue(`features.${feature.id}` as any, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{feature.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* School Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                <Building2 className="w-5 h-5" /> School Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Name *</label>
                  <Input placeholder="e.g. Modern Academy" {...form.register("schoolName")} className="rounded-lg" />
                  {form.formState.errors.schoolName && <p className="text-destructive text-xs">{form.formState.errors.schoolName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Short Name</label>
                  <Input placeholder="e.g. MA (optional)" {...form.register("schoolShortName")} className="rounded-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Logo *</label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-700/30 overflow-hidden flex-shrink-0">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="Logo Preview" fill className="object-contain p-1" />
                    ) : (
                      <Upload className="text-slate-400 w-8 h-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="cursor-pointer rounded-lg"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">PNG, JPG, or JPEG format. Recommended: 200x200px</p>
                  </div>
                </div>
                <input type="hidden" {...form.register("schoolLogo")} />
                {form.formState.errors.schoolLogo && <p className="text-destructive text-xs">{form.formState.errors.schoolLogo.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Address *</label>
                <Input placeholder="Complete address of your school" {...form.register("schoolAddress")} className="rounded-lg" />
                {form.formState.errors.schoolAddress && <p className="text-destructive text-xs">{form.formState.errors.schoolAddress.message}</p>}
              </div>
            </div>

            {/* Admin Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Administrator Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name *</label>
                  <Input placeholder="Full name" {...form.register("adminName")} className="rounded-lg" />
                  {form.formState.errors.adminName && <p className="text-destructive text-xs">{form.formState.errors.adminName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                  <Input placeholder="10-digit mobile" {...form.register("adminMobile")} className="rounded-lg" />
                  {form.formState.errors.adminMobile && <p className="text-destructive text-xs">{form.formState.errors.adminMobile.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email *</label>
                  <Input type="email" placeholder="admin@school.com" {...form.register("adminEmail")} className="rounded-lg" />
                  {form.formState.errors.adminEmail && <p className="text-destructive text-xs">{form.formState.errors.adminEmail.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password *</label>
                  <Input type="password" placeholder="Create a password" {...form.register("adminPassword")} className="rounded-lg" />
                  {form.formState.errors.adminPassword && <p className="text-destructive text-xs">{form.formState.errors.adminPassword.message}</p>}
                  <p className="text-xs text-slate-500 dark:text-slate-400">Minimum 6 characters. Store this safely.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Referral Code</label>
                <Input placeholder="6-digit referral code (optional)" {...form.register("referralCode")} className="rounded-lg" />
                {form.formState.errors.referralCode && <p className="text-destructive text-xs">{form.formState.errors.referralCode.message}</p>}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
              <p className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" /> By registering, you agree to our service terms. Our team will contact you within 24 hours to complete the setup and data migration process.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-base sm:text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>

            {/* Bottom Info */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Your data is secure.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
