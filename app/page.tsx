import { Star, Banknote, CalendarCheck, Users, GraduationCap, Wallet, BarChart3, Printer, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "FeeEase - Complete School Management Solution",
  description:
    "FeeEase is the ultimate school management platform. Streamline fees, expenses, attendance, staff salaries, and student records in one powerful, easy-to-use application.",
  keywords:
    "School Management, Fee Collection, Expense Tracking, Attendance System, Salary Management, Staff Administration, Student Records",
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
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-blue-50 to-background dark:from-background dark:to-background relative overflow-hidden">
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
                Get Started Now
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
              <h4 className="text-xl font-bold mb-3 text-foreground">Staff & Salary Manager</h4>
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
      <section className="w-full py-24 bg-gradient-to-b from-card to-secondary/30">
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

          <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-border bg-card transform transition-transform hover:scale-[1.01] duration-500">
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
              <h3 className="text-3xl font-bold mb-6">Why Choose FeeEase?</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                We understand the unique challenges of managing a school. Our platform is built to solve real-world problems with features you&apos;ll actually use.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Printer size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Thermal Printer Integration</h5>
                    <p className="text-muted-foreground">Print professional receipts instantly. We provide the hardware you need.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Affordable Pricing</h5>
                    <p className="text-muted-foreground">Cost-effective subscription model that fits your school&apos;s budget.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-lg mb-1">Dedicated Support</h5>
                    <p className="text-muted-foreground">On-demand 1-on-1 training and priority customer support whenever you need it.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-3xl border border-border">
              <h4 className="text-xl font-bold mb-6">The FeeEase Advantage</h4>
              <ul className="space-y-4">
                {[
                  "Complete School Management Suite",
                  "Modern, Mobile-First Interface",
                  "Real-time Data Sync",
                  "Customizable Reports & Analytics",
                  "Branded Receipts with Thermal Printer",
                  "Dedicated 1-on-1 Support",
                  "Secure Cloud Storage (addition feature)",
                  "Automated WhatsApp Reminders (addition feature)",
                  "And any customization you need (addition feature)"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
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
      <section id="testimonials" className="w-full py-24 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-16 text-foreground">Trusted by Modern Schools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-lg shadow-muted/50">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">&quot;FeeEase has completely transformed how we manage our finances. The expense tracking and fee collection modules work seamlessly together.&quot;</p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                   <Image
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop"
                    alt="Principal"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">Principal, St. Xavier&apos;s</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-lg shadow-muted/50">
              <div className="flex gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">&quot;The attendance and salary management features save us hours of manual work every month. It&apos;s truly an all-in-one solution.&quot;</p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                   <Image
                    src="https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop"
                    alt="Admin"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Admin, Greenway School</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-lg shadow-muted/50">
              <div className="flex gap-1 mb-4">
                 {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">&quot;Finally, a system that looks modern and is easy to use. No more clunky spreadsheets. The parents love the digital receipts!&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  R
                </div>
                <div>
                  <p className="font-bold text-foreground">Robert Brown</p>
                  <p className="text-sm text-muted-foreground">Director, Modern Academy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/assets/pattern.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Modernize Your School?</h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            Join hundreds of schools that trust FeeEase for their daily operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
                href="/contactus"
                className="bg-background text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary shadow-xl transition-all hover:scale-105"
              >
                Schedule a Demo
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
