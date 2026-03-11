'use client';

import { Card, Button } from '@/components/ui';

interface SuccessStepProps {
  ticketId?: string;
  onNewReport: () => void;
}

export function SuccessStep({ ticketId, onNewReport }: SuccessStepProps) {
  return (
    <Card>
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold mb-2">Tack för din anmälan!</h2>
        <p className="text-gray-600 mb-4">
          Din felanmälan har skickats till Höganäs kommun.
        </p>
        {ticketId && (
          <p className="text-sm text-gray-500 mb-6">
            Ärendenummer: <span className="font-mono font-medium">{ticketId}</span>
          </p>
        )}
        <p className="text-sm text-gray-500 mb-6">
          Du kommer att få e-post med statusuppdateringar om du har begärt det.
        </p>
        <Button onClick={onNewReport}>
          Skicka ny anmälan
        </Button>
      </div>
    </Card>
  );
}
