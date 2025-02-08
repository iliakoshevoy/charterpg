// src/components/AircraftSelection.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { aircraftModels } from '@/data/aircraftData';
import type { AircraftModel } from '@/data/aircraftData';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AircraftModel[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      onAircraftSelect(null);
      return;
    }

    const filtered = aircraftModels.filter(aircraft =>
      aircraft.model.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  }, [onChange, onAircraftSelect]);

  const handleSuggestionClick = useCallback((aircraft: AircraftModel) => {
    onChange(aircraft.model);
    onAircraftSelect({
      cabinWidth: aircraft.cabinWidth,
      cabinHeight: aircraft.cabinHeight,
      baggageVolume: aircraft.baggageVolume,
      passengerCapacity: aircraft.passengerCapacity
    });
    setShowSuggestions(false);
  }, [onChange, onAircraftSelect]);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    if (mounted) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mounted]);

  if (!mounted) return <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />;

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onClick={(e) => {
          e.stopPropagation();
          if (value.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder="Start typing aircraft model..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((aircraft) => (
            <div
              key={aircraft.id}
              onClick={() => handleSuggestionClick(aircraft)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              <div className="font-medium">{aircraft.model}</div>
              <div className="text-sm text-gray-500">
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