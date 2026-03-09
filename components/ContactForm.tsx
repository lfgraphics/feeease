"use client";
import React, { useState } from "react";
import { submitContactForm } from "./ContactFormAction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSucceeded(true);
        form.reset();
      } else {
        toast.error(result.error || "There was an error submitting the form.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error("There was an error submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Get in Touch</h2>
      {succeeded ? (
        <div className="text-center py-8">
          <p className="text-green-600 dark:text-green-400 text-xl font-semibold mb-2">
            Message Sent Successfully!
          </p>
          <p className="text-muted-foreground">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
          <Button 
            variant="link"
            onClick={() => setSucceeded(false)}
            className="mt-4"
          >
            Send another message
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">
              Name:
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              pattern=".{3,}"
              title="Name must be at least 3 characters"
              required
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">
              School/Coaching/Institute Name:
            </Label>
            <Input
              type="text"
              id="school"
              name="school"
              pattern=".{3,}"
              title="Institute name must be at least 3 characters"
              required
              placeholder="e.g. Modern Academy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">
              Contact Number:
            </Label>
            <Input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              required
              placeholder="e.g. 9876543210"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email:
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentsCount">
              Approximate Students in the Institute:
            </Label>
            <Input
              type="number"
              id="studentsCount"
              name="studentsCount"
              min={1}
              required
              placeholder="e.g. 500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locality">
              Locality:
            </Label>
            <Input
              type="text"
              id="locality"
              pattern=".{3,}"
              name="locality"
              required
              placeholder="City, State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">
              Comment/Description:
            </Label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              placeholder="Tell us about your requirements..."
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              type="reset"
              variant="secondary"
              disabled={submitting}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 shadow-md shadow-blue-200 dark:shadow-blue-900/20"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ContactForm;
