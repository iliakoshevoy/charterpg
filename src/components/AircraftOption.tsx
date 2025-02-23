"use client";
import dynamic from 'next/dynamic';
import ImageUploadArea from '@/components/ImageUploadArea';
import { getAircraftImages } from '@/utils/aircraftImages';
import type { AircraftDetails } from '@/types/proposal';
import { compressImage } from '@/utils/imageCompression';
import { useScreenSize } from '@/hooks/useScreenSize';
import React, { useState, useRef } from 'react';

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
  const { isMobile } = useScreenSize();
  const hasContent = Boolean(name || image1 || image2 || yearOfManufacture || yearRefurbishment || price || paxCapacity || notes);

// Add these after const hasContent
const notesSuggestions = [
  "Subject to Owner Approval.",
  "Empty Leg Condition apply."
];
const [showSuggestions, setShowSuggestions] = useState(false);
const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
const notesInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const value = e.target.value;
  onNotesChange(value);
  
  if (value) {
    const filtered = notesSuggestions.filter(
      suggestion => suggestion.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  } else {
    setShowSuggestions(false);
  }
};

const handleSelectSuggestion = (suggestion: string) => {
  onNotesChange(suggestion);
  setShowSuggestions(false);
};


  const renderMobileLayout = () => (
    <>
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

      {/* First row - Aircraft Model and Price */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7">
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
                // Explicitly update both fields
    if (newDetails.passengerCapacity) {
      onPaxCapacityChange(newDetails.passengerCapacity);
    }
    
    // Add this console.log
    console.log('Attempting to update year:', newDetails.deliveryStart);
    
    // Explicitly update yearOfManufacture
    onYearOfManufactureChange(newDetails.deliveryStart);
  }

            }}
          />
        </div>
        <div className="col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="text"
            value={price || ''}
            onChange={(e) => onPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="ex 9,000 ALL IN"
          />
        </div>
      </div>

      {/* Second row - Year, Refurb, Pax */}
      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufactured
          </label>
          <input
            type="text"
            value={yearOfManufacture || ''}
            onChange={(e) => onYearOfManufactureChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg
-white"
            placeholder="Year"
          />
        </div>
        <div className="col-span-4">
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
        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pax
          </label>
          <input
            type="text"
            value={paxCapacity || ''}
            onChange={(e) => onPaxCapacityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Capacity"
          />
        </div>
      </div>

{/* Third row - Notes only */}
<div className="grid grid-cols-12 gap-2 mt-4">
  <div className="col-span-12 relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Notes
    </label>
    <textarea
      ref={notesInputRef as React.RefObject<HTMLTextAreaElement>}
      value={notes || ''}
      onChange={handleNotesChange}
      onFocus={() => {
        if (notes && notes.length >= 1) {
          setShowSuggestions(true);
        }
      }}
      onBlur={() => {
        setTimeout(() => {
          setShowSuggestions(false);
        }, 200);
      }}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white resize-none"
      placeholder="Subject to OA, etc. or leave blank if no comm"
      rows={1}
    />
    {showSuggestions && filteredSuggestions.length > 0 && (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {filteredSuggestions.map((suggestion, index) => (
          <div
            key={index}
            onClick={() => handleSelectSuggestion(suggestion)}
            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
          >
            {suggestion}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

{/* Fourth row - Images */}
<div className="grid grid-cols-12 gap-2 mt-4">
  <div className="col-span-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Image 1
    </label>
    <ImageUploadArea
      uniqueId={`option${optionNumber}-image1`}
      imageType="interior"
      defaultImageUrl={details?.defaultInteriorImageUrl}
      isDefault={!imagePreview1 && !!details?.defaultInteriorImageUrl}
      onImageUpload={async (file) => {
        try {
          const compressedFile = await compressImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            onImage1Change(base64String);
            onImagePreview1Change(base64String);
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error('Image compression error:', error);
          alert('Failed to process image. Please try again.');
        }
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
  <div className="col-span-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Image 2
    </label>
    <ImageUploadArea
      uniqueId={`option${optionNumber}-image2`}
      imageType="exterior"
      defaultImageUrl={details?.defaultExteriorImageUrl}
      isDefault={!imagePreview2 && !!details?.defaultExteriorImageUrl}
      onImageUpload={async (file) => {
        try {
          const compressedFile = await compressImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            onImage2Change(base64String);
            onImagePreview2Change(base64String);
          };
          reader.readAsDataURL(compressedFile);
        } catch (error) {
          console.error('Image compression error:', error);
          alert('Failed to process image. Please try again.');
        }
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
    </>
  );

  const renderDesktopLayout = () => (
    <>
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
        <div className="col-span-4">
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
                onYearOfManufactureChange(newDetails.deliveryStart);
              }
            }}
          />
        </div>
        <div className="col-span-2">
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
        <div className="col-span-2">
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
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pax
          </label>
          <input
            type="text"
            value={paxCapacity || ''}
            onChange={(e) => onPaxCapacityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            placeholder="Capacity"
          />
        </div>
      </div>

      {/* Second row - Price, Notes, and Images */}
<div className="grid grid-cols-12 gap-4">
  {/* Price and Notes section - now 6 columns (50%) */}
  <div className="col-span-6 space-y-4">
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
    <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Notes
  </label>
  <input
    ref={notesInputRef as React.RefObject<HTMLInputElement>}
    type="text"
    value={notes || ''}
    onChange={handleNotesChange}
    onFocus={() => {
      if (notes && notes.length >= 1) {
        setShowSuggestions(true);
      }
    }}
    onBlur={() => {
      setTimeout(() => {
        setShowSuggestions(false);
      }, 200);
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
    placeholder="Subj to OA, etc. or leave blank"
  />
  {showSuggestions && filteredSuggestions.length > 0 && (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => handleSelectSuggestion(suggestion)}
          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
        >
          {suggestion}
        </div>
      ))}
    </div>
  )}
</div>
  </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image 1
          </label>
          <ImageUploadArea
            uniqueId={`option${optionNumber}-image1`}
            imageType="interior"
            defaultImageUrl={details?.defaultInteriorImageUrl}
            isDefault={!imagePreview1 && !!details?.defaultInteriorImageUrl}
            onImageUpload={async (file) => {
              try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  onImage1Change(base64String);
                  onImagePreview1Change(base64String);
                };
                reader.readAsDataURL(compressedFile);
              } catch (error) {
                console.error('Image compression error:', error);
                alert('Failed to process image. Please try again.');
              }
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

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image 2
          </label>
          <ImageUploadArea
            uniqueId={`option${optionNumber}-image2`}
            imageType="exterior"
            defaultImageUrl={details?.defaultExteriorImageUrl}
            isDefault={!imagePreview2 && !!details?.defaultExteriorImageUrl}
            onImageUpload={async (file) => {
              try {
                const compressedFile = await compressImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  const base64String = reader.result as string;
                  onImage2Change(base64String);
                  onImagePreview2Change(base64String);
                };
                reader.readAsDataURL(compressedFile);
              } catch (error) {
                console.error('Image compression error:', error);
                alert('Failed to process image. Please try again.');
              }
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
    </>
  );

  return (
    <div className={`space-y-4 transition-all duration-300 ease-in-out ${isMobile ? 'px-0 p-1' : 'px-6 p-6'} bg-gray-50 rounded-md ${className}`}>
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </div>
  );
};

export default AircraftOption;