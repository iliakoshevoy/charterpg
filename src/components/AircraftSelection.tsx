//AircraftSelection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AircraftModel[]>([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    let isMounted = true;

    async function fetchAircraft() {
      setIsLoadingData(true);
      try {
        const response = await fetch('/api/aircraft');
        if (!response.ok) throw new Error('Failed to fetch aircraft data');
        const data = await response.json();
        if (isMounted) {
          setAircraft(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load aircraft data');
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    fetchAircraft();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.length > 0 && aircraft.length > 0) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);

      const timeoutId = setTimeout(() => {
        const filtered = aircraft.filter(plane =>
          plane.model.toLowerCase().includes(newValue.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoadingSuggestions(false);
      }, 150);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange('');
      onAircraftSelect(null);
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectAircraft = (selectedAircraft: AircraftModel) => {
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

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => {
            if (inputValue.length > 0 && aircraft.length > 0) {
              setIsLoadingSuggestions(true);
              const filtered = aircraft.filter(plane =>
                plane.model.toLowerCase().includes(inputValue.toLowerCase())
              );
              setSuggestions(filtered);
              setShowSuggestions(true);
              setIsLoadingSuggestions(false);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
            }, 200);
          }}
          placeholder="Start typing aircraft model..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white pr-10"
        />
        {(isLoadingData || isLoadingSuggestions) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((aircraft) => (
            <div
              key={aircraft.model}
              onClick={() => handleSelectAircraft(aircraft)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              <div className="font-medium text-black">{aircraft.model}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AircraftSelection;