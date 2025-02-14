// src/components/AirportInput.tsx
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import type { Airport } from '@/lib/googleSheets';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

interface AirportInputProps {
  value: string;
  onChange: (value: string, fullDetails: string | null, coordinates?: { lat: string; lng: string }) => void;
  label: string;
  placeholder?: string;
}

const AirportInput: React.FC<AirportInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "Airport"
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Memoized debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm: string, airportsData: Airport[]) => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }

      const term = searchTerm.toLowerCase();
      const filtered = airportsData.filter(airport => 
        airport.icao.toLowerCase().includes(term) ||
        airport.airportName.toLowerCase().includes(term) ||
        airport.country.toLowerCase().includes(term)
      );
      
      setSuggestions(filtered);
      setIsLoadingSuggestions(false);
    }, 500), // 500ms delay
    []
  );

  // Initialize data loading
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      // Only fetch if we haven't initialized yet
      if (!dataInitialized) {
        setIsLoadingData(true);
        try {
          // Try to get from localStorage first
          const cachedData = localStorage.getItem('airportsData');
          let data;
          
          if (cachedData) {
            data = JSON.parse(cachedData);
            if (isMounted) {
              setAirports(data);
              setDataInitialized(true);
              setIsLoadingData(false);
            }
          }
          
          // Fetch fresh data in background
          const response = await fetch('/api/airports');
          if (!response.ok) throw new Error('Failed to fetch airports');
          data = await response.json();
          
          if (isMounted) {
            setAirports(data);
            setDataInitialized(true);
            // Cache the fresh data
            localStorage.setItem('airportsData', JSON.stringify(data));
          }
        } catch (err) {
          if (isMounted) {
            setError(err instanceof Error ? err.message : 'Failed to load airports');
          }
        } finally {
          if (isMounted) {
            setIsLoadingData(false);
          }
        }
      }
    };

    initializeData();
    return () => { 
      isMounted = false;
      debouncedSearch.cancel(); 
    };
  }, [dataInitialized, debouncedSearch]);

  // Effect to handle initial value and format display
  useEffect(() => {
    if (airports.length > 0 && value) {
      const airport = airports.find(a => a.icao === value);
      if (airport) {
        setSelectedAirport(airport);
        const displayText = `${airport.icao}, ${airport.airportName}`;
        setDisplayValue(displayText);
        setInputValue(displayText);
      }
    }
  }, [airports, value]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    setInputValue(input);
    
    if (input.length >= 2) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);
      debouncedSearch(input, airports);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Handle custom input (not in database)
    if (!selectedAirport) {
      onChange(input, input);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    const displayText = `${airport.icao}, ${airport.airportName}`;
    setDisplayValue(displayText);
    setInputValue(displayText);
    const fullDetails = `${airport.airportName}, ${airport.country} (${airport.icao})`;
    
    onChange(
      airport.icao, 
      fullDetails,
      airport.latitude && airport.longitude ? {
        lat: airport.latitude,
        lng: airport.longitude
      } : undefined
    );
    
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (displayValue.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
            }, 200);
          }}
          className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white pr-10 text-sm"
          placeholder={placeholder}
        />
        {(isLoadingData || isLoadingSuggestions) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
  <div className="absolute z-10 w-[130%] -left-[10%] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
    {suggestions.map((airport) => (
      <div
        key={airport.icao}
        onClick={() => handleSelectAirport(airport)}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
      >
        <div className="font-medium text-gray-900">
          {airport.airportName} ({airport.icao})
        </div>
        <div className="text-sm text-gray-600">
          {airport.country}
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default AirportInput;