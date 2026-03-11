'use client';

import { useState } from 'react';
import type { FormData } from '@/lib/formTypes';
import { initialFormData } from '@/lib/formTypes';
import { StepIndicator } from '@/components/ui';
import {
  Step1Location,
  Step2Category,
  Step3Description,
  Step4Image,
  Step5Contact,
  SuccessStep,
} from '@/components/steps';

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | undefined>();

  const handleChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        departmentid: 123,
        structureid: null,
        propertyid: formData.location?.id || null,
        category: formData.category?.Id || null,
        subcategory: formData.subcategory?.Id || null,
        desc: formData.description,
        name: formData.wantsFeedback ? formData.name : '',
        feedback: formData.wantsFeedback,
        phone: formData.wantsFeedback ? formData.phone : '',
        email: formData.wantsFeedback ? formData.email : '',
        gisx: formData.location?.x || null,
        gisy: formData.location?.y || null,
      };

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kunde inte spara anmälan');
      }

      let uhId = null;
      if (data.d) {
        const parsed = JSON.parse(data.d);
        uhId = parsed.uhId || parsed;
      }

      if (formData.image && uhId) {
        const formDataImg = new FormData();
        formDataImg.append('file', formData.image);
        formDataImg.append('uhid', uhId);

        await fetch('/api/image', {
          method: 'POST',
          body: formDataImg,
        });
      }

      setTicketId(uhId);
      setStep(6);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ett fel uppstod');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReport = () => {
    setFormData(initialFormData);
    setStep(1);
    setTicketId(undefined);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0066cc] text-white py-4 px-4 shadow-md">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold">Felanmälan Höganäs</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4">
        {step < 6 && (
          <StepIndicator currentStep={step} totalSteps={5} />
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        {step === 1 && (
          <Step1Location
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <Step2Category
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {step === 3 && (
          <Step3Description
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {step === 4 && (
          <Step4Image
            formData={formData}
            onChange={handleChange}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}

        {step === 5 && (
          <Step5Contact
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 6 && (
          <SuccessStep
            ticketId={ticketId}
            onNewReport={handleNewReport}
          />
        )}
      </main>

      <footer className="text-center py-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Höganäs kommun</p>
      </footer>
    </div>
  );
}
