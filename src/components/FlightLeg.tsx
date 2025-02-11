// src/components/FlightLeg.tsx
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {legNumber === 1 ? 'Flight Details' : `Leg ${legNumber}`}
        </h3>
        {onRemove && legNumber > 1 && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Remove leg"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`departureDate-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
              Date of Departure
            </label>
            <input
              type="date"
              id={`departureDate-${legNumber}`}
              value={data.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          <div>
            <label htmlFor={`departureTime-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
              Time of Departure
            </label>
            <input
              type="text"
              id={`departureTime-${legNumber}`}
              value={data.departureTime}
              onChange={(e) => handleInputChange('departureTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="e.g., 14:30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <AirportInput
            label="Departure Airport"
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
          <AirportInput
            label="Arrival Airport"
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
      </div>
    </div>
  );
};

export default FlightLeg;