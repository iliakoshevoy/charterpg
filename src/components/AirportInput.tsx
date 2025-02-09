"use client";
import React, { useState, useEffect } from 'react';
import type { Airport } from '@/lib/googleSheets';

interface AirportInputProps {
  value: string;
  onChange: (value: string, fullDetails: string | null) => void;
  label: string;
  placeholder?: string;
}

const AirportInput: React.FC<AirportInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter airport code or name"
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  // Fetch airports data
  useEffect(() => {
    async function fetchAirports() {
      try {
        const response = await fetch('/api/airports');
        if (!response.ok) throw new Error('Failed to fetch airports');
        const data = await response.json();
        setAirports(data);

        // If we have a value, try to find the matching airport
        if (value) {
          const airport = data.find((a: Airport) => a.icao === value);
          if (airport) {
            setSelectedAirport(airport);
            setDisplayValue(`${airport.airportName} (${airport.icao})`);
            const fullDetails = `${airport.airportName}, ${airport.country} (${airport.icao})`;
            onChange(airport.icao, fullDetails);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load airports');
      } finally {
        setLoading(false);
      }
    }

    fetchAirports();
  }, []);

  // Update local input value when prop changes
  useEffect(() => {
    if (!value) {
      setSelectedAirport(null);
      setDisplayValue('');
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    setInputValue(input);
    
    // Handle custom input (not in database)
    if (!selectedAirport) {
      onChange(input, input);
    }

    if (input.length > 0) {
      const searchTerm = input.toLowerCase();
      const filtered = airports.filter(airport => 
        airport.icao.toLowerCase().includes(searchTerm) ||
        airport.airportName.toLowerCase().includes(searchTerm) ||
        airport.country.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedAirport(null);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    const displayText = `${airport.airportName} (${airport.icao})`;
    setDisplayValue(displayText);
    setInputValue(displayText);
    const fullDetails = `${airport.airportName}, ${airport.country} (${airport.icao})`;
    onChange(airport.icao, fullDetails);
    setShowSuggestions(false);
  };

  if (loading) {
    return <div className="animate-pulse h-10 bg-gray-100 rounded-md" />;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error loading airports</div>;
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (displayValue.length > 0) {
            const searchTerm = displayValue.toLowerCase();
            const filtered = airports.filter(airport => 
              airport.icao.toLowerCase().includes(searchTerm) ||
              airport.airportName.toLowerCase().includes(searchTerm) ||
              airport.country.toLowerCase().includes(searchTerm)
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 200);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
        placeholder={placeholder}
      />
      
      {selectedAirport && (
        <div className="mt-1 text-sm font-medium text-gray-600">
          {selectedAirport.airportName}, {selectedAirport.country}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
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