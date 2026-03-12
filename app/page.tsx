import { Star, Banknote, CalendarCheck, Users, GraduationCap, Wallet, BarChart3, Printer, ShieldCheck, Zap, CreditCard, Wrench, Settings, RefreshCw, TrendingUp, Smartphone, Lock, HardDrive, Target, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "FeeEase - Complete School Management Solution",
  description:
    "FeeEase is the ultimate school management platform. Streamline fees, expenses, attendance, staff salaries, and student records in one powerful, easy-to-use application.",
  keywords:
    "School Management, Fee Collection, Expense Tracking, Attendance System, Salary management, Staff Administration, Student Records",
  author: "FeeEase Team",
  robots: "index, follow",
  canonical: "https://fee-ease.vercel.app",
  openGraph: {
    type: "website",
    url: "https://fee-ease.vercel.app",
    title: "FeeEase - Complete School Management Solution",
    description:
      "Manage your entire school ecosystem with FeeEase. Fees, expenses, attendance, salaries, and more.",
    images: [
      {
        url: "/images/assets/logo.jpeg", // Assumed path
        width: 800,
        height: 600,
        alt: "FeeEase Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@feeease",
    title: "FeeEase - Complete School Management Solution",
    description:
      "Manage your entire school ecosystem with FeeEase. Fees, expenses, attendance, salaries, and more.",
    image: "/images/assets/logo.jpeg",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-b from-blue-50 to-background dark:from-background dark:to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-secondary/20 dark:bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center relative z-10">
          <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-foreground">
              The All-In-One <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                School Operating System
              </span>
            </h1>
            <p className="text-xl mb-8 text-muted-foreground leading-relaxed">
              Simplify your educational institution&apos;s management. From <strong>Fee Collection</strong> and <strong>Expense Tracking</strong> to <strong>Attendance</strong> and <strong>Staff Salaries</strong>, FeeEase brings everything into one intuitive, modern dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/get-started"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:-translate-y-1"
              >
                View Plans & Start
              </Link>
              <Link
                href="#features"
                className="bg-card text-foreground border border-border px-8 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-all"
              >
                Explore Features
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-border bg-card">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
               <Image
                width={800}
                height={600}
                src="/images/home/dashboard.png"
                alt="FeeEase Modern Dashboard"
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            {/* Floating Badges */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border flex items-center gap-3 animate-bounce-slow">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <Banknote size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Revenue</p>
                <p className="text-lg font-bold text-foreground">+25% Growth</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Powerful Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Everything You Need to Run Your School
            </h3>
            <p className="text-lg text-muted-foreground">
              Stop juggling multiple spreadsheets and disjointed software. FeeEase integrates all core administrative functions into a single, cohesive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Fee Management */}
            <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/10 transition-all duration-300 border border-border hover:border-blue-100 dark:hover:border-blue-900/50">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Smart Fee Management</h4>
              <p className="text-muted-foreground leading-relaxed">
                Automate fee collection, generate digital receipts, and track pending payments. Send automated reminders to parents via WhatsApp or SMS.
              </p>
            </div>

            {/* Feature 2: Expense Tracking */}
            <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-purple-100 dark:hover:shadow-purple-900/10 transition-all duration-300 border border-border hover:border-purple-100 dark:hover:border-purple-900/50">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Expense Tracking</h4>
              <p className="text-muted-foreground leading-relaxed">
                Keep a close eye on school expenditures. Categorize spending, upload bills, and generate monthly financial health reports.
              </p>
            </div>

            {/* Feature 3: Attendance */}
            <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/10 transition-all duration-300 border border-border hover:border-green-100 dark:hover:border-green-900/50">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Smart Attendance</h4>
              <p className="text-muted-foreground leading-relaxed">
                Mark student attendance digitally. View monthly reports, track absentees, and manage holiday calendars effortlessly.
              </p>
            </div>

            {/* Feature 4: Staff & Salary */}
            <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-orange-100 dark:hover:shadow-orange-900/10 transition-all duration-300 border border-border hover:border-orange-100 dark:hover:border-orange-900/50">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Staff & Salary Management</h4>
              <p className="text-muted-foreground leading-relaxed">
                Manage teacher profiles, and automate salary calculations. Generate payslips and maintain staff records securely.
              </p>
            </div>

            {/* Feature 5: Students */}
            <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-pink-100 dark:hover:shadow-pink-900/10 transition-all duration-300 border border-border hover:border-pink-100 dark:hover:border-pink-900/50">
              <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Student Profiles</h4>
              <p className="text-muted-foreground leading-relaxed">
                Detailed student profiles with academic history, fee records, and guardian contact information all in one place.
              </p>
            </div>

             {/* Feature 6: Modern UI */}
             <div className="group bg-secondary/50 p-8 rounded-2xl hover:bg-card hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/10 transition-all duration-300 border border-border hover:border-indigo-100 dark:hover:border-indigo-900/50">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Secure & Modern</h4>
              <p className="text-muted-foreground leading-relaxed">
                Bank-grade security meets modern design. No more clunky, excel-like interfaces. Experience a fluid, responsive app that works on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="w-full py-12 bg-gradient-to-b from-card to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Experience It Yourself</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Try the FeeEase Live Demo
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Explore the full power of FeeEase with our interactive demo. No sign-up required. 
              Test drive the features, see the interface, and experience the simplicity firsthand.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="https://try-fee-ease.vercel.app/"
                target="_blank"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-primary-foreground transition-all duration-200 bg-primary font-lg rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1"
              >
                <span className="mr-2">Launch Live Demo</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">
              * This is a read-only simulation. Data is stored locally in your browser.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-border bg-card transform transition-transform duration-500">
            <div className="absolute top-0 left-0 w-full h-8 bg-muted border-b border-border flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 bg-card px-3 py-1 rounded text-xs text-muted-foreground flex-1 text-center font-mono">
                try-fee-ease.vercel.app
              </div>
            </div>
            <div className="mt-8 aspect-video w-full bg-muted relative group">
                <iframe 
                    src="https://try-fee-ease.vercel.app/" 
                    className="w-full h-full border-0"
                    title="FeeEase Live Demo"
                    loading="lazy"
                ></iframe>
                <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-foreground/5 transition-colors duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="w-full py-20 bg-muted/50 text-foreground dark:bg-card dark:text-foreground dark:border-t dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold mb-6">Why Schools Love FeeEase</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 leading-tight">Managing your school shouldn't be complicated.</h3>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                <strong>FeeEase is a modern, technology-powered platform</strong> built to automate fee collection, simplify administration, and give schools complete control over their finances. Say goodbye to spreadsheets and manual work.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Printer size={22} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg mb-2 text-foreground">Seamless Receipt Printing</h5>
                    <p className="text-muted-foreground leading-relaxed">Instantly generate and print professional receipts with integrated thermal printer support — fast, reliable, and hassle-free.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg mb-2 text-foreground">Smart & Flexible Pricing</h5>
                    <p className="text-muted-foreground leading-relaxed">A scalable subscription model designed to fit schools of all sizes, keeping your costs predictable and affordable.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                    <Users size={22} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg mb-2 text-foreground">Dedicated Onboarding & Support</h5>
                    <p className="text-muted-foreground leading-relaxed">Get personalized onboarding, hands-on training, and priority support from our team whenever you need assistance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-secondary/30 p-10 rounded-3xl border border-border/50 shadow-xl">
              <h4 className="text-2xl font-bold mb-8 text-foreground">Complete Feature Suite</h4>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { icon: BarChart3, title: "Fee Management Suite", desc: "Automated collections, digital receipts, payment tracking" },
                  { icon: Settings, title: "Modern, Mobile-First Design", desc: "Beautiful interface on phones, tablets, and desktops" },
                  { icon: RefreshCw, title: "Real-time Sync & Updates", desc: "Live data across all users and departments" },
                  { icon: TrendingUp, title: "Advanced Analytics", desc: "Custom reports, financial dashboards, insights" },
                  { icon: Printer, title: "Professional Receipts", desc: "Branded thermal receipts with school logo" },
                  { icon: Users, title: "Team Support", desc: "Personalized training and priority assistance" },
                  { icon: Lock, title: "Enterprise Security", desc: "Bank-grade encryption and data protection" },
                  { icon: Smartphone, title: "WhatsApp Integration", desc: "Auto-send reminders, receipts, and alerts" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className="text-2xl flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"><item.icon size={20} /></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-secondary/20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-semibold mb-4">Simple, Transparent Pricing</span>
            <h3 className="text-5xl font-bold text-foreground mb-6">Plans built for schools of every size</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No surprises. No hidden fees. Just clear, honest pricing that scales with your school.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan Card */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 px-8 py-6 border-b border-border">
                <h3 className="text-2xl font-bold text-foreground mb-2">Standard Plan</h3>
                <p className="text-muted-foreground text-sm">Perfect for most schools</p>
              </div>
              <div className="px-8 py-8 flex-1 flex flex-col">
                <div className="mb-8">
                  <div className="text-5xl font-bold text-foreground mb-2">
                    ₹8,500
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">Installation (one-time)</p>
                  <div className="flex items-baseline gap-2 pb-4 border-b border-border">
                    <span className="text-4xl font-bold text-foreground">₹850</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Quarterly & annual billing available — save up to 12%</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-foreground mb-4">Everything you need:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold text-lg">✓</span>
                      <span className="text-foreground"><strong>Free thermal printer</strong> included</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold text-lg">✓</span>
                      <span className="text-foreground"><strong>Free data migration</strong> from your existing system</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Student & fee management</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Attendance tracking & reports</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>ID card generation</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Financial dashboards</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Email & phone support</span>
                    </li>
                  </ul>
                </div>

                <a href="/get-started" className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center">
                  Choose This Plan
                </a>
              </div>
            </div>

            {/* Professional Plan Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl shadow-2xl border-2 border-blue-300 dark:border-blue-700 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col relative ring-2 ring-blue-200 dark:ring-blue-800">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg shadow-lg flex gap-2">
                MOST POPULAR <Sparkles color="yellow" size={12} />
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white pt-14">
                <h3 className="text-2xl font-bold mb-2">Professional Plan</h3>
                <p className="text-blue-100 text-sm">All Standard features + Advanced capabilities</p>
              </div>
              <div className="px-8 py-8 flex-1 flex flex-col bg-white dark:bg-slate-950">
                <div className="mb-8">
                  <div className="text-5xl font-bold text-foreground mb-2">
                    ₹8,500
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">Installation (one-time) + Additional Features one-time fee</p>
                  <div className="flex items-baseline gap-2 pb-4 border-b border-blue-200 dark:border-blue-800">
                    <span className="text-4xl font-bold text-foreground">₹850</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Plus custom features based on your needs</p>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-foreground mb-4">Everything in Standard +</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-lg"><Star /></span>
                      <span className="text-foreground"><strong>WhatsApp automation</strong> for reminders & receipts</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-lg"><Star /></span>
                      <span className="text-foreground"><strong>Teachers & parents portals</strong> with real-time updates</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold"><Star /></span>
                      <span>Exam management & result publishing</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold"><Star /></span>
                      <span>Staff payroll calculations</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold"><Star /></span>
                      <span>Custom features & integrations</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="text-blue-600 dark:text-blue-400 font-bold"><Star /></span>
                      <span>Priority 1-on-1 support</span>
                    </li>
                  </ul>
                </div>

                <a href="/get-started" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl">
                  Get Onboarded Now
                </a>
              </div>
            </div>
          </div>

          {/* Pricing Features */}
          <div className="mt-20 max-w-5xl mx-auto">
            <h4 className="text-2xl font-bold text-center mb-12 text-foreground">What's Included in Both Plans</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-orange-500"><Wrench size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Setup & Migration</h5>
                  <p className="text-sm text-muted-foreground">Our team handles all setup & assists in data migration</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-blue-500"><Smartphone size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Mobile & Web</h5>
                  <p className="text-sm text-muted-foreground">Access anywhere, anytime on any device</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-red-500"><Lock size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Security</h5>
                  <p className="text-sm text-muted-foreground">Bank-grade encryption & daily backups</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-purple-500"><HardDrive size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Unlimited Storage</h5>
                  <p className="text-sm text-muted-foreground">Store all your school data safely in cloud</p>
                  <p className="text-sm text-muted-foreground">Requires additional storage cost after using 512MB text data & 25Gb of media, Which is enough for almost all schools.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-green-500"><TrendingUp size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">No Hidden Fees</h5>
                  <p className="text-sm text-muted-foreground">Transparent pricing, period. Nothing sneaky.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 bg-card rounded-xl border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                <div className="text-3xl flex-shrink-0 text-indigo-500"><Target size={24} /></div>
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Scale Anytime</h5>
                  <p className="text-sm text-muted-foreground">Add features whenever your school grows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Simple Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">How to Get Started</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border relative text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 border-4 border-card">1</div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Connect with Sales</h4>
              <p className="text-muted-foreground">
                Contact our team to discuss your school&apos;s specific needs. We&apos;ll tailor a package just for you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border relative text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 border-4 border-card">2</div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Personalized Setup</h4>
              <p className="text-muted-foreground">
                We set up your dashboard, configure your branded receipts, and install your <strong>thermal printer</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border relative text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 border-4 border-card">3</div>
              <h4 className="text-xl font-bold mb-3 text-foreground">Go Live</h4>
              <p className="text-muted-foreground">
                Start managing your school efficiently. Enjoy 1-on-1 training and ongoing support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="w-full py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">TRUSTED BY SCHOOLS</span>
            <h3 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Loved by School Leaders Across India</h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">See how top schools are transforming their operations with FeeEase</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-base leading-relaxed">"FeeEase cut our fee management work in half. The thermal printer receipts are so professional, and parents get instant WhatsApp notifications. Game-changer for our school!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  RP
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Rajesh Patel</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Principal, Delhi Public School</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-base leading-relaxed">"No hidden charges, transparent everything. Our finance team loves the automated reports. Setup was quick, migration was painless, and support was phenomenal!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  MS
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Meera Singh</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Finance Manager, Sunrise Academy</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-base leading-relaxed">"Modern, sleek interface. Zero learning curve for our staff. The real-time sync and unlimited storage mean we never worry about data. Highly recommend FeeEase!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                  AV
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Ananya Verma</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Administrator, Lakshmi Narayan School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/assets/pattern.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 leading-tight">Ready to Transform Your School?</h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join hundreds of schools already using FeeEase to automate operations, reduce admin burden, and focus on what matters most — education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
                href="/get-started"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-100 text-slate-900 font-bold px-10 py-4 rounded-lg shadow-xl transition-all hover:scale-105"
              >
                View Plans & Pricing
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white border-2 border-white font-bold px-10 py-4 rounded-lg transition-all hover:scale-105"
              >
                Schedule a Demo
              </Link>
          </div>
            <p className="text-slate-400 text-sm mt-8">
              Want to explore the features first?{" "}
              <a href="https://try-fee-ease.vercel.app" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">
                Try our demo
              </a>
            </p>
        </div>
      </section>
    </div>
  );
}
