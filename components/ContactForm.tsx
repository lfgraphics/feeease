"use client";
import React from "react";
import { useForm, ValidationError } from "@formspree/react";

const ContactForm = () => {
  const [state, handleSubmit] = useForm("xyyraqwq");

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Get in Touch</h2>
      {state.succeeded ? (
        <p className="text-green-600 text-center mb-4">
          Thanks for choosing us and showing interest. We've got your details
          and will contact you shortly.
        </p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              pattern=".{3,}"
              className="border p-2 rounded-md w-full"
              required
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>
          <div className="mb-4">
            <label htmlFor="school" className="block mb-1">
              School/Coaching/Institute Name:
            </label>
            <input
              type="text"
              id="school"
              name="school"
              pattern=".{3,}"
              className="border p-2 rounded-md w-full"
              required
            />
            <ValidationError
              prefix="School"
              field="school"
              errors={state.errors}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block mb-1">
              Contact Number:
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              pattern="[0-9]{10}"
              className="border p-2 rounded-md w-full"
              required
            />
            <ValidationError
              prefix="Contact Number"
              field="contactNumber"
              errors={state.errors}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="border p-2 rounded-md w-full"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="studentsCount" className="block mb-1">
              Approximate Students in the Institute:
            </label>
            <input
              type="number"
              id="studentsCount"
              name="studentsCount"
              pattern=".{1,}"
              min={1}
              className="border p-2 rounded-md w-full"
              required
            />
            <ValidationError
              prefix="Students Count"
              field="studentsCount"
              errors={state.errors}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="locality" className="block mb-1">
              Locality:
            </label>
            <input
              type="text"
              id="locality"
              pattern=".{5,}"
              name="locality"
              className="border p-2 rounded-md w-full"
              required
            />
            <ValidationError
              prefix="Locality"
              field="locality"
              errors={state.errors}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-1">
              Comment/Description:
            </label>
            <textarea
              id="comment"
              name="comment"
              className="border p-2 rounded-md w-full"
            ></textarea>
            <ValidationError
              prefix="Comment"
              field="comment"
              errors={state.errors}
            />
          </div>
          <button
            type="submit"
            disabled={state.submitting}
            className="bg-blue-500 p-2 rounded-md hover:bg-blue-700 w-full text-white"
          >
            Submit
          </button>
        </>
      )}
    </form>
  );
};

export default ContactForm;
