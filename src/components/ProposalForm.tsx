// src/components/ProposalForm.tsx
"use client";
import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus } from 'lucide-react'; 
import AircraftOption from './AircraftOption';
import FlightLegs from '@/components/FlightLegs';
import type { FlightLeg } from '@/types/flight';
import type { ProposalPDFProps, AircraftDetails, AircraftOptionType } from '@/types/proposal';

const PDFGenerator = dynamic(() => import('./PDFGenerator'), {
  ssr: false,
  loading: () => (
    <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
      Loading...
    </button>
  )
});

const MAX_LEGS = 4;

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

  const [flightLegs, setFlightLegs] = useState<FlightLeg[]>([{
    id: crypto.randomUUID(),
    departureDate: '',
    departureTime: '',
    departureAirport: '',
    arrivalAirport: '',
    airportDetails: {
      departure: null,
      arrival: null
    },
    coordinates: {
      departure: { lat: '', lng: '' },
      arrival: { lat: '', lng: '' }
    },
    passengerCount: ''
  }]);

  // Aircraft options state
  const [aircraftOptions, setAircraftOptions] = useState<AircraftOptionType[]>([
    {
      id: '1',
      name: '',
      image1: null,
      image2: null,
      details: null,
      imagePreview1: null,
      imagePreview2: null,
      yearOfManufacture: null,
      price: null,
      paxCapacity: null,
      notes: null
    }
  ]);

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
          imagePreview2: null,
          yearOfManufacture: null,
          price: null,
          paxCapacity: null,
          notes: null
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
      airportDetails: {
        departure: airportDetails.departure,
        arrival: airportDetails.arrival
      },
      ...basicFormData,
      flightLegs,
      option1Name: aircraftOptions[0]?.name || '',
      option1Image1: aircraftOptions[0]?.image1 || null,
      option1Image2: aircraftOptions[0]?.image2 || null,
      option1Details: aircraftOptions[0]?.details || null,
      option1YearOfManufacture: aircraftOptions[0]?.yearOfManufacture || null,
      option1Price: aircraftOptions[0]?.price || null,
      option1PaxCapacity: aircraftOptions[0]?.paxCapacity || null,
      option1Notes: aircraftOptions[0]?.notes || null,
      option2Name: aircraftOptions[1]?.name || '',
      option2Image1: aircraftOptions[1]?.image1 || null,
      option2Image2: aircraftOptions[1]?.image2 || null,
      option2Details: aircraftOptions[1]?.details || null,
      option2YearOfManufacture: aircraftOptions[1]?.yearOfManufacture || null,
      option2Price: aircraftOptions[1]?.price || null,
      option2PaxCapacity: aircraftOptions[1]?.paxCapacity || null,
      option2Notes: aircraftOptions[1]?.notes || null,
      option3Name: aircraftOptions[2]?.name || '',
      option3Image1: aircraftOptions[2]?.image1 || null,
      option3Image2: aircraftOptions[2]?.image2 || null,
      option3Details: aircraftOptions[2]?.details || null,
      option3YearOfManufacture: aircraftOptions[2]?.yearOfManufacture || null,
      option3Price: aircraftOptions[2]?.price || null,
      option3PaxCapacity: aircraftOptions[2]?.paxCapacity || null,
      option3Notes: aircraftOptions[2]?.notes || null,
      option4Name: aircraftOptions[3]?.name || '',
      option4Image1: aircraftOptions[3]?.image1 || null,
      option4Image2: aircraftOptions[3]?.image2 || null,
      option4Details: aircraftOptions[3]?.details || null,
      option4YearOfManufacture: aircraftOptions[3]?.yearOfManufacture || null,
      option4Price: aircraftOptions[3]?.price || null,
      option4PaxCapacity: aircraftOptions[3]?.paxCapacity || null,
      option4Notes: aircraftOptions[3]?.notes || null,
      option5Name: aircraftOptions[4]?.name || '',
      option5Image1: aircraftOptions[4]?.image1 || null,
      option5Image2: aircraftOptions[4]?.image2 || null,
      option5Details: aircraftOptions[4]?.details || null,
      option5YearOfManufacture: aircraftOptions[4]?.yearOfManufacture || null,
      option5Price: aircraftOptions[4]?.price || null,
      option5PaxCapacity: aircraftOptions[4]?.paxCapacity || null,
      option5Notes: aircraftOptions[4]?.notes || null,
    };
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {/* Flight Information */}
        <div className="bg-white-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flight Details</h2>
          
          {/* Flight Legs */}
          <div className="space-y-4">
            <FlightLegs
              legs={flightLegs}
              onChange={setFlightLegs}
            />
            
            {/* Prepared For and Notes fields */}
            <div className="flex gap-4 items-end mt-4">
              <div className="w-[300px]">
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prepared For
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={basicFormData.customerName}
                  onChange={handleBasicInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="w-[500px]">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  value={basicFormData.comment}
                  onChange={handleBasicInputChange}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="Special requests, pets, todlers, etc."
                />
              </div>
            </div>
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
                  yearOfManufacture={option.yearOfManufacture}
                  price={option.price}
                  paxCapacity={option.paxCapacity}
                  notes={option.notes}
                  onNameChange={(value) => handleOptionUpdate(index, { name: value })}
                  onDetailsChange={(details) => handleOptionUpdate(index, { details })}
                  onImage1Change={(image) => handleOptionUpdate(index, { image1: image })}
                  onImage2Change={(image) => handleOptionUpdate(index, { image2: image })}
                  onImagePreview1Change={(preview) => handleOptionUpdate(index, { imagePreview1: preview })}
                  onImagePreview2Change={(preview) => handleOptionUpdate(index, { imagePreview2: preview })}
                  onYearOfManufactureChange={(value) => handleOptionUpdate(index, { yearOfManufacture: value })}
                  onPriceChange={(value) => handleOptionUpdate(index, { price: value })}
                  onPaxCapacityChange={(value) => handleOptionUpdate(index, { paxCapacity: value })}
                  onNotesChange={(value) => handleOptionUpdate(index, { notes: value })}
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