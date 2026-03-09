"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolLogo: z.string().min(1, "School logo is required"), // Base64 string
  schoolShortName: z.string().optional(),
  schoolAddress: z.string().min(5, "Address must be at least 5 characters"),
  adminName: z.string().min(2, "Admin name must be at least 2 characters"),
  adminMobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  adminEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  adminPassword: z.string().min(6, "Password must be at least 6 characters"),
  plan: z.string(),
  features: z.object({
    whatsapp: z.boolean(),
    teachersLogin: z.boolean(),
    parentsLogin: z.boolean(),
    attendance: z.boolean(),
    payroll: z.boolean(),
  }),
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
      plan: "",
      features: {
        whatsapp: false,
        teachersLogin: false,
        parentsLogin: false,
        attendance: false,
        payroll: false,
      },
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
        form.setValue("features", {
            whatsapp: false,
            teachersLogin: false,
            parentsLogin: false,
            attendance: false,
            payroll: false,
        });
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
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto pb-10">
              {/* Basic Plan */}
              <div 
                  className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary overflow-hidden flex flex-col" 
              >
                  <div className="p-6 border-b border-border">
                      <h3 className="text-2xl font-bold text-center text-foreground">Basic Plan</h3>
                      <p className="text-center text-muted-foreground mt-2">Essential tools for school management</p>
                  </div>
                  <div className="p-6 space-y-4 flex-1">
                      <div className="flex items-center gap-2 text-foreground">
                          <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
                          <span>1N Thermal Printer Support</span>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="admin">
                              <AccordionTrigger>Admin Login</AccordionTrigger>
                              <AccordionContent>
                                  Complete control over school settings, fee structure, student data, and reports.
                              </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="staff">
                              <AccordionTrigger>Management Staff Login</AccordionTrigger>
                              <AccordionContent>
                                  Access to daily operations, fee collection, and student inquiries.
                              </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="attendance">
                              <AccordionTrigger>Attendance Staff Login</AccordionTrigger>
                              <AccordionContent>
                                  Dedicated login for marking and managing student attendance.
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                  </div>
                  <div className="p-6 bg-muted border-t border-border">
                      <Button className="w-full" onClick={() => handlePlanSelect("Basic")}>Select Basic</Button>
                  </div>
              </div>

              {/* Custom Plan */}
              <div 
                  className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-purple-500 overflow-hidden flex flex-col" 
              >
                  <div className="p-6 border-b border-border">
                      <h3 className="text-2xl font-bold text-center text-foreground">Custom Plan</h3>
                      <p className="text-center text-muted-foreground mt-2">Tailored features for advanced needs</p>
                  </div>
                  <div className="p-6 space-y-4 flex-1">
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4 text-purple-900 dark:text-purple-300">
                          <p className="font-medium text-center">Includes everything in Basic +</p>
                      </div>
                      
                      <div className="space-y-3 text-foreground">
                          <div className="font-semibold border-b border-border pb-2">Add-on Features:</div>
                          <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="text-purple-500 w-4 h-4 mt-1 flex-shrink-0" />
                                  <span className="text-sm">WhatsApp Automation (Notices, Reminders)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="text-purple-500 w-4 h-4 mt-1 flex-shrink-0" />
                                  <span className="text-sm">Teachers Login Portal</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="text-purple-500 w-4 h-4 mt-1 flex-shrink-0" />
                                  <span className="text-sm">Parents Login Portal</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="text-purple-500 w-4 h-4 mt-1 flex-shrink-0" />
                                  <span className="text-sm">Advanced Attendance System</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <CheckCircle2 className="text-purple-500 w-4 h-4 mt-1 flex-shrink-0" />
                                  <span className="text-sm">Payroll Management</span>
                              </li>
                          </ul>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-4 italic text-center">
                          * Select specific features in the next step. Billed per feature.
                      </p>
                  </div>
                  <div className="p-6 bg-muted border-t border-border">
                      <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50 text-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 dark:border-purple-800" onClick={() => handlePlanSelect("Custom")}>Select Custom</Button>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedPlan(null)} className="text-muted-foreground">
                &larr; Back to Plans
            </Button>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                Selected: {selectedPlan} Plan
            </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-primary mt-4">School Registration</CardTitle>
        <CardDescription className="text-center">Enter your details to complete registration.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Custom Features Selection */}
          {selectedPlan === "Custom" && (
              <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">Select Add-on Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                          <Checkbox id="whatsapp" 
                              checked={form.watch("features.whatsapp")}
                              onCheckedChange={(checked) => form.setValue("features.whatsapp", checked as boolean)}
                          />
                          <Label htmlFor="whatsapp">WhatsApp Automation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="teachers" 
                              checked={form.watch("features.teachersLogin")}
                              onCheckedChange={(checked) => form.setValue("features.teachersLogin", checked as boolean)}
                          />
                          <Label htmlFor="teachers">Teachers Login</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="parents" 
                              checked={form.watch("features.parentsLogin")}
                              onCheckedChange={(checked) => form.setValue("features.parentsLogin", checked as boolean)}
                          />
                          <Label htmlFor="parents">Parents Login</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="attendance" 
                              checked={form.watch("features.attendance")}
                              onCheckedChange={(checked) => form.setValue("features.attendance", checked as boolean)}
                          />
                          <Label htmlFor="attendance">Advanced Attendance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="payroll" 
                              checked={form.watch("features.payroll")}
                              onCheckedChange={(checked) => form.setValue("features.payroll", checked as boolean)}
                          />
                          <Label htmlFor="payroll">Payroll System</Label>
                      </div>
                  </div>
              </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">School Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <Input placeholder="e.g. Modern Academy" {...form.register("schoolName")} />
                {form.formState.errors.schoolName && <p className="text-destructive text-xs">{form.formState.errors.schoolName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Name (Optional)</label>
                <Input placeholder="e.g. MA" {...form.register("schoolShortName")} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">School Logo</label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 border-2 border-dashed border-input rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Logo Preview" fill className="object-contain" />
                  ) : (
                    <Upload className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload} 
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload your school logo (PNG, JPG, JPEG).</p>
                </div>
              </div>
              <input type="hidden" {...form.register("schoolLogo")} />
              {form.formState.errors.schoolLogo && <p className="text-destructive text-xs">{form.formState.errors.schoolLogo.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input placeholder="Full Address" {...form.register("schoolAddress")} />
              {form.formState.errors.schoolAddress && <p className="text-destructive text-xs">{form.formState.errors.schoolAddress.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border pb-2">Admin Contact Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Name</label>
                <Input placeholder="Full Name" {...form.register("adminName")} />
                {form.formState.errors.adminName && <p className="text-destructive text-xs">{form.formState.errors.adminName.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <Input placeholder="10-digit mobile number" {...form.register("adminMobile")} />
                {form.formState.errors.adminMobile && <p className="text-destructive text-xs">{form.formState.errors.adminMobile.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input type="email" placeholder="admin@school.com" {...form.register("adminEmail")} />
                {form.formState.errors.adminEmail && <p className="text-destructive text-xs">{form.formState.errors.adminEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" placeholder="******" {...form.register("adminPassword")} />
                {form.formState.errors.adminPassword && <p className="text-destructive text-xs">{form.formState.errors.adminPassword.message}</p>}
                <p className="text-xs text-muted-foreground">This will be used for your school admin login.</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Registration
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
