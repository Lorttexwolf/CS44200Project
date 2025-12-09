'use client';

import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

interface ImageUploadProps {
  onFileSelect?: (file: File) => void;
  currentImage?: string;
}

export default function ImageUpload({ onFileSelect, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative w-full h-64 border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg">
          <ImageWithFallback
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="flex-1">
          <Button
            type="button"
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
            Choose Image
          </Button>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg animate-in slide-in-from-top">
          <p className="text-sm text-red-700 font-semibold">✗ {error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        📁 Accepted formats: JPEG, PNG, WebP, GIF (max 5MB)
      </p>
    </div>
  );
}
