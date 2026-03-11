'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FormData, Place } from '@/lib/formTypes';
import { Card, Button, Input } from '@/components/ui';

interface Step1LocationProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export function Step1Location({ formData, onChange, onNext }: Step1LocationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 3) {
      setPlaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: query, x: 12.57, y: 56.195 }),
      });

      const data = await response.json();
      
      if (data.d) {
        const parsed = JSON.parse(data.d);
        setPlaces(parsed);
      } else {
        setPlaces([]);
      }
    } catch (err) {
      setError('Kunde inte söka platser. Försök igen.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, searchPlaces]);

  const handleSelectPlace = (place: Place) => {
    onChange({ location: place });
    setSearchQuery(place.address || place.name);
    setPlaces([]);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolokalisering stöds inte av din webbläsare');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: longitude, y: latitude, search: '' }),
          });

          const data = await response.json();
          if (data.d) {
            const parsed = JSON.parse(data.d);
            if (parsed.length > 0) {
              const nearest = parsed[0];
              onChange({ 
                location: { 
                  id: nearest.id, 
                  name: nearest.name, 
                  address: nearest.adress || nearest.name,
                  x: nearest.x, 
                  y: nearest.y 
                } 
              });
              setSearchQuery(nearest.adress || nearest.name);
            }
          }
        } catch (err) {
          setError('Kunde inte hitta din position');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Kunde inte få din position: ' + err.message);
        setLoading(false);
      }
    );
  };

  const isValid = formData.location !== null;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">1. Var finns problemet?</h2>
      
      <div className="mb-4">
        <Input
          label="Sök adress eller plats"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Skriv gatunamn eller plats..."
          disabled={loading}
        />
        
        {places.length > 0 && (
          <ul className="border rounded-lg mt-1 max-h-48 overflow-y-auto">
            {places.map((place) => (
              <li
                key={place.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                onClick={() => handleSelectPlace(place)}
              >
                <div className="font-medium">{place.name}</div>
                <div className="text-sm text-gray-500">{place.address}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        variant="outline"
        onClick={handleGetLocation}
        loading={loading}
        className="w-full mb-4"
      >
        📍 Använd min nuvarande position
      </Button>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {formData.location && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-green-700 font-medium">
            ✓ {formData.location.address || formData.location.name}
          </p>
        </div>
      )}

      <Button
        onClick={onNext}
        disabled={!isValid}
        className="w-full"
      >
        Nästa
      </Button>
    </Card>
  );
}
