import React, { useRef, useState } from 'react';
import { Camera, Upload, X, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64Url: string) => void;
  onClear: () => void;
  selectedImageUrl?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onClear,
  selectedImageUrl,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPEG, PNG, WebP)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelected(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {selectedImageUrl ? (
        <div className="relative inline-block rounded-xl overflow-hidden border border-brand-border shadow-xs max-w-xs group">
          <img
            src={selectedImageUrl}
            alt="Uploaded animal observation"
            className="w-24 h-24 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-brand-border bg-white text-brand-muted hover:text-brand-forest hover:border-brand-forest hover:bg-brand-sageLight transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Upload optional photo of animal or visible wound"
        >
          <Camera className="w-4 h-4 text-brand-forest" />
          <span className="hidden sm:inline">Add Photo</span>
        </button>
      )}

      {error && (
        <p className="absolute bottom-full left-0 mb-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 z-10 w-64 shadow-md">
          {error}
        </p>
      )}
    </div>
  );
};
