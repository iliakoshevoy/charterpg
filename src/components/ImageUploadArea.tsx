// src/components/ImageUploadArea.tsx
"use client";
import React, { useCallback, useState } from 'react';

interface ImageUploadAreaProps {
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  previewUrl: string | null;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  onImageUpload,
  onImageRemove,
  previewUrl
}) => {
  const [isDragging, setIsDragging] = useState(false);

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
      <div className="relative">
        <img src={previewUrl} alt="Preview" className="max-w-xs rounded-md" />
        <button
          onClick={onImageRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
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
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        <div className="text-gray-600">
          <p>Drag and drop an image here, or click to select</p>
          <p className="text-sm text-gray-500 mt-1">Supports: JPG, PNG, GIF</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploadArea;