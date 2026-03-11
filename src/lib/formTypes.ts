export interface Category {
  Id: number;
  Name: string;
  SubCategories?: SubCategory[];
}

export interface SubCategory {
  Id: number;
  Name: string;
}

export interface Place {
  id: number;
  name: string;
  address: string;
  x: number;
  y: number;
}

export interface FormData {
  location: Place | null;
  category: Category | null;
  subcategory: SubCategory | null;
  description: string;
  image: File | null;
  imagePreview: string | null;
  wantsFeedback: boolean;
  name: string;
  phone: string;
  email: string;
}

export const initialFormData: FormData = {
  location: null,
  category: null,
  subcategory: null,
  description: '',
  image: null,
  imagePreview: null,
  wantsFeedback: false,
  name: '',
  phone: '',
  email: '',
};
