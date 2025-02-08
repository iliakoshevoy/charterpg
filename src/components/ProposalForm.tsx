// src/components/ProposalForm.tsx
"use client";
import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import type { ProposalPDFProps } from './ProposalPDF';

const AircraftSelection = dynamic(() => import('./AircraftSelection'), {
  ssr: false,
  loading: () => <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
});

const PDFGenerator = dynamic(() => import('./PDFGenerator'), {
  ssr: false,
  loading: () => (
    <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
      Loading...
    </button>
  )
});

const ProposalForm = () => {
  const [formData, setFormData] = useState<ProposalPDFProps>({
    customerName: '',
    departureDate: '',
    departureTime: '',
    departureAirport: '',
    arrivalAirport: '',
    passengerCount: '',
    comment: '',
    option1Name: '',
    option1Image: null,
    option1Details: null,
    option2Name: '',
    option2Image: null,
    option2Details: null,
});
  
  const [imagePreviews, setImagePreviews] = useState({
    option1: null as string | null,
    option2: null as string | null,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, option: 'option1' | 'option2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ 
          ...prev, 
          [`${option}Image`]: base64String 
        }));
        setImagePreviews(prev => ({
          ...prev,
          [option]: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
        const newData = { ...prev };
        
        // Type assertion to make TypeScript happy
        (newData as any)[name] = value;

        // If we're clearing the aircraft name, also clear its details
        if (name === 'option1Name' && !value) {
            newData.option1Details = null;
        } else if (name === 'option2Name' && !value) {
            newData.option2Details = null;
        }

        return newData;
    });
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Charter Proposal Generator
      </h1>
      
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Information</h2>
          
          {/* Customer Name and Passengers Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label htmlFor="passengerCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Passengers
              </label>
              <input
                type="text"
                id="passengerCount"
                name="passengerCount"
                value={formData.passengerCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Enter number of passengers"
              />
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Departure
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                Time of Departure
              </label>
              <input
                type="text"
                id="departureTime"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g., 14:30"
              />
            </div>
          </div>

          {/* Airports */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700 mb-1">
                Departure Airport
              </label>
              <input
                type="text"
                id="departureAirport"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g., LAX"
              />
            </div>
            <div>
              <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700 mb-1">
                Arrival Airport
              </label>
              <input
                type="text"
                id="arrivalAirport"
                name="arrivalAirport"
                value={formData.arrivalAirport}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g., JFK"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Add any additional comments..."
            />
          </div>
        </div>

        {/* Aircraft Options */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Aircraft Options</h2>
          
          {/* Option 1 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Option 1</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="option1Name" className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Type
                </label>
                <AircraftSelection
                  value={formData.option1Name}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      option1Name: value
                    }));
                  }}
                  optionNumber="1"
                  onAircraftSelect={(details) => {
                    setFormData(prev => ({
                      ...prev,
                      option1Details: details
                    }));
                  }}
                />
                {formData.option1Details && (
                  <div className="mt-2 text-sm text-gray-600">
                    {formData.option1Details.cabinWidth && formData.option1Details.cabinHeight && (
                      <p>Cabin: {formData.option1Details.cabinWidth} × {formData.option1Details.cabinHeight}</p>
                    )}
                    {formData.option1Details.baggageVolume && (
                      <p>Baggage Volume: {formData.option1Details.baggageVolume}</p>
                    )}
                    <p>Passenger Capacity: {formData.option1Details.passengerCapacity}</p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="option1Image" className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Image
                </label>
                <input
                  type="file"
                  id="option1Image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'option1')}
                  className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreviews.option1 && (
                  <div className="mt-2">
                    <img
                      src={imagePreviews.option1}
                      alt="Option 1 preview"
                      className="max-w-xs rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Option 2 */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-700">Option 2</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="option2Name" className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Type
                </label>
                <AircraftSelection
                  value={formData.option2Name}
                  onChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      option2Name: value
                    }));
                  }}
                  optionNumber="2"
                  onAircraftSelect={(details) => {
                    setFormData(prev => ({
                      ...prev,
                      option2Details: details
                    }));
                  }}
                />
                {formData.option2Details && (
                  <div className="mt-2 text-sm text-gray-600">
                    {formData.option2Details.cabinWidth && formData.option2Details.cabinHeight && (
                      <p>Cabin: {formData.option2Details.cabinWidth} × {formData.option2Details.cabinHeight}</p>
                    )}
                    {formData.option2Details.baggageVolume && (
                      <p>Baggage Volume: {formData.option2Details.baggageVolume}</p>
                    )}
                    <p>Passenger Capacity: {formData.option2Details.passengerCapacity}</p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="option2Image" className="block text-sm font-medium text-gray-700 mb-1">
                  Aircraft Image
                </label>
                <input
                  type="file"
                  id="option2Image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'option2')}
                  className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreviews.option2 && (
                  <div className="mt-2">
                    <img
                      src={imagePreviews.option2}
                      alt="Option 2 preview"
                      className="max-w-xs rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6">
          <PDFGenerator formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;