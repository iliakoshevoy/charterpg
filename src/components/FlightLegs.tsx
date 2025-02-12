// src/components/FlightLegs.tsx
"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import FlightLeg from './FlightLeg';
import type { FlightLeg as FlightLegType } from '@/types/flight';

interface FlightLegsProps {
  legs: FlightLegType[];
  onChange: (legs: FlightLegType[]) => void;
}

const MAX_LEGS = 4;

const FlightLegs: React.FC<FlightLegsProps> = ({ legs, onChange }) => {
  const addLeg = () => {
    if (legs.length >= MAX_LEGS) return;

    const previousLeg = legs[legs.length - 1];
    const newLeg: FlightLegType = {
      id: crypto.randomUUID(),
      departureDate: '',
      departureTime: '',
      // Reverse the route from previous leg
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

  const updateLeg = (index: number, updatedLeg: FlightLegType) => {
    const newLegs = [...legs];
    newLegs[index] = updatedLeg;
    onChange(newLegs);
  };

  const removeLeg = (index: number) => {
    onChange(legs.filter((_, i) => i !== index));
  };

  // FlightLegs.tsx
return (
  <div className="space-y-4">
    {legs.map((leg, index) => (
      <FlightLeg
        key={leg.id}
        legNumber={index + 1}
        data={leg}
        onUpdate={(updatedLeg) => updateLeg(index, updatedLeg)}
        onRemove={index > 0 ? () => removeLeg(index) : undefined}
      />
    ))}

    {legs.length < MAX_LEGS && (
      <button
        onClick={addLeg}
        className="mt-2 ml-0 text-sm text-blue-600 hover:text-blue-800 flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Leg
      </button>
    )}
  </div>
);
};

export default FlightLegs;