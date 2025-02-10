"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import ImageUploadArea from '@/components/ImageUploadArea';

const AircraftSelection = dynamic(() => import('./AircraftSelection'), {
  ssr: false,
  loading: () => <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
});

interface AircraftDetails {
  cabinWidth: string | null;
  cabinHeight: string | null;
  baggageVolume: string | null;
  passengerCapacity: string;
}

interface AircraftOptionProps {
  optionNumber: number;
  name: string;
  details: AircraftDetails | null;
  image1: string | null;
  image2: string | null;
  imagePreview1: string | null;
  imagePreview2: string | null;
  yearOfManufacture: string | null;  // Added
  price: string | null;              // Added
  paxCapacity: string | null;        // Added
  notes: string | null;              // Added
  onNameChange: (value: string) => void;
  onDetailsChange: (details: AircraftDetails | null) => void;
  onImage1Change: (image: string | null) => void;
  onImage2Change: (image: string | null) => void;
  onImagePreview1Change: (preview: string | null) => void;
  onImagePreview2Change: (preview: string | null) => void;
  onYearOfManufactureChange: (value: string | null) => void;  // Added
  onPriceChange: (value: string | null) => void;              // Added
  onPaxCapacityChange: (value: string | null) => void;        // Added
  onNotesChange: (value: string | null) => void;    
  onRemove?: () => void;
  className?: string;
}

const AircraftOption: React.FC<AircraftOptionProps> = ({
  optionNumber,
  name,
  details,
  image1,
  image2,
  imagePreview1,
  imagePreview2,
  yearOfManufacture,
  price,
  paxCapacity,
  notes,
  onNameChange,
  onDetailsChange,
  onImage1Change,
  onImage2Change,
  onImagePreview1Change,
  onImagePreview2Change,
  onYearOfManufactureChange,
  onPriceChange,
  onPaxCapacityChange,
  onNotesChange,
  onRemove,
  className = ""
}) => {
  const hasContent = Boolean(name || image1 || image2 || yearOfManufacture || price || paxCapacity || notes);

  return (
    <div className={`space-y-3 transition-all duration-300 ease-in-out ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Option {optionNumber}</h3>
        {onRemove && optionNumber > 1 && hasContent && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove Option
          </button>
        )}
      </div>

      {/* Aircraft Type and Year of Manufacture row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft Type
          </label>
          <AircraftSelection
            value={name}
            onChange={onNameChange}
            optionNumber={optionNumber.toString() as '1' | '2'}
            onAircraftSelect={(newDetails) => {
              onDetailsChange(newDetails);
              // Auto-populate pax capacity when aircraft is selected
              if (newDetails) {
                onPaxCapacityChange(newDetails.passengerCapacity);
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year of Manufacture
          </label>
          <input
            type="text"
            value={yearOfManufacture || ''}
            onChange={(e) => onYearOfManufactureChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Enter year"
          />
        </div>
      </div>

      {/* Price and Passenger Capacity row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="text"
            value={price || ''}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passenger Capacity
          </label>
          <input
            type="text"
            value={paxCapacity || ''}
            onChange={(e) => onPaxCapacityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Enter passenger capacity"
          />
        </div>
      </div>

      {/* Notes field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes || ''}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          placeholder="Enter important notes"
        />
      </div>

      {/* Existing aircraft details display */}
      {details && (
        <div className="mt-2 text-sm text-gray-600">
          {details.cabinWidth && details.cabinHeight && (
            <p>Cabin: {details.cabinWidth} × {details.cabinHeight}</p>
          )}
          {details.baggageVolume && (
            <p>Baggage Volume: {details.baggageVolume}</p>
          )}
          <p>Passenger Capacity: {details.passengerCapacity}</p>
        </div>
      )}

      {/* Existing image upload section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft Image 1
          </label>
          <ImageUploadArea
            onImageUpload={(file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                onImage1Change(base64String);
                onImagePreview1Change(base64String);
              };
              reader.readAsDataURL(file);
            }}
            onImageRemove={() => {
              onImage1Change(null);
              onImagePreview1Change(null);
            }}
            previewUrl={imagePreview1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft Image 2
          </label>
          <ImageUploadArea
            onImageUpload={(file) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                onImage2Change(base64String);
                onImagePreview2Change(base64String);
              };
              reader.readAsDataURL(file);
            }}
            onImageRemove={() => {
              onImage2Change(null);
              onImagePreview2Change(null);
            }}
            previewUrl={imagePreview2}
          />
        </div>
      </div>
    </div>
  );
};

export default AircraftOption;