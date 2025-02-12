// src/components/FlightLeg.tsx
// FlightLeg.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import AirportInput from '@/components/AirportInput';
import type { FlightLeg as FlightLegType } from '@/types/flight';

interface FlightLegProps {
  legNumber: number;
  data: FlightLegType;
  onUpdate: (data: FlightLegType) => void;
  onRemove?: () => void;
}

const FlightLeg: React.FC<FlightLegProps> = ({
  legNumber,
  data,
  onUpdate,
  onRemove
}) => {
  const handleInputChange = (field: keyof FlightLegType, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  const paxOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {legNumber > 1 ? `Leg #${legNumber}` : ' '}
        </h3>
        {legNumber > 1 && onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Remove leg"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-nowrap gap-4 items-end"> {/* Changed this line */}
        <div className="w-[300px]"> {/* Changed this line */}
          <AirportInput
            label="From"
            value={data.departureAirport}
            onChange={(value, fullDetails, coordinates) => {
              onUpdate({
                ...data,
                departureAirport: value,
                airportDetails: {
                  ...data.airportDetails,
                  departure: fullDetails
                },
                coordinates: {
                  departure: coordinates || {
                    lat: data.coordinates?.departure?.lat || '',
                    lng: data.coordinates?.departure?.lng || ''
                  },
                  arrival: data.coordinates?.arrival || {
                    lat: '',
                    lng: ''
                  }
                }
              });
            }}
          />
        </div>
        
        <div className="w-[300px]"> {/* Changed this line */}
          <AirportInput
            label="To"
            value={data.arrivalAirport}
            onChange={(value, fullDetails, coordinates) => {
              onUpdate({
                ...data,
                arrivalAirport: value,
                airportDetails: {
                  ...data.airportDetails,
                  arrival: fullDetails
                },
                coordinates: {
                  departure: data.coordinates?.departure || {
                    lat: '',
                    lng: ''
                  },
                  arrival: coordinates || {
                    lat: data.coordinates?.arrival?.lat || '',
                    lng: data.coordinates?.arrival?.lng || ''
                  }
                }
              });
            }}
          />
        </div>

        <div className="w-[160px]"> {/* Slightly increased width */}
          <label htmlFor={`departureDate-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
            Departure (local)
          </label>
          <input
            type="date"
            id={`departureDate-${legNumber}`}
            value={data.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>

        <div className="w-[100px]">

          <input
            type="text"
            id={`departureTime-${legNumber}`}
            value={data.departureTime}
            onChange={(e) => handleInputChange('departureTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="hh:mm"
          />
        </div>

        <div className="w-[80px]">
        <label htmlFor={`passengerCount-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
          PAX
        </label>
        <select
          id={`passengerCount-${legNumber}`}
          value={data.passengerCount || ''}
          onChange={(e) => handleInputChange('passengerCount', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        >
          <option value="">-</option>
          {paxOptions.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      </div>
    </div>
  );
};

export default FlightLeg;