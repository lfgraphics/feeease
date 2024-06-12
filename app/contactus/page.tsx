import React from "react";
import ContactForm from "@/components/ContactForm";

const ContactUs = () => {
  return (
    <div className="container flex flex-col md:flex-row py-8 justify-center text-gray-900">
      {/* Contact Form */}
      <div className=" rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <ContactForm />
      </div>

      {/* Placeholder Contact Details */}
      <div className=" rounded-lg p-8 md:border-l-2">
        <h2 className="text-2xl font-bold mb-4">Contact Details</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Location 1</h3>
          <p>School/Institute Name</p>
          <p>Contact Number: +91 XXXXXXXXXX</p>
          <p>Email: example1@example.com</p>
          <p>Address: ABC Street, XYZ City</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Location 2</h3>
          <p>School/Institute Name</p>
          <p>Contact Number: +91 XXXXXXXXXX</p>
          <p>Email: example2@example.com</p>
          <p>Address: DEF Street, UVW City</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
