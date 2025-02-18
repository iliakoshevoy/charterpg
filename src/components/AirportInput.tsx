//AirportInput.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [dataInitialized, setDataInitialized] = useState(false);

  const debouncedSearch = useMemo(() => {
    const debouncedFn = debounce((searchTerm: string, airportsData: Airport[]) => {
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
    }, 500);
  
    return debouncedFn;
  }, [setSuggestions, setIsLoadingSuggestions]);



  useEffect(() => {
    let isMounted = true;
    
    const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

    const initializeData = async () => {
      if (!dataInitialized) {
        setIsLoadingData(true);
        try {
          const cachedData = localStorage.getItem('airportsData');
          const cacheTimestamp = localStorage.getItem('airportsDataTimestamp');
          const now = Date.now();
          
          // Use cache if it exists and is less than 24 hours old
          if (cachedData && cacheTimestamp && (now - Number(cacheTimestamp)) < CACHE_DURATION) {
            const data = JSON.parse(cachedData);
            if (isMounted) {
              setAirports(data);
              setDataInitialized(true);
              setIsLoadingData(false);
            }
          }
          
          // Fetch fresh data if cache is expired or doesn't exist
          const response = await fetch('/api/airports');
          if (!response.ok) throw new Error('Failed to fetch airports');
          const data = await response.json();
          
          if (isMounted) {
            setAirports(data);
            setDataInitialized(true);
            localStorage.setItem('airportsData', JSON.stringify(data));
            localStorage.setItem('airportsDataTimestamp', String(now));
          }
        } catch (err) {
          console.error('Failed to load airports:', err);
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
      if (debouncedSearch) {
        (debouncedSearch as ReturnType<typeof debounce>).cancel?.();
      }
    };
  }, [dataInitialized, debouncedSearch]);

  useEffect(() => {
    if (airports.length > 0 && value) {
      const airport = airports.find(a => a.icao === value);
      if (airport) {
        setSelectedAirport(airport);
        const displayText = `${airport.icao}, ${airport.airportName}`;
        setDisplayValue(displayText);
      }
    }
  }, [airports, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    
    if (input.length >= 2) {
      setIsLoadingSuggestions(true);
      setShowSuggestions(true);
      debouncedSearch(input, airports);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (!selectedAirport) {
      onChange(input, input);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    const displayText = `${airport.icao}, ${airport.airportName}`;
    setDisplayValue(displayText);
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