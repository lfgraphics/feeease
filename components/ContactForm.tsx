"use client";
import React, { useState } from "react";
import { submitContactForm } from "./ContactFormAction";
import { toast } from "sonner";

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
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center">Get in Touch</h2>
      {succeeded ? (
        <div className="text-center py-8">
          <p className="text-green-600 text-xl font-semibold mb-2">
            Message Sent Successfully!
          </p>
          <p className="text-gray-600">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
          <button 
            onClick={() => setSucceeded(false)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-gray-700 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              pattern=".{3,}"
              title="Name must be at least 3 characters"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="Your full name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="school" className="block mb-1 text-gray-700 font-medium">
              School/Coaching/Institute Name:
            </label>
            <input
              type="text"
              id="school"
              name="school"
              pattern=".{3,}"
              title="Institute name must be at least 3 characters"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="e.g. Modern Academy"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block mb-1 text-gray-700 font-medium">
              Contact Number:
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="e.g. 9876543210"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="studentsCount" className="block mb-1 text-gray-700 font-medium">
              Approximate Students in the Institute:
            </label>
            <input
              type="number"
              id="studentsCount"
              name="studentsCount"
              min={1}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="e.g. 500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="locality" className="block mb-1 text-gray-700 font-medium">
              Locality:
            </label>
            <input
              type="text"
              id="locality"
              pattern=".{3,}"
              name="locality"
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="City, State"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-1 text-gray-700 font-medium">
              Comment/Description:
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Tell us about your requirements..."
            ></textarea>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              type="reset"
              disabled={submitting}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200 disabled:opacity-70 flex justify-center items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default ContactForm;
