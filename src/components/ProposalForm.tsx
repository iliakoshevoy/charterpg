"use client";
import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { ProposalPDFProps } from '@/types/proposal';
import AirportInput from '@/components/AirportInput';
import AircraftOption from './AircraftOption';

const PDFGenerator = dynamic(() => import('./PDFGenerator'), {
  ssr: false,
  loading: () => (
    <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
      Loading...
    </button>
  )
});

interface AircraftOptionType {
  id: string;
  name: string;
  image1: string | null;
  image2: string | null;
  details: {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  } | null;
  imagePreview1: string | null;
  imagePreview2: string | null;
}

const ProposalForm = () => {
  // Basic form data
  const [basicFormData, setBasicFormData] = useState({
    customerName: '',
    departureDate: '',
    departureTime: '',
    departureAirport: '',
    arrivalAirport: '',
    passengerCount: '',
    comment: '',
  });

  // Airport details state
  const [airportDetails, setAirportDetails] = useState({
    departure: null as string | null,
    arrival: null as string | null
  });

  // Aircraft options state
  const [aircraftOptions, setAircraftOptions] = useState<AircraftOptionType[]>([
    {
      id: '1',
      name: '',
      image1: null,
      image2: null,
      details: null,
      imagePreview1: null,
      imagePreview2: null
    }
  ]);

  // Handle adding new option when the last one is filled
// Handle adding new option when the last one is filled
useEffect(() => {
  const lastOption = aircraftOptions[aircraftOptions.length - 1];
  if (lastOption?.name && aircraftOptions.length < 5) {
    setAircraftOptions(prev => [
      ...prev,
      {
        id: String(prev.length + 1),
        name: '',
        image1: null,
        image2: null,
        details: null,
        imagePreview1: null,
        imagePreview2: null
      }
    ]);
  }
}, [aircraftOptions]);

  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionUpdate = (index: number, updates: Partial<AircraftOptionType>) => {
    setAircraftOptions(prev => {
      const newOptions = [...prev];
      newOptions[index] = { ...newOptions[index], ...updates };
      return newOptions;
    });
  };

  const handleRemoveOption = (index: number) => {
    setAircraftOptions(prev => prev.filter((_, i) => i !== index));
  };

  // Convert state to PDF props
  const getPDFData = (): ProposalPDFProps => {
    return {
      ...basicFormData,
      option1Name: aircraftOptions[0]?.name || '',
      option1Image1: aircraftOptions[0]?.image1 || null,
      option1Image2: aircraftOptions[0]?.image2 || null,
      option1Details: aircraftOptions[0]?.details || null,
      option2Name: aircraftOptions[1]?.name || '',
      option2Image1: aircraftOptions[1]?.image1 || null,
      option2Image2: aircraftOptions[1]?.image2 || null,
      option2Details: aircraftOptions[1]?.details || null,
      option3Name: aircraftOptions[2]?.name || '',
      option3Image1: aircraftOptions[2]?.image1 || null,
      option3Image2: aircraftOptions[2]?.image2 || null,
      option3Details: aircraftOptions[2]?.details || null,
      option4Name: aircraftOptions[3]?.name || '',
      option4Image1: aircraftOptions[3]?.image1 || null,
      option4Image2: aircraftOptions[3]?.image2 || null,
      option4Details: aircraftOptions[3]?.details || null,
      option5Name: aircraftOptions[4]?.name || '',
      option5Image1: aircraftOptions[4]?.image1 || null,
      option5Image2: aircraftOptions[4]?.image2 || null,
      option5Details: aircraftOptions[4]?.details || null,
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">

      
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flight Information</h2>
          
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
                value={basicFormData.customerName}
                onChange={handleBasicInputChange}
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
                value={basicFormData.passengerCount}
                onChange={handleBasicInputChange}
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
                value={basicFormData.departureDate}
                onChange={handleBasicInputChange}
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
                value={basicFormData.departureTime}
                onChange={handleBasicInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g., 14:30"
              />
            </div>
          </div>

          {/* Airports */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <AirportInput
              label="Departure Airport"
              value={basicFormData.departureAirport}
              onChange={(value, fullDetails) => {
                setBasicFormData(prev => ({
                  ...prev,
                  departureAirport: value
                }));
                setAirportDetails(prev => ({
                  ...prev,
                  departure: fullDetails
                }));
              }}
            />
            <AirportInput
              label="Arrival Airport"
              value={basicFormData.arrivalAirport}
              onChange={(value, fullDetails) => {
                setBasicFormData(prev => ({
                  ...prev,
                  arrivalAirport: value
                }));
                setAirportDetails(prev => ({
                  ...prev,
                  arrival: fullDetails
                }));
              }}
            />
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={basicFormData.comment}
              onChange={handleBasicInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Add any additional comments..."
            />
          </div>
        </div>

        {/* Aircraft Options */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Aircraft Options</h2>
          
          <div className="space-y-8">
            {aircraftOptions.map((option, index) => (
              <div
              key={option.id}
              className={`transform transition-all duration-500 ease-in-out ${
                index === aircraftOptions.length - 1 ? 'animate-slide-down' : ''
              }`}
            >
              <AircraftOption
                optionNumber={index + 1}
                name={option.name}
                details={option.details}
                image1={option.image1}
                image2={option.image2}
                imagePreview1={option.imagePreview1}
                imagePreview2={option.imagePreview2}
                onNameChange={(value) => handleOptionUpdate(index, { name: value })}
                onDetailsChange={(details) => handleOptionUpdate(index, { details })}
                onImage1Change={(image) => handleOptionUpdate(index, { image1: image })}
                onImage2Change={(image) => handleOptionUpdate(index, { image2: image })}
                onImagePreview1Change={(preview) => handleOptionUpdate(index, { imagePreview1: preview })}
                onImagePreview2Change={(preview) => handleOptionUpdate(index, { imagePreview2: preview })}
                onRemove={index > 0 ? () => handleRemoveOption(index) : undefined}
                className="mb-6"
              />
            </div>
          ))}
          </div>
        </div>

        {/* Generate PDF Button */}
        <div className="mt-6">
          <PDFGenerator 
            formData={getPDFData()} 
            airportDetails={airportDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;