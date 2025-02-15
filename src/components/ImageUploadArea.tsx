//ImageUploadArea.tsx
"use client";
import React, { useCallback, useState } from 'react';
import Image from 'next/image';

interface ImageUploadAreaProps {
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  previewUrl: string | null;
  uniqueId: string; // Add uniqueId prop
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageUpload,
  onImageRemove,
  previewUrl,
  uniqueId
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = `fileInput-${uniqueId}`; // Create unique input ID

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageUpload(files[0]);
    }
  }, [onImageUpload]);

  if (previewUrl) {
    return (
      <div className="relative w-[120px] h-[120px] flex items-center justify-center bg-gray-50 rounded-md">
        <Image 
          src={previewUrl} 
          alt="Preview" 
          fill
          sizes="120px"
          className="object-contain rounded-md"
          unoptimized // Add this if dealing with local base64 images
        />
        <button
          onClick={onImageRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 focus:outline-none text-sm z-10"
          aria-label="Remove image"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors h-[120px] flex items-center justify-center
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        id={inputId}
      />
      <label htmlFor={inputId} className="cursor-pointer">
        <div className="text-gray-600">
          <p className="text-xs">Drop image or click</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploadArea;