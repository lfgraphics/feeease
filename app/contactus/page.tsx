import React from "react";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Building2, Clock } from "lucide-react";
import Script from "next/script";

const ContactUs = () => {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <div className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">We&apos;re here to help!</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Have questions about FeeEase? Our team is here to help you modernize your school management.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border h-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground">Fill out the form below and we&apos;ll get back to you within 18 working hours.</p>
                  <p className="text-sm mt-2">
                    Already registered? <a href="/contactus/school" className="text-primary hover:underline">Click here</a> to contact support for your school.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Office Card */}
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Building2 className="text-primary" />
                  Head Office
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-lg text-primary shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Cod Vista Office</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Shop Number 9, 1st Floor,<br />
                        SK Plaza Complex,<br />
                        Choteqazipur, Miyan Bazar Dakshini,<br />
                        Gorakhpur, Uttar Pradesh, 273001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-lg text-primary shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
                      <a href="mailto:contact@codvista.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        contact@codvista.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-secondary p-3 rounded-lg text-primary shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Call Us</h4>
                      <a href="tel:+916393440986" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                        (+91) 6393 440 986
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Hours Card */}
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                  <Clock className="text-primary" />
                  Support Hours
                </h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section (Optional Placeholder) */}
        <div className="w-full h-96 bg-muted relative">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.9172007566453!2d83.35708458048995!3d26.74701821678824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991455a9b6915eb%3A0x9ef224d4a9e6725a!2sCod%20Vista!5e0!3m2!1sen!2sin!4v1772403275631!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Office Location"
          >
          </iframe>
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

export default ContactUs;
