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

    const newLeg: FlightLegType = {
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
        departure: {
          lat: '',
          lng: ''
        },
        arrival: {
          lat: '',
          lng: ''
        }
      }
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
        />
      ))}

      {legs.length < MAX_LEGS && (
        <button
          onClick={addLeg}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Flight Leg
        </button>
      )}
    </div>
  );
};

export default FlightLegs;