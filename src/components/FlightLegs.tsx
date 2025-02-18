// src/components/FlightLegs.tsx
"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import FlightLeg from './FlightLeg';
import type { FlightLeg as FlightLegType } from '@/types/flight';

interface FlightLegsProps {
  legs: FlightLegType[];
  onChange: (legs: FlightLegType[]) => void;
  showMap?: boolean; // Add new prop
  onShowMapChange?: (showMap: boolean) => void; // Add new prop
}

const MAX_LEGS = 4;

const createEmptyLeg = (): FlightLegType => ({
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
});

const FlightLegs: React.FC<FlightLegsProps> = ({ 
  legs, 
  onChange,
  showMap = true, // Default to true 
  onShowMapChange
}) => {
  React.useEffect(() => {
    if (legs.length === 0) {
      onChange([createEmptyLeg()]);
    }
  }, [legs.length, onChange]);

  const addRoundTripLeg = () => {
    if (legs.length >= MAX_LEGS) return;

    const previousLeg = legs[legs.length - 1];
    const newLeg: FlightLegType = {
      id: crypto.randomUUID(),
      departureDate: '',
      departureTime: '',
      departureAirport: previousLeg?.arrivalAirport || '',
      arrivalAirport: previousLeg?.departureAirport || '',
      airportDetails: {
        departure: previousLeg?.airportDetails.arrival || null,
        arrival: previousLeg?.airportDetails.departure || null
      },
      coordinates: previousLeg ? {
        departure: previousLeg.coordinates?.arrival || {
          lat: '',
          lng: ''
        },
        arrival: previousLeg.coordinates?.departure || {
          lat: '',
          lng: ''
        }
      } : {
        departure: { lat: '', lng: '' },
        arrival: { lat: '', lng: '' }
      },
      passengerCount: previousLeg?.passengerCount || ''
    };

    onChange([...legs, newLeg]);
  };

  const addNewLeg = () => {
    if (legs.length >= MAX_LEGS) return;

    const previousLeg = legs[legs.length - 1];
    const newLeg: FlightLegType = {
      id: crypto.randomUUID(),
      departureDate: '',
      departureTime: '',
      departureAirport: previousLeg?.arrivalAirport || '',
      arrivalAirport: '',
      airportDetails: {
        departure: previousLeg?.airportDetails.arrival || null,
        arrival: null
      },
      coordinates: {
        departure: previousLeg?.coordinates?.arrival || {
          lat: '',
          lng: ''
        },
        arrival: {
          lat: '',
          lng: ''
        }
      },
      passengerCount: previousLeg?.passengerCount || ''
    };

    onChange([...legs, newLeg]);
  };

  const updateLeg = (index: number, updatedLeg: FlightLegType) => {
    const newLegs = [...legs];
    newLegs[index] = updatedLeg;
    onChange(newLegs);
  };

  const removeLeg = (index: number) => {
    onChange(legs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {legs.map((leg, index) => (
        <FlightLeg
          key={leg.id}
          legNumber={index + 1}
          data={leg}
          onUpdate={(updatedLeg) => updateLeg(index, updatedLeg)}
          onRemove={index > 0 ? () => removeLeg(index) : undefined}
          previousLegDate={index > 0 ? legs[index - 1].departureDate : undefined}
        />
      ))}

{legs.length < MAX_LEGS && (
  <div className="flex space-x-4 items-center">
    <button
      onClick={addRoundTripLeg}
      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
    >
      <Plus className="h-4 w-4 mr-1" />
      Round Trip
    </button>
    <button
      onClick={addNewLeg}
      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Leg
    </button>
    
    {/* Vertical separator */}
    <div className="h-5 w-px bg-gray-300 mx-4"></div>
    
    {/* Map Checkbox */}
    {onShowMapChange && (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="generateMap"
          checked={showMap}
          onChange={(e) => onShowMapChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="generateMap" className="ml-2 text-sm text-gray-700">
          Add Flight Map to PDF
        </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightLegs;