// /components/AirportInput.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import type { Airport } from '@/lib/googleSheets';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';
import { airportDbService } from '@/lib/airportDbService';

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

  // Helper function to format airport codes
  const formatAirportCodes = (airport: Airport): string => {
    if (airport.iata) {
      return `${airport.icao}/${airport.iata}`;
    }
    return airport.icao;
  };

  const debouncedSearch = useMemo(() => {
    return debounce(async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
        return;
      }

      try {
        const results = await airportDbService.searchAirports(searchTerm, 20);
        setSuggestions(results);
      } catch (error) {
        console.error('Error searching airports:', error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        setIsLoadingData(true);
        
        try {
          // Try to get data from IndexedDB first
          let airportsData = await airportDbService.getAllAirports();
          const isStale = await airportDbService.isCacheStale();
          
          // If no data in IndexedDB or it's stale, fetch from API
          if (airportsData.length === 0 || isStale) {
            console.log('Fetching fresh airport data from API...');
            const response = await fetch('/api/airports');
            
            if (!response.ok) {
              throw new Error('Failed to fetch airports');
            }
            
            const data = await response.json();
            
            // Store in IndexedDB
            await airportDbService.storeAirports(data);
            airportsData = data;
          }
          
          if (isMounted) {
            setAirports(airportsData);
          }
        } catch (err) {
          console.error('Failed to load airports:', err);
          
          // Try to use existing data from IndexedDB if API fetch fails
          try {
            const fallbackData = await airportDbService.getAllAirports();
            if (fallbackData.length > 0 && isMounted) {
              setAirports(fallbackData);
            }
          } catch (fallbackErr) {
            console.error('Failed to load fallback airport data:', fallbackErr);
          }
        } finally {
          if (isMounted) {
            setIsLoadingData(false);
          }
        }
      }
    };

    loadData();
    
    return () => { 
      isMounted = false;
      if (debouncedSearch) {
        debouncedSearch.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (airports.length > 0 && value) {
      const airport = airports.find(a => a.icao === value);
      if (airport) {
        setSelectedAirport(airport);
        const displayText = `${airport.airportName} (${formatAirportCodes(airport)})`;
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
      debouncedSearch(input);
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
    const displayText = `${airport.airportName} (${formatAirportCodes(airport)})`;
    setDisplayValue(displayText);
    
    onChange(
      airport.icao, 
      displayText,
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
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          className="w-full px-3 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white pr-10 text-sm"
          placeholder={placeholder}
        />
        {isLoadingData || isLoadingSuggestions ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        ) : null}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-[130%] -left-[10%] mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((airport) => (
            <div
              key={airport.icao}
              onClick={() => handleSelectAirport(airport)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <div className="font-bold text-gray-900">
                {formatAirportCodes(airport)}
              </div>
              <div className="text-sm text-gray-500">
                {airport.airportName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportInput;