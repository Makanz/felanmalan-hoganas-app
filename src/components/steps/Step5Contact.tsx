'use client';

import { FormData } from '@/lib/formTypes';
import { Card, Button, Input } from '@/components/ui';

interface Step5ContactProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export function Step5Contact({ formData, onChange, onSubmit, onPrev, isSubmitting }: Step5ContactProps) {
  const isValid = !formData.wantsFeedback || 
    (formData.name.trim().length > 0 && 
     formData.email.trim().length > 0 && 
     formData.email.includes('@'));

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">5. Återkoppling</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vill du ha återkoppling på din anmälan?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange({ wantsFeedback: true })}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              formData.wantsFeedback
                ? 'bg-[#0066cc] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ja
          </button>
          <button
            type="button"
            onClick={() => onChange({ 
              wantsFeedback: false,
              name: '',
              phone: '',
              email: '',
            })}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              !formData.wantsFeedback
                ? 'bg-[#0066cc] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nej
          </button>
        </div>
      </div>

      {formData.wantsFeedback && (
        <>
          <Input
            label="Namn"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Ditt namn"
            required
          />

          <Input
            label="Telefon (valfritt)"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Ditt telefonnummer"
          />

          <Input
            label="E-post"
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="din@epost.se"
            required
            error={
              formData.email.length > 0 && !formData.email.includes('@')
                ? 'Ange en giltig e-postadress'
                : undefined
            }
          />
        </>
      )}

      <div className="flex gap-3">
        <Button 
          variant="secondary" 
          onClick={onPrev} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Tillbaka
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          loading={isSubmitting}
          className="flex-1"
        >
          Skicka in
        </Button>
      </div>
    </Card>
  );
}
