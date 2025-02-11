//src/components/AircraftSelection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import type { AircraftModel } from '@/lib/googleSheets';

interface AircraftSelectionProps {
  value: string;
  onChange: (value: string) => void;
  optionNumber: '1' | '2';
  onAircraftSelect: (details: {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  } | null) => void;
}

const AircraftSelection: React.FC<AircraftSelectionProps> = ({
  value,
  onChange,
  onAircraftSelect
}) => {
  const [aircraft, setAircraft] = useState<AircraftModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AircraftModel[]>([]);
  const [inputValue, setInputValue] = useState(value);

  // Fetch aircraft data
  useEffect(() => {
    async function fetchAircraft() {
      try {
        const response = await fetch('/api/aircraft');
        if (!response.ok) throw new Error('Failed to fetch aircraft data');
        const data = await response.json();
        setAircraft(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load aircraft data');
      } finally {
        setLoading(false);
      }
    }

    fetchAircraft();
  }, []);

  // Update local input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.length > 0) {
      const filtered = aircraft.filter(plane =>
        plane.model.toLowerCase().includes(newValue.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange('');
      onAircraftSelect(null);
    }
  };

  const handleSelectAircraft = (selectedAircraft: AircraftModel) => {
    // Update both the display value and pass the full details
    setInputValue(selectedAircraft.model);
    onChange(selectedAircraft.model);
    onAircraftSelect({
      cabinWidth: selectedAircraft.cabinWidth,
      cabinHeight: selectedAircraft.cabinHeight,
      baggageVolume: selectedAircraft.baggageVolume,
      passengerCapacity: selectedAircraft.passengerCapacity
    });
    setShowSuggestions(false);
  };

  if (loading) {
    return <div className="animate-pulse h-10 bg-gray-100 rounded-md" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error loading aircraft data</div>;
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onClick={() => {
          if (inputValue.length > 0) {
            const filtered = aircraft.filter(plane =>
              plane.model.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          // Delay hiding suggestions to allow click events to fire
          setTimeout(() => {
            setShowSuggestions(false);
          }, 200);
        }}
        placeholder="Start typing aircraft model..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((aircraft) => (
            <div
              key={aircraft.model}
              onClick={() => handleSelectAircraft(aircraft)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              <div className="font-medium text-black">{aircraft.model}</div>
              <div className="text-sm text-black">
                {aircraft.cabinWidth && aircraft.cabinHeight && (
                  <>Cabin: {aircraft.cabinWidth} × {aircraft.cabinHeight}</>
                )}
                {aircraft.passengerCapacity && (
                  <> • {aircraft.passengerCapacity} passengers</>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AircraftSelection;