import React from "react";
import { Shield, Target, Zap, LayoutDashboard, Database, Repeat, Eye } from "lucide-react";

export const metadata = {
  title: "About FeeEase - Clarity in Complexity",
  description: "FeeEase is a record-keeping and management suite designed for institutions that want clarity, control, and speed.",
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About FeeEase</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed font-medium">
            Managing records, payments, and operations shouldn’t feel like work.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-16">
            <p className="text-xl leading-relaxed text-muted-foreground">
              Most institutions today still run on scattered tools — spreadsheets, registers, calls, reminders, and manual tracking.
              It slows teams down, creates errors, and takes focus away from what actually matters.
            </p>
            <p className="text-2xl font-bold mt-8 text-foreground border-l-4 border-primary pl-6 py-2">
              FeeEase changes that.
            </p>
          </div>

          <hr className="my-16 border-border" />

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <LayoutDashboard className="text-primary" /> What we do
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              FeeEase is a <strong className="text-foreground">record-keeping and management suite</strong> designed for institutions that want clarity, control, and speed.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              From tracking records to managing collections and operations, everything lives in one structured system — simple to use, yet powerful enough to scale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="font-bold text-foreground">No clutter.</p>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="font-bold text-foreground">No unnecessary complexity.</p>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="font-bold text-foreground">Just what needs to be done.</p>
              </div>
            </div>
          </section>

          <hr className="my-16 border-border" />

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Why FeeEase exists</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Traditional systems either try to do everything and become complex, or solve only one problem and stay limited. FeeEase is built differently.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <p className="text-lg font-bold">Clarity over features</p>
              </div>
              <div className="flex gap-4 items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <p className="text-lg font-bold">Speed over process</p>
              </div>
              <div className="flex gap-4 items-center p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                <p className="text-lg font-bold">Structure over chaos</p>
              </div>
            </div>
            <p className="mt-8 text-muted-foreground italic">
              Because managing an institution is already hard — your system shouldn’t make it harder.
            </p>
          </section>

          <hr className="my-16 border-border" />

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Our approach</h2>
            <p className="text-lg text-muted-foreground mb-8">We design systems that:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex gap-3 bg-secondary/20 p-4 rounded-lg items-center text-foreground font-medium border border-border">
                <Zap size={18} className="text-primary shrink-0" /> Reduce manual work
              </li>
              <li className="flex gap-3 bg-secondary/20 p-4 rounded-lg items-center text-foreground font-medium border border-border">
                <Repeat size={18} className="text-primary shrink-0" /> Eliminate follow-ups
              </li>
              <li className="flex gap-3 bg-secondary/20 p-4 rounded-lg items-center text-foreground font-medium border border-border">
                <Database size={18} className="text-primary shrink-0" /> Keep records always in sync
              </li>
              <li className="flex gap-3 bg-secondary/20 p-4 rounded-lg items-center text-foreground font-medium border border-border">
                <Shield size={18} className="text-primary shrink-0" /> Give full control without friction
              </li>
            </ul>
            <p className="mt-8 text-center text-xl font-bold text-primary">
              Fast, predictable, and easy to operate
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="text-primary" /> Vision
              </h2>
              <p className="text-lg text-muted-foreground font-medium">To build a system where institutions run on clarity, not chaos.</p>
            </section>
            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-primary" /> Mission
              </h2>
              <p className="text-lg text-muted-foreground font-medium">To simplify how records, operations, and collections are managed — so teams can focus on growth, not admin work.</p>
            </section>
          </div>

          <section className="mb-20 bg-card p-12 rounded-3xl border border-border shadow-xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Brand Essence</h2>
            <p className="text-lg text-center mb-12 text-muted-foreground">FeeEase stands for <strong className="text-foreground italic">clarity in complexity</strong>.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold text-xl mb-3 text-primary">Clarity</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Everything is organized, visible, and easy to understand. No confusion, no hidden layers.</p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 text-primary">Control</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">You always know what’s happening — records, operations, and flows are structured and reliable.</p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 text-primary">Ease</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Powerful systems don’t have to be complicated. We remove unnecessary steps so work feels natural and fast.</p>
              </div>
            </div>
          </section>

          <div className="text-center pt-10">
            <p className="text-2xl font-bold text-foreground">
              Making systems work the way they should — simple, structured, and dependable.
            </p>
            <p className="mt-12 text-lg text-muted-foreground">
              FeeEase is not just about managing fees. <br />
              <strong className="text-foreground">It’s about running your system better.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
