'use client';

import { faCheck, faCloudArrowUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onUploadComplete, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);

    // Simulate progress (since we can't track real progress easily)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/parking-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success state
      setUploadSuccess(true);

      // Call callback with the image URL
      if (onUploadComplete) {
        onUploadComplete(data.url);
      }

      // Reset success indicator after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentImage || null);
      setUploadProgress(0);
    } finally {
      setUploading(false);
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
          {uploadSuccess && (
            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <FontAwesomeIcon icon={faCheck} className="size-8 text-green-600" />
              </div>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <FontAwesomeIcon icon={faSpinner} className="size-12 text-white animate-spin mb-4" />
              <div className="w-3/4 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white mt-3 font-semibold">{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="flex-1">
          <Button
            type="button"
            className={`w-full cursor-pointer ${
              uploadSuccess 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : uploadSuccess ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Upload Complete!
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
                Choose Image
              </>
            )}
          </Button>
        </label>
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg animate-in slide-in-from-top">
          <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faCheck} className="text-green-600" />
            Image uploaded successfully! Click "Save Changes" to update the parking lot.
          </p>
        </div>
      )}

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
