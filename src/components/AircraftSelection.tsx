//AircraftSelection.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { AircraftModel } from '@/lib/googleSheets';
import type { AircraftDetails } from '@/types/proposal';
import { getAircraftImages, imageUrlToBase64 } from '@/utils/aircraftImages';

interface AircraftSelectionProps {
  value: string;
  onChange: (value: string) => void;
  optionNumber: '1' | '2';
  onAircraftSelect: (details: AircraftDetails | null) => void;
}

const AircraftSelection: React.FC<AircraftSelectionProps> = ({
  value,
  onChange,
  onAircraftSelect
}) => {
  const [aircraft, setAircraft] = useState<AircraftModel[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
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
        console.error('Failed to load aircraft data:', err);
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
    const newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    onChange(newValue);

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
      onAircraftSelect(null);
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectAircraft = async (selectedAircraft: AircraftModel) => {
    const uppercaseModel = selectedAircraft.model.toUpperCase();
    setInputValue(uppercaseModel);
    onChange(uppercaseModel);
    
    const defaultImages = getAircraftImages(uppercaseModel);
    
    try {
      let interiorBase64, exteriorBase64;
      
      if (defaultImages?.interior) {
        interiorBase64 = await imageUrlToBase64(defaultImages.interior);
      }
      
      if (defaultImages?.exterior) {
        exteriorBase64 = await imageUrlToBase64(defaultImages.exterior);
      }
      
      const details = {
        cabinWidth: selectedAircraft.cabinWidth,
        cabinHeight: selectedAircraft.cabinHeight,
        baggageVolume: selectedAircraft.baggageVolume,
        passengerCapacity: selectedAircraft.passengerCapacity,
        defaultInteriorImageUrl: interiorBase64,
        defaultExteriorImageUrl: exteriorBase64,
        deliveryStart: selectedAircraft.deliveryStart
      };
      
      onAircraftSelect(details);
    } catch (error) {
      console.error('Error processing images:', error);
      onAircraftSelect({
        cabinWidth: selectedAircraft.cabinWidth,
        cabinHeight: selectedAircraft.cabinHeight,
        baggageVolume: selectedAircraft.baggageVolume,
        passengerCapacity: selectedAircraft.passengerCapacity,
        deliveryStart: selectedAircraft.deliveryStart 
      });
    }
    
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
      <input
  type="text"
  value={inputValue}
  onChange={handleInputChange}
  onBlur={() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }}
  placeholder="Start typing"
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white pr-10 [&:not(:placeholder-shown)]:uppercase"
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
              <div className="font-medium text-black uppercase">{aircraft.model}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AircraftSelection;