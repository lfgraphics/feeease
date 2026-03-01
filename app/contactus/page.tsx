import React from "react";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Building2, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="w-full py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/assets/logo-horizontal.png"
              alt="FeeEase Logo"
              width={140}
              height={50}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link
              href="/"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20 relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions about FeeEase? Our team is here to help you modernize your school management.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 h-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                <p className="text-slate-500">Fill out the form below and we'll get back to you within 18 working hours.</p>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Office Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="text-blue-600" />
                Head Office
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Cod Vista Office</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Shop Number 9, 1st Floor,<br />
                      SK Plaza Complex,<br />
                      Choteqazipur, Miyan Bazar Dakshini,<br />
                      Gorakhpur, Uttar Pradesh, 273001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Email Us</h4>
                    <a href="mailto:contact@codvista.com" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                      contact@codvista.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Call Us</h4>
                    <a href="tel:+916393440986" className="text-slate-600 text-sm hover:text-blue-600 transition-colors">
                      (+91) 6393 440 986
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-blue-400" />
                Support Hours
              </h3>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-white">Closed</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  Need urgent help? <a href="mailto:support@feeease.com" className="text-blue-400 hover:text-blue-300">Email Support Team</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section (Optional Placeholder) */}
      <div className="w-full h-96 bg-slate-200 relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.972328867336!2d83.3705!3d26.7565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ1JzIzLjQiTiA4M8KwMjInMTMuOCJF!5e0!3m2!1sen!2sin!4v1625641234567!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(1)" }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Office Location"
          ></iframe>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} FeeEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
