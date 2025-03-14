// src/components/ProposalForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AircraftOption from './AircraftOption';
import FlightLegs from '@/components/FlightLegs';
import type { FlightLeg } from '@/types/flight';
import type { AircraftDetails, AircraftOptionType, ProposalPDFProps } from '@/types/proposal';
import RecentSetupsPopover from './RecentSetupsPopover';

const PDFGenerator = dynamic(() => import('./PDFGenerator'), {
  ssr: false,
  loading: () => (
    <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
      Loading...
    </button>
  )
});


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

// Airport details state - used in PDF generation, don't remove
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
      notes: null,
      yearRefurbishment: null
    }
  ]);

  const handleAddOption = () => {
    if (aircraftOptions.length < 5) {
      setAircraftOptions(prev => [...prev, {
        id: String(prev.length + 1),
        name: '',
        image1: null,
        image2: null,
        details: null,
        imagePreview1: null,
        imagePreview2: null,
        yearOfManufacture: null,
        yearRefurbishment: null,
        price: null,
        paxCapacity: null,
        notes: null
      }]);
    }
  };

  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionUpdate = (index: number, updates: Partial<AircraftOptionType>) => {
    console.log('Updating aircraft option:', {
      index,
      updates,
      currentOptions: aircraftOptions[index],
      updateType: Object.keys(updates)[0]
    });
    setAircraftOptions(prev => {
      const newOptions = [...prev];
      newOptions[index] = { ...newOptions[index], ...updates };
      return newOptions;
    });
  };

  const handleRemoveOption = (index: number) => {
    setAircraftOptions(prev => prev.filter((_, i) => i !== index));
  };

  const [pdfResetTrigger, setPdfResetTrigger] = useState(0);

  const resetForm = () => {
    // Reset basic form data
    setBasicFormData({
      customerName: '',
      departureDate: '',
      departureTime: '',
      departureAirport: '',
      arrivalAirport: '',
      passengerCount: '',
      comment: '',
    });
  
    // Reset flight legs to initial state
    setFlightLegs([{
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
  
    // Reset airport details
    setAirportDetails({
      departure: null,
      arrival: null
    });
  
    // Reset aircraft options to initial state
    setAircraftOptions([{
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
      notes: null,
      yearRefurbishment: null
    }]);
    setPdfResetTrigger(prev => prev + 1);
    // Reset show map to default
    setShowMap(true);
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
    showMap,
    // Option 1
    option1Name: aircraftOptions[0]?.name || '',
    option1Image1: aircraftOptions[0]?.details?.defaultInteriorImageUrl || aircraftOptions[0]?.image1 || null,
    option1Image2: aircraftOptions[0]?.details?.defaultExteriorImageUrl || aircraftOptions[0]?.image2 || null,
    option1IsImage1Default: !!aircraftOptions[0]?.details?.defaultInteriorImageUrl && !aircraftOptions[0]?.image1,
    option1IsImage2Default: !!aircraftOptions[0]?.details?.defaultExteriorImageUrl && !aircraftOptions[0]?.image2,
    option1Details: aircraftOptions[0]?.details || null,
    option1YearOfManufacture: aircraftOptions[0]?.yearOfManufacture || null,
    option1Price: aircraftOptions[0]?.price || null,
    option1PaxCapacity: aircraftOptions[0]?.paxCapacity || null,
    option1Notes: aircraftOptions[0]?.notes || null,
    option1YearRefurbishment: aircraftOptions[0]?.yearRefurbishment || null,

    // Option 2
    option2Name: aircraftOptions[1]?.name || '',
    option2Image1: aircraftOptions[1]?.details?.defaultInteriorImageUrl || aircraftOptions[1]?.image1 || null,
    option2Image2: aircraftOptions[1]?.details?.defaultExteriorImageUrl || aircraftOptions[1]?.image2 || null,
    option2IsImage1Default: !!aircraftOptions[1]?.details?.defaultInteriorImageUrl && !aircraftOptions[1]?.image1,
    option2IsImage2Default: !!aircraftOptions[1]?.details?.defaultExteriorImageUrl && !aircraftOptions[1]?.image2,
    option2Details: aircraftOptions[1]?.details || null,
    option2YearOfManufacture: aircraftOptions[1]?.yearOfManufacture || null,
    option2Price: aircraftOptions[1]?.price || null,
    option2PaxCapacity: aircraftOptions[1]?.paxCapacity || null,
    option2Notes: aircraftOptions[1]?.notes || null,
    option2YearRefurbishment: aircraftOptions[1]?.yearRefurbishment || null,

    // Option 3
    option3Name: aircraftOptions[2]?.name || '',
    option3Image1: aircraftOptions[2]?.details?.defaultInteriorImageUrl || aircraftOptions[2]?.image1 || null,
    option3Image2: aircraftOptions[2]?.details?.defaultExteriorImageUrl || aircraftOptions[2]?.image2 || null,
    option3IsImage1Default: !!aircraftOptions[2]?.details?.defaultInteriorImageUrl && !aircraftOptions[2]?.image1,
    option3IsImage2Default: !!aircraftOptions[2]?.details?.defaultExteriorImageUrl && !aircraftOptions[2]?.image2,
    option3Details: aircraftOptions[2]?.details || null,
    option3YearOfManufacture: aircraftOptions[2]?.yearOfManufacture || null,
    option3Price: aircraftOptions[2]?.price || null,
    option3PaxCapacity: aircraftOptions[2]?.paxCapacity || null,
    option3Notes: aircraftOptions[2]?.notes || null,
    option3YearRefurbishment: aircraftOptions[2]?.yearRefurbishment || null,

    // Option 4
    option4Name: aircraftOptions[3]?.name || '',
    option4Image1: aircraftOptions[3]?.details?.defaultInteriorImageUrl || aircraftOptions[3]?.image1 || null,
    option4Image2: aircraftOptions[3]?.details?.defaultExteriorImageUrl || aircraftOptions[3]?.image2 || null,
    option4IsImage1Default: !!aircraftOptions[3]?.details?.defaultInteriorImageUrl && !aircraftOptions[3]?.image1,
    option4IsImage2Default: !!aircraftOptions[3]?.details?.defaultExteriorImageUrl && !aircraftOptions[3]?.image2,
    option4Details: aircraftOptions[3]?.details || null,
    option4YearOfManufacture: aircraftOptions[3]?.yearOfManufacture || null,
    option4Price: aircraftOptions[3]?.price || null,
    option4PaxCapacity: aircraftOptions[3]?.paxCapacity || null,
    option4Notes: aircraftOptions[3]?.notes || null,
    option4YearRefurbishment: aircraftOptions[3]?.yearRefurbishment || null,

    // Option 5
    option5Name: aircraftOptions[4]?.name || '',
    option5Image1: aircraftOptions[4]?.details?.defaultInteriorImageUrl || aircraftOptions[4]?.image1 || null,
    option5Image2: aircraftOptions[4]?.details?.defaultExteriorImageUrl || aircraftOptions[4]?.image2 || null,
    option5IsImage1Default: !!aircraftOptions[4]?.details?.defaultInteriorImageUrl && !aircraftOptions[4]?.image1,
    option5IsImage2Default: !!aircraftOptions[4]?.details?.defaultExteriorImageUrl && !aircraftOptions[4]?.image2,
    option5Details: aircraftOptions[4]?.details || null,
    option5YearOfManufacture: aircraftOptions[4]?.yearOfManufacture || null,
    option5Price: aircraftOptions[4]?.price || null,
    option5PaxCapacity: aircraftOptions[4]?.paxCapacity || null,
    option5Notes: aircraftOptions[4]?.notes || null,
    option5YearRefurbishment: aircraftOptions[4]?.yearRefurbishment || null,
  };
};

const [showMap, setShowMap] = useState(true);

  return (
    <div className="max-w-4xl mx-auto max-sm:p-2 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {/* Flight Information */}
        <div className="bg-white-50 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold text-gray-800">Flight Details</h2>
  <div className="flex items-center space-x-2">
    <RecentSetupsPopover
      onSetupSelect={(setup) => {
        setFlightLegs(setup.flightLegs);
        setBasicFormData(prev => ({
          ...prev,
          customerName: setup.customerName,
          comment: setup.comment
        }));
      }}
    />
    <button
      onClick={resetForm}
      className="p-1 hover:bg-gray-50 rounded-full"
      title="Reset Form"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-8 h-8 text-gray-600 hover:text-gray-800"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
  </div>
</div>
          
          {/* Flight Legs */}
          <div className="space-y-4">
          <FlightLegs
  legs={flightLegs}
  onChange={setFlightLegs}
  showMap={showMap}
  onShowMapChange={setShowMap}
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
  inputMode="text"
  autoComplete="off"
  autoCapitalize="words"
  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
  placeholder="Customer name"
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
  inputMode="text"
  autoComplete="off"
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
                  yearRefurbishment={option.yearRefurbishment}
                  onYearRefurbishmentChange={(value) => handleOptionUpdate(index, { yearRefurbishment: value })}
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


{/* Add button - now with responsive styling */}
{aircraftOptions.length < 5 && (
    <div className="mt-4 px-0 sm:px-6"> {/* Added padding control for mobile */}
      <button
        onClick={handleAddOption}
        className="w-full sm:w-auto flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 transition-colors py-3 sm:py-2 border border-blue-200 rounded-md hover:bg-blue-50 sm:border-0"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        <span>Add additional aircraft option</span>
      </button>
    </div>
  )}
</div>

        {/* Generate PDF Button */}
        <div className="mt-6">
          <PDFGenerator 
            formData={getPDFData()} 
            airportDetails={airportDetails}
            resetTrigger={pdfResetTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;