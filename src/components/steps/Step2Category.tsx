'use client';

import { useState, useEffect } from 'react';
import { FormData, Category } from '@/lib/formTypes';
import { Card, Button, Select } from '@/components/ui';

interface Step2CategoryProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Category({ formData, onChange, onNext, onPrev }: Step2CategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        
        if (data.d) {
          const parsed = JSON.parse(data.d);
          setCategories(parsed);
        }
      } catch (err) {
        setError('Kunde inte ladda kategorier');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.Id === parseInt(categoryId));
    onChange({ 
      category: category || null, 
      subcategory: null 
    });
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    const subcategory = formData.category?.SubCategories?.find(
      s => s.Id === parseInt(subcategoryId)
    );
    onChange({ subcategory: subcategory || null });
  };

  const isValid = formData.category !== null && 
    (formData.category.SubCategories?.length ? formData.subcategory !== null : true);

  const categoryOptions = categories.map(c => ({
    value: c.Id.toString(),
    label: c.Name,
  }));

  const subcategoryOptions = (formData.category?.SubCategories || []).map(s => ({
    value: s.Id.toString(),
    label: s.Name,
  }));

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">Laddar kategorier...</div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">2. Vad gäller din felanmälan?</h2>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <Select
        label="Kategori"
        options={categoryOptions}
        value={formData.category?.Id.toString() || ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
      />

      {formData.category?.SubCategories && formData.category.SubCategories.length > 0 && (
        <Select
          label="Underkategori"
          options={subcategoryOptions}
          value={formData.subcategory?.Id.toString() || ''}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
        />
      )}

      {formData.subcategory?.Id === 338 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 font-medium">För akuta avloppsproblem:</p>
          <p className="text-red-600">Ring Höganäs Energi: 042-33 77 00</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onPrev} className="flex-1">
          Tillbaka
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1"
        >
          Nästa
        </Button>
      </div>
    </Card>
  );
}
