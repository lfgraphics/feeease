# FeeEase Platform

The central hub and primary landing page for the FeeEase School Management Ecosystem. Accessible via [feeease.com](https://feeease.com).

## 📊 Overview

The FeeEase Platform serves as the digital storefront and administrative entry point for educational institutions. It facilitates school registration, provides information about the system's capabilities, and acts as the gateway to the more specialized modules like **Modern Nursery**.

## 🛠 Microservice Architecture

The FeeEase system is built as a distributed microservice architecture to ensure scalability and separation of concerns:

- **[FeeEase Platform](https://github.com/lfgraphics/feeease)**: This project - the central hub and public-facing site.
- **[Modern Nursery](https://github.com/lfgraphics/feeease)**: The primary School Management System (SMS). A secure, role-based application for registered schools to manage students, fees, and staff.
- **[FeeEase Worker](https://github.com/lfgraphics/feeease-worker)**: A high-performance background worker handling asynchronous tasks such as WhatsApp broadcasting, automated reminders, and future biometric integrations.
- **[Try FeeEase](https://github.com/lfgraphics/try-school-management)**: A browser-based trial environment ([try.feeease.com](https://try.feeease.com)) that allows prospective schools to explore the system with zero-configuration and local storage.

## 🚀 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Authentication**: NextAuth.js
- **Database**: MongoDB (via Mongoose)
- **State Management**: React Context API

## 🚦 Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.
