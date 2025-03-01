// app/terms/page.tsx
"use client";

import React from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md my-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Use for Charter Proposal Generator</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing or using the Charter Proposal Generator web application ("the App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
          <p className="text-gray-700">
            The App allows users to create charter flight proposals in PDF format based on user-provided information, including flight details, private jet options, and company information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Data Privacy</h2>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.1 Data Ownership</h3>
          <p className="text-gray-700">
            All data entered into the App, including flight information, aircraft details, and company information, belongs solely to you, the user. The developer does not claim ownership of any content you submit.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.2 Data Access</h3>
          <p className="text-gray-700">
            <strong>The developer does not have access to the content of proposals generated through the App.</strong> The PDF generation process occurs locally within your browser, and completed proposals are not stored on our servers unless you explicitly save them to your account.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.3 Supabase Data Storage</h3>
          <p className="text-gray-700">
            When you use the App's authentication features and save company settings, this information is securely stored using Supabase. This data is used solely to enhance your user experience by allowing synchronization across devices.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3.4 Email Communications</h3>
          <p className="text-gray-700">
            The App uses Resend for sending verification and password reset emails. Email addresses provided for this purpose will only be used for account-related communications.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. User Accounts</h2>
          
          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.1 Account Creation</h3>
          <p className="text-gray-700">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4.2 Account Termination</h3>
          <p className="text-gray-700">
            We reserve the right to terminate accounts that violate these Terms of Use or remain inactive for an extended period.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Acceptable Use</h2>
          <p className="text-gray-700">
            You agree not to use the App to:
          </p>
          <ul className="list-disc ml-8 mt-2 text-gray-700">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Distribute malicious software</li>
            <li>Attempt to gain unauthorized access to the App or its related systems</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Intellectual Property</h2>
          <p className="text-gray-700">
            The App, including its code, design, and functionality, is the intellectual property of the developer. You may not copy, modify, distribute, or reverse engineer the App without explicit permission.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            The App is provided "as is" without warranties of any kind, either express or implied. The developer does not guarantee that the App will be error-free or uninterrupted.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Limitation of Liability</h2>
          <p className="text-gray-700">
            The developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the App.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Changes to Terms</h2>
          <p className="text-gray-700">
            The developer reserves the right to modify these Terms of Use at any time. Continued use of the App after such modifications constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Governing Law</h2>
          <p className="text-gray-700">
            These Terms of Use shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Use, please contact ilia@charterpropgen.com.
          </p>
        </section>

        <div className="text-gray-600 text-sm mt-8 border-t pt-4">
          Last Updated: 01.03.2025
        </div>

        <div className="mt-8 flex justify-center">
  <Link href="/">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
      Back to Main
    </button>
  </Link>
</div>
      </div>
    </Layout>
  );
}