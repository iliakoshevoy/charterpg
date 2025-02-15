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

const FlightLegs: React.FC<FlightLegsProps> = ({ legs, onChange }) => {
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
        <div className="flex space-x-4">
          <button
            onClick={addRoundTripLeg}
            className="mt-2 ml-0 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Round Trip
          </button>
          <button
            onClick={addNewLeg}
            className="mt-2 ml-0 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Leg
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightLegs;