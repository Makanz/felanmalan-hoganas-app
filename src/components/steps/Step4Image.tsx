'use client';

import { useState, useRef } from 'react';
import { FormData } from '@/lib/formTypes';
import { Card, Button } from '@/components/ui';
import { compressImage, formatFileSize } from '@/lib/imageCompression';

interface Step4ImageProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step4Image({ formData, onChange, onNext, onPrev }: Step4ImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const compressed = await compressImage(file, {
        maxWidth: 1500,
        quality: 0.75,
      });

      const preview = URL.createObjectURL(compressed);
      
      onChange({
        image: new File([compressed], file.name, { type: 'image/jpeg' }),
        imagePreview: preview,
      });
    } catch (err) {
      setError('Kunde inte komprimera bilden. Försök med en annan bild.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    onChange({ image: null, imagePreview: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">4. Bifoga bild (valfritt)</h2>

      <p className="text-sm text-gray-600 mb-4">
        Bilder från mobilkameror skalas automatiskt ned för att fungera bättre med tjänsten.
      </p>

      {formData.imagePreview ? (
        <div className="mb-4">
          <img
            src={formData.imagePreview}
            alt="Förhandsvisning"
            className="w-full rounded-lg object-cover max-h-64"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {formData.image && formatFileSize(formData.image.size)}
            </span>
            <Button
              variant="outline"
              onClick={handleRemoveImage}
              className="text-red-500 border-red-500 hover:bg-red-500"
            >
              Ta bort
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            variant="outline"
            onClick={handleTakePhoto}
            loading={loading}
            className="w-full"
          >
            📷 Ta foto eller välj bild
          </Button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onPrev} className="flex-1">
          Tillbaka
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
        >
          Nästa
        </Button>
      </div>
    </Card>
  );
}
