'use client';

import { FormData } from '@/lib/formTypes';
import { Card, Button, TextArea } from '@/components/ui';

interface Step3DescriptionProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Description({ formData, onChange, onNext, onPrev }: Step3DescriptionProps) {
  const isValid = formData.description.trim().length >= 10;

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">3. Beskriv problemet</h2>

      <TextArea
        label="Beskrivning"
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Beskriv vad som är fel..."
        rows={5}
        error={
          formData.description.length > 0 && formData.description.length < 10
            ? 'Beskrivningen måste vara minst 10 tecken'
            : undefined
        }
      />

      <p className="text-sm text-gray-500 mb-4">
        {formData.description.length} tecken (minst 10)
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onPrev} className="flex-1">
          Tillbaka
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1"
        >
          Nästa
        </Button>
      </div>
    </Card>
  );
}
