// components/FAQ.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FAQItem[] = [
    {
        question: "What is different compared to proposals made with Word, PowerPoint, or Pages?",
        answer: "The main difference is that you can create a proposal on the go on your mobile phone. Additionally, Charter PG can automatically add a flight map, jet cabin sizes, some generic interior images, and more. Plus, you can skip the formatting hassle that comes with office tools when creating proposals with multiple legs."
      },
    {
      question: "Can developers see my charter proposals or customer name?",
      answer: "No, PDF file generation happens locally in your browser, so developers do not have access to the generated proposals or their information."
    },
    {
      question: "What information do developers store?",
      answer: "The only information we store is the user's details, their company information added in the Settings tab, and a number of generated proposals for statistics purposes."
    },
    {
        question: "Can I add my company details and logo to the generated proposal?",
        answer: "Yes! Go to the Settings tab to customize your proposal."
      },
    {
        question: "Can I add Charter PG to my mobile phone's home screen?",
        answer: (
          <div className="space-y-4">
            <span>
              Yes! It's super easy and takes just 10 seconds. Follow these instructions: 
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Open www.charterpropgen.com in your mobile browser (Chrome, Safari, etc.)</li>
                <li>On iOS: tap the share icon in the top right corner and select "Add to Home Screen"</li>
                <li>On Android: tap the menu (three dots) and select "Add to Home Screen"</li>
              </ol>
              <p className="mt-2">Charter PG icon will appear now on your screen as any other mobile applications.</p>
            </span>
            <div className="flex justify-center mt-4">
              <div className="relative shadow-lg rounded-lg overflow-hidden">
                <Image 
                  src="/templates/CPG_add_to_mobile.png" 
                  alt="Add Charter PG to mobile home screen" 
                  width={500} 
                  height={420} 
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )
      },
    {
        question: "How much does Charter Prop Gen cost?",
        answer: "It is free and there are no plans in the foreaseably future to change this"
      },
    
    {
      question: "Are there any quick notes for airplane options?",
      answer: "Yes, try writing \"s,\" \"f,\" or \"e\" in the Notes field and it will give you suggestions for the most popular notes."
    },
    {
        question: "Can I have a custom-made proposal layout for my company?",
        answer: "Yes, we can try to accomodate this. Write us an email to info@charterpropgen.com"
      },
    {
      question: "I have a suggestion, a question, or found a bug!",
      answer: "Please email us at info@charterpropgen.com — we'll definitely reply!"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqItems.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <button
              className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
              <span className="text-blue-600">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-6 w-6 transform transition-transform duration-200 ${openIndex === index ? 'rotate-45' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[600px] py-4' : 'max-h-0 py-0'
              }`}
            >
              <div className="text-gray-600">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;