import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "FeeEase - Powerful Fee Management Tool",
  description:
    "FeeEase offers a powerful fee management solution with online and offline capabilities. Streamline fee collection, track payments, and manage student accounts effortlessly.",
  keywords:
    "Fee Management, Online Fee Collection, Offline Fee Management, Student Accounts, Payment Tracking",
  author: "FeeEase Team",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  canonical: "https://www.mysheetapp.com",
  openGraph: {
    type: "website",
    url: "https://www.mysheetapp.com",
    title: "FeeEase - Powerful Fee Management Tool",
    description:
      "FeeEase offers a powerful fee management solution with online and offline capabilities. Streamline fee collection, track payments, and manage student accounts effortlessly.",
    images: [
      {
        url: "https://www.mysheetapp.com/images/og-image.jpg",
        width: 800,
        height: 600,
        alt: "FeeEase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mysheetapp",
    title: "FeeEase - Powerful Fee Management Tool",
    description:
      "FeeEase offers a powerful fee management solution with online and offline capabilities. Streamline fee collection, track payments, and manage student accounts effortlessly.",
    image: "https://www.mysheetapp.com/images/twitter-image.jpg",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-900">
      <header className="w-full py-8 bg-blue-600 shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">FeeEase</h1>
          <nav>
            <Link
              href="/contactus"
              className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-transparent border border-white text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out ml-2"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="w-full py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8">
            <h2 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-blue-600">FeeEase</span>
            </h2>
            <p className="text-xl mb-4 text-gray-800">
              Effortlessly manage your school's fees with FeeEase. Our
              comprehensive fee management tool simplifies collection, tracks
              payments, and provides detailed analytics, all in one intuitive
              platform.
            </p>
            <ul className="text-lg list-disc list-inside text-gray-700 mb-8">
              <li>Streamline your fee collection process</li>
              <li>Real-time payment tracking and updates</li>
              <li>Customizable reports and analytics</li>
              <li>Seamless online and offline data access</li>
            </ul>
            <Link
              href="/contactus"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Get Started
            </Link>
          </div>
          <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
            <Image
              width={800}
              height={600}
              src="/images/home/dashboard.jpg"
              alt="FeeEase App Interface"
              className="rounded-lg shadow-lg "
            />
          </div>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3
            className="text-3xl font-bold text-center mb-8 bg-[url('/images/assets/yellowBrush.png')] bg-no-repeat bg-center"
            style={{ backgroundSize: "100% 100%" }}
          >
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Online and Offline Availability
              </h4>
              <p>
                Access your data anytime, anywhere, with weekly syncing or
                during every online session.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                On-Demand Product Installation
              </h4>
              <p>
                Get our web-based app installed on demand to suit your needs
                perfectly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Subscription-Based Model
              </h4>
              <p>
                Enjoy affordable installation and monthly costs, including a
                thermal printer setup for receipt printing.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Cost-Effective Solution
              </h4>
              <p>
                Our web-based app costs less than the fee of a single student,
                making it a highly economical choice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Easy and Friendly UI
              </h4>
              <p>
                Enjoy an intuitive interface similar to Excel, making navigation
                and usage a breeze.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Dashboard with Multiple Features
              </h4>
              <p>
                Access a comprehensive dashboard displaying total revenue,
                pending fees, payment reminders, and more, with detailed graphs
                for better visualization.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Easy Receipt Creation and Printing
              </h4>
              <p>
                Create and print receipts effortlessly, with automatic fee
                detection based on student class and month/exam of payment,
                along with a record of all past transactions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Manage Classes/Batches Separately
              </h4>
              <p>
                Easily manage and view data for each class or batch separately
                for better organization and efficiency.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Efficient Customer Support
              </h4>
              <p>
                Receive personalized customer support to address any queries or
                issues promptly and effectively.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h4 className="text-2xl font-semibold mb-2">
                Personalized Receipts and Accounts
              </h4>
              <p>
                Provide users with personalized receipts and accounts tailored
                to their branding preferences and our user-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-8 lg:mb-0">
              <h4 className="text-2xl font-semibold mb-2">
                Connect with Sales Team
              </h4>
              <p>
                Contact our sales team to discuss your requirements and provide
                your branding data.
              </p>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-8 lg:mb-0">
              <h4 className="text-2xl font-semibold mb-2">
                Personalized Setup
              </h4>
              <p>
                We'll create your personalized dashboard, set up your branded
                receipts, and provide a thermal printer for printing. On-demand
                1-on-1 training is also available.
              </p>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-2xl font-semibold mb-2">
                Start Your Subscription
              </h4>
              <p>
                Begin your subscription with a minimal initial investment and
                start managing your fees effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto">
        <section className="w-full py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-8">
              Benefits and Differences
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-semibold mb-4">
                  Benefits of FeeEase
                </h4>
                <ul className="list-disc list-inside">
                  <li>
                    <strong>Personalized Setup:</strong> Connect with our sales
                    team for tailored setup, including a personalized dashboard
                    and branded receipts.
                  </li>
                  <li>
                    <strong>Branded Receipts:</strong> Enhance your professional
                    image with branded receipts reflecting your organization's
                    identity.
                  </li>
                  <li>
                    <strong>On-Demand Training:</strong> Get up to speed quickly
                    with on-demand 1-on-1 training sessions for efficient
                    platform usage.
                  </li>
                  <li>
                    <strong>Thermal Printer Integration:</strong> Enjoy seamless
                    printing with a provided thermal printer for receipt
                    generation.
                  </li>
                  <li>
                    <strong>Minimal Initial Investment:</strong> Start your
                    subscription with a minimal upfront investment, ensuring
                    affordability.
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-semibold mb-4">
                  Differences from Other Solutions
                </h4>
                <ul className="list-disc list-inside">
                  <li>
                    <strong>Personalization:</strong> FeeEase offers a highly
                    personalized experience compared to generic fee management
                    solutions.
                  </li>
                  <li>
                    <strong>Thermal Printer Provision:</strong> Unlike other
                    platforms, FeeEase provides a thermal printer for
                    hassle-free receipt printing.
                  </li>
                  <li>
                    <strong>On-Demand Training:</strong> Benefit from on-demand
                    1-on-1 training, setting FeeEase apart from solutions with
                    limited support options.
                  </li>
                  <li>
                    <strong>Affordable Subscription Model:</strong> FeeEase
                    stands out with its affordable subscription model, making it
                    accessible to all.
                  </li>
                  <li>
                    <strong>Comprehensive Support:</strong> Receive
                    comprehensive customer support throughout your FeeEase
                    journey, ensuring a smooth experience.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8">Testimonials</h3>
          <div className="flex justify-center">
            <div className="max-w-3xl grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <Image
                    width={300}
                    height={300}
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="User 1"
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <div className="text-center mb-2">
                    <p className="text-lg font-semibold">John Doe</p>
                    <div className="flex justify-center">
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                    </div>
                  </div>
                  <p className="text-lg text-center">
                    "FeeEase has transformed our fee management process. It's
                    efficient and user-friendly, making our job so much easier."
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6">
                  <Image
                    width={300}
                    height={300}
                    src="https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="User 2"
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <div className="text-center mb-2">
                    <p className="text-lg font-semibold">Jane Smith</p>
                    <div className="flex justify-center">
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                      <Star className="fill-yellow-400 stroke-none scale-125 m-1" />
                    </div>
                  </div>
                  <p className="text-lg text-center">
                    "We can now track payments in real-time and generate custom
                    reports effortlessly. Highly recommend this tool!"
                  </p>
                </div>
              </div>
              {/* Add more testimonials here */}
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">
            Ready to streamline your fee management process?
          </p>
          <Link
            href="/contactus"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </footer>
    </div>
  );
}
