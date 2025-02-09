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
  placeholder = "Enter ICAO code"
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

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
    setInputValue(value);
    if (!value) {
      setSelectedAirport(null);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toUpperCase();
    setInputValue(input);
    onChange(input, null); // Clear full details when input changes
    setSelectedAirport(null);

    if (input.length > 0) {
      const filtered = airports.filter(airport => 
        airport.icao.toLowerCase().startsWith(input.toLowerCase()) ||
        airport.airportName.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setSelectedAirport(airport);
    setInputValue(airport.icao);
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
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (inputValue.length > 0) {
            const filtered = airports.filter(airport => 
              airport.icao.toLowerCase().startsWith(inputValue.toLowerCase()) ||
              airport.airportName.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          // Delay hiding suggestions to allow click events to fire
          setTimeout(() => {
            setShowSuggestions(false);
            // If no airport was selected but we have a value, reset to selected airport
            if (!selectedAirport && value) {
              setInputValue(value);
            }
          }, 200);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white uppercase"
        placeholder={placeholder}
        maxLength={4}
      />
      
      {selectedAirport && (
        <div className="mt-1 text-sm text-gray-500">
          {selectedAirport.airportName}, {selectedAirport.country}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((airport) => (
            <div
              key={airport.icao}
              onClick={() => handleSelectAirport(airport)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
            >
              <div className="font-medium">{airport.icao}</div>
              <div className="text-sm text-gray-500">
                {airport.airportName}, {airport.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportInput;