export type GarmentCategory = 'top' | 'bottom' | 'accessory';
export type ProductCategory = 'computer' | 'cable' | 'phone';
export type AppMode = 'fashion' | 'product';

export interface ImageAsset {
  id: string;
  url: string;
  label: string;
  type: 'person' | GarmentCategory | ProductCategory;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultUrl: string | null;
}

export interface AttributeOption {
  id: string;
  label: string;
  value: string; // The prompt value or hex code
  preview?: string; // Hex code for colors
}

export interface FashionItems {
  top?: string | null;
  bottom?: string | null;
  accessory?: string | null;
}

export interface ProductItems {
  computer?: string | null;
  cable?: string | null;
  phone?: string | null;
}