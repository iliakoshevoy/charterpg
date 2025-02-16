//AircraftOption.tsx
"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import ImageUploadArea from '@/components/ImageUploadArea';
import { getAircraftImages } from '@/utils/aircraftImages';
import type { AircraftDetails } from '@/types/proposal';
import { processImageFile } from '@/utils/aircraftImages';

const AircraftSelection = dynamic(() => import('./AircraftSelection'), {
  ssr: false,
  loading: () => <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse" />
});

interface AircraftOptionProps {
  optionNumber: number;
  name: string;
  details: AircraftDetails | null;
  image1: string | null;
  image2: string | null;
  imagePreview1: string | null;
  imagePreview2: string | null;
  yearOfManufacture: string | null;
  yearRefurbishment: string | null;
  price: string | null;
  paxCapacity: string | null;
  notes: string | null;
  onNameChange: (value: string) => void;
  onDetailsChange: (details: AircraftDetails | null) => void;
  onImage1Change: (image: string | null) => void;
  onImage2Change: (image: string | null) => void;
  onImagePreview1Change: (preview: string | null) => void;
  onImagePreview2Change: (preview: string | null) => void;
  onYearOfManufactureChange: (value: string | null) => void;
  onYearRefurbishmentChange: (value: string | null) => void;
  onPriceChange: (value: string | null) => void;
  onPaxCapacityChange: (value: string | null) => void;
  onNotesChange: (value: string | null) => void;
  onRemove?: () => void;
  className?: string;
}

const AircraftOption: React.FC<AircraftOptionProps> = ({
  optionNumber,
  name,
  image1,
  image2,
  imagePreview1,
  imagePreview2,
  yearOfManufacture,
  yearRefurbishment,
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
  onYearRefurbishmentChange,
  onPriceChange,
  onPaxCapacityChange,
  onNotesChange,
  onRemove,
  details,
  className = ""
}) => {
  const hasContent = Boolean(name || image1 || image2 || yearOfManufacture || yearRefurbishment || price || paxCapacity || notes);

  return (
    // Remove or reduce both the default padding and the bg-gray padding
<div className={`space-y-4 transition-all duration-300 ease-in-out max-sm:px-0 px-6 bg-gray-50 max-sm:p-1 p-6 rounded-md ${className}`}>
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">Option {optionNumber}</h3>
        {onRemove && optionNumber > 1 && hasContent && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove Option
          </button>
        )}
      </div>
  
      {/* First row - Aircraft Type, Year, Refurbished Year, and Pax */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4 max-sm:col-span-4"> 
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft Model
          </label>
          <AircraftSelection
            value={name}
            onChange={onNameChange}
            optionNumber={optionNumber.toString() as '1' | '2'}
            onAircraftSelect={(newDetails) => {
              onDetailsChange(newDetails);
              if (newDetails) {
                const defaultImages = getAircraftImages(name);
                if (defaultImages) {
                  onImage1Change(defaultImages.interior);
                  onImage2Change(defaultImages.exterior);
                  onImagePreview1Change(defaultImages.interior);
                  onImagePreview2Change(defaultImages.exterior);
                }
                onPaxCapacityChange(newDetails.passengerCapacity);
              }
            }}
          />
        </div>
        <div className="col-span-2 max-sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufactured
          </label>
          <input
            type="text"
            value={yearOfManufacture || ''}
            onChange={(e) => onYearOfManufactureChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Year"
          />
        </div>
        <div className="col-span-2 max-sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Refurb
          </label>
          <input
            type="text"
            value={yearRefurbishment || ''}
            onChange={(e) => onYearRefurbishmentChange?.(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Year"
          />
        </div>
        <div className="col-span-2 max-sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pax
          </label>
          <input
            type="text"
            value={paxCapacity || ''}
            onChange={(e) => onPaxCapacityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder:text-base"
            placeholder="Capacity"
          />
        </div>
      </div>

      {/* Second row - Price and Images */}
      <div className="grid grid-cols-12 gap-4">
  <div className="col-span-4 space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Price
      </label>
      <input
        type="text"
        value={price || ''}
        onChange={(e) => onPriceChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        placeholder="e.g. 9,000 all in"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Notes
      </label>
      <input
        type="text"
        value={notes || ''}
        onChange={(e) => onNotesChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
        placeholder="Subj to OA, etc. or leave blank"
      />
    </div>
  </div>
  <div className="col-span-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Image 1
  </label>
  <ImageUploadArea
    uniqueId={`option${optionNumber}-image1`}
    imageType="interior"
    defaultImageUrl={details?.defaultInteriorImageUrl}
    isDefault={!imagePreview1 && !!details?.defaultInteriorImageUrl}
    onImageUpload={(file) => {
      // Add size validation
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        alert(`Image size (${Math.round(file.size / 1024 / 1024)}MB) exceeds 10MB limit`);
        return;
      }

      // Add type validation
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      console.log('Before FileReader:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: Math.round(file.size / 1024) + 'KB'
      });
    
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('After FileReader:', {
          base64Length: base64String.length,
          base64Prefix: base64String.substring(0, 50),
          mimeType: base64String.split(',')[0]
        });

        // Validate base64 string
        if (!base64String.startsWith('data:image/')) {
          alert('Failed to process image. Please try a different image.');
          return;
        }

        onImage1Change(base64String);
        onImagePreview1Change(base64String);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Failed to read image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }}
    onImageRemove={() => {
      if (details) {
        const updatedDetails = { ...details };
        delete updatedDetails.defaultInteriorImageUrl;
        onDetailsChange(updatedDetails);
      }
      onImage1Change(null);
      onImagePreview1Change(null);
    }}
    previewUrl={imagePreview1}
  />
</div>
<div className="col-span-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Image 2
  </label>
  <ImageUploadArea
    uniqueId={`option${optionNumber}-image2`}
    imageType="exterior"
    defaultImageUrl={details?.defaultExteriorImageUrl}
    isDefault={!imagePreview2 && !!details?.defaultExteriorImageUrl}
    onImageUpload={(file) => {
      console.log('Before FileReader:', JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: Math.round(file.size / 1024) + 'KB'
      }, null, 2));
    
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('After FileReader:', JSON.stringify({
          base64Length: base64String.length,
          base64Prefix: base64String.substring(0, 100),
          mimeType: base64String.split(',')[0]
        }, null, 2));
        onImage1Change(base64String);
        onImagePreview1Change(base64String);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', JSON.stringify(error, null, 2));
      };
      reader.readAsDataURL(file);
    }}
    onImageRemove={() => {
      if (details) {
        const updatedDetails = { ...details };
        delete updatedDetails.defaultExteriorImageUrl;
        onDetailsChange(updatedDetails);
      }
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