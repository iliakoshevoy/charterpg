"use client";
import dynamic from 'next/dynamic';
import ImageUploadArea from '@/components/ImageUploadArea';
import { getAircraftImages } from '@/utils/aircraftImages';
import type { AircraftDetails } from '@/types/proposal';
import { compressImage } from '@/utils/imageCompression';
import { useScreenSize } from '@/hooks/useScreenSize';
import React, { useState, useRef, useEffect } from 'react';

// Import type definition from googleSheets
interface JetRegistration {
  registration: string;
  serialNumber: string;
  model: string;
  yod: string; // Year of Delivery/Manufacture
  yor: string | null; // Year of Refurbishment
  pax: string;
  notes: string | null;
  picture1: string | null;
  picture2: string | null;
  modelSize: string;
}

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

  // Notes suggestions
  const notesSuggestions = [
    "Subject to Owner's Approval.",
    "Empty Leg Conditions apply.",
    "Floating Fleet. You may get this aircraft or equivalent."
  ];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const notesInputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Registration lookup state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [searchRegistration, setSearchRegistration] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<JetRegistration[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reset search state when modal is closed
  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    setSearchRegistration('');
    setFilteredRegistrations([]);
  };
  
  // Effect to clear search when modal is opened
  useEffect(() => {
    if (showRegistrationModal) {
      setSearchRegistration('');
      setFilteredRegistrations([]);
    }
  }, [showRegistrationModal]);

  // API function to search jet registrations
  const searchJetRegistrations = async (query: string): Promise<JetRegistration[]> => {
    if (!query || query.length < 1) return [];
    
    try {
      setIsSearching(true);
      const response = await fetch(`/api/jets/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch jet registrations');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching jet registrations:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };
  
  // Function to reset this aircraft option
  const resetOption = () => {
    onNameChange('');
    onDetailsChange(null);
    onImage1Change(null);
    onImage2Change(null);
    onImagePreview1Change(null);
    onImagePreview2Change(null);
    onYearOfManufactureChange(null);
    onYearRefurbishmentChange(null);
    onPriceChange(null);
    onPaxCapacityChange(null);
    onNotesChange(null);
  };

  const handleRegistrationInputChange = async (input: string) => {
    setSearchRegistration(input.toUpperCase());
    
    if (input.length >= 1) {
      setIsSearching(true);
      try {
        const results = await searchJetRegistrations(input);
        setFilteredRegistrations(results);
      } catch (error) {
        console.error('Error searching registrations:', error);
        setFilteredRegistrations([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setFilteredRegistrations([]);
    }
  };
  
  const handleSelectRegistration = async (jet: JetRegistration) => {
    // First, populate the basic fields from the jet registration
    onNameChange(jet.model);
    onYearOfManufactureChange(jet.yod);
    if (jet.yor) {
      onYearRefurbishmentChange(jet.yor);
    }
    onPaxCapacityChange(jet.pax);
    if (jet.notes) {
      onNotesChange(jet.notes);
    }
    
    // Load images if available
    if (jet.picture1) {
      onImage1Change(jet.picture1);
      onImagePreview1Change(jet.picture1);
    }
    if (jet.picture2) {
      onImage2Change(jet.picture2);
      onImagePreview2Change(jet.picture2);
    }
    
    // Now fetch the model details from the Airplanes database
    try {
      const response = await fetch(`/api/aircraft/model?name=${encodeURIComponent(jet.model)}`);
      if (response.ok) {
        const modelDetails = await response.json();
        
        // Create an AircraftDetails object with the model details
        // Only include the properties defined in the AircraftDetails interface
        const aircraftDetails: AircraftDetails = {
          cabinWidth: modelDetails.cabinWidth || null,
          cabinHeight: modelDetails.cabinHeight || null,
          baggageVolume: modelDetails.baggageVolume || null,
          passengerCapacity: modelDetails.passengerCapacity || jet.pax,
          deliveryStart: modelDetails.deliveryStart || jet.yod,
          defaultInteriorImageUrl: jet.picture1 || undefined,
          defaultExteriorImageUrl: jet.picture2 || undefined,
          jetSize: modelDetails.jetSize || jet.modelSize || null
        };
        
        // Update the details
        onDetailsChange(aircraftDetails);
      }
    } catch (error) {
      console.error('Error fetching model details:', error);
    }
    
    // Reset the search state and close the modal
    handleCloseModal();
  };

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
  <div className="flex items-center">
    <h3 className="text-lg font-medium text-gray-700">Option {optionNumber}</h3>
    <button
      type="button"
      onClick={() => setShowRegistrationModal(true)}
      className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
    >
      Try Registration
      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">BETA</span>
    </button>
  </div>
  <div className="flex items-center space-x-2">
    <button
      onClick={resetOption}
      className="p-1 hover:bg-gray-50 rounded-full"
      title="Reset Option"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-6 h-6 text-gray-600 hover:text-gray-800"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
    {onRemove && optionNumber > 1 && (
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove Option
      </button>
    )}
  </div>
</div>

      {/* First row - Aircraft  and Price */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft
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
              
                if (newDetails.passengerCapacity) {
                  onPaxCapacityChange(newDetails.passengerCapacity);
                }
                
                console.log('Attempting to update year:', newDetails.deliveryStart);
                
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-700">Option {optionNumber}</h3>
          <button
            type="button"
            onClick={() => setShowRegistrationModal(true)}
            className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            Try Registration
            <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">BETA</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetOption}
            className="p-1 hover:bg-gray-50 rounded-full"
            title="Reset Option"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-6 h-6 text-gray-600 hover:text-gray-800"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
          {onRemove && optionNumber > 1 && (
            <button
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove Option
            </button>
          )}
        </div>
      </div>

      {/* First row - Aircraft Type, Year, Refurbished Year, and Pax */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aircraft
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
              placeholder="ex 20,000 all in"
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
              placeholder="Subj to OA, Empty Leg, etc."
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
  
      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Aircraft Registration Lookup</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Start typing an aircraft registration to see available options.
              <span className="block mt-1 text-xs italic">This is a beta feature. Registration data is for internal use only and won't appear in the PDF.</span>
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchRegistration}
                  onChange={(e) => handleRegistrationInputChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="e.g. N12345 or OE-"
                  autoFocus
                />
                
                {filteredRegistrations.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto">
                    {filteredRegistrations.map((jet, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSelectRegistration(jet)}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <div className="font-medium text-blue-700">{jet.registration}</div>
                        <div className="grid grid-cols-2 gap-1 mt-1 text-sm">
                          <div><span className="text-gray-700 font-medium">Model:</span> <span className="text-gray-900">{jet.model}</span></div>
                          <div><span className="text-gray-700 font-medium">Year:</span> <span className="text-gray-900">{jet.yod}</span></div>
                          <div><span className="text-gray-700 font-medium">Refurb:</span> <span className="text-gray-900">{jet.yor || 'N/A'}</span></div>
                          <div><span className="text-gray-700 font-medium">Pax:</span> <span className="text-gray-900">{jet.pax}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchRegistration.length >= 2 && filteredRegistrations.length === 0 && !isSearching && (
                  <div className="border rounded-md p-4 bg-gray-50 mt-2">
                    <h4 className="font-medium text-gray-800">Not in our database yet</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      This aircraft registration isn't in our database yet. Please fill out the details manually.
                    </p>
                    <button
                      onClick={() => {
                        // Generate mailto link with subject
                        const subject = `Please add aircraft registration: ${searchRegistration}`;
                        const body = `Hi,\n\nPlease add the following aircraft to the database:\n\nRegistration: ${searchRegistration}\n\nThank you!`;
                        window.location.href = `mailto:info@charterpropgen.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Request to add this registration
                    </button>
                  </div>
                )}
                
                {isSearching && (
                  <div className="mt-2 text-center p-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-sm text-gray-600">Searching...</span>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
  </div>
);
};

export default AircraftOption;