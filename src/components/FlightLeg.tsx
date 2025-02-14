// src/components/FlightLeg.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AirportInput from '@/components/AirportInput';
import type { FlightLeg as FlightLegType } from '@/types/flight';

interface FlightLegProps {
  legNumber: number;
  data: FlightLegType;
  onUpdate: (data: FlightLegType) => void;
  onRemove?: () => void;
  previousLegDate?: string;
}

const FlightLeg: React.FC<FlightLegProps> = ({
  legNumber,
  data,
  onUpdate,
  onRemove,
  previousLegDate
}) => {
  const [dateError, setDateError] = useState<string | null>(null);

  const validateDate = (date: string) => {
    if (!date) return null;

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (selectedDate < today) {
      return "Date cannot be in the past";
    }

    if (previousLegDate) {
      const prevDate = new Date(previousLegDate);
      if (selectedDate < prevDate) {
        return "Date cannot be earlier than previous leg";
      }
    }

    return null;
  };

  useEffect(() => {
    if (data.departureDate) {
      const error = validateDate(data.departureDate);
      setDateError(error);
    } else {
      setDateError(null);
    }
  }, [data.departureDate, previousLegDate]);

  const handleInputChange = (field: keyof FlightLegType, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  const formatTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    const truncated = digits.slice(0, 4);
    const paddedTime = truncated.padEnd(4, '0');
    const hours = paddedTime.slice(0, 2);
    const minutes = paddedTime.slice(2, 4);
    const validHours = Math.min(parseInt(hours), 23).toString().padStart(2, '0');
    const validMinutes = Math.min(parseInt(minutes), 59).toString().padStart(2, '0');
    return `${validHours}:${validMinutes}`;
  };

  const paxOptions = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        {legNumber > 1 && onRemove && (
          <button
            onClick={onRemove}
            className="text-blue-800 hover:text-blue-600 transition-colors"
            title="Remove leg"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <h3 className="text-sm font-medium text-gray-700">
          {legNumber > 1 ? `Leg #${legNumber}` : ' '}
        </h3>
      </div>

      <div className="flex flex-nowrap gap-4 items-end"> 
        <div className="w-[300px]"> 
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
        
        <div className="w-[300px]">
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

        <div className="w-[160px]"> 
          <label htmlFor={`departureDate-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
            Departure (local)
          </label>
          <div className="relative">
          <input
  type="date"
  id={`departureDate-${legNumber}`}
  value={data.departureDate}
  onChange={(e) => handleInputChange('departureDate', e.target.value)}
  className={`w-full px-3 py-[0.4rem] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white
    [&:not(:valid)]:text-gray-400 text-gray-900 h-[38px]
    ${dateError ? 'border-red-500' : 'border-gray-500'}`}
/>
            {dateError && (
              <div className="absolute left-0 -bottom-6 text-red-500 text-xs">
                {dateError}
              </div>
            )}
          </div>
        </div>

        <div className="w-[100px]">
  <label htmlFor={`departureTime-${legNumber}`} className="block text-sm font-medium text-gray-700 mb-1">
    Time
  </label>
  <input
  type="text"
  id={`departureTime-${legNumber}`}
  value={data.departureTime}
  onChange={(e) => handleInputChange('departureTime', e.target.value)}
  onBlur={(e) => handleInputChange('departureTime', formatTimeInput(e.target.value))}
  className="w-full px-3 py-[0.4rem] border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
            className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value=""></option>
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