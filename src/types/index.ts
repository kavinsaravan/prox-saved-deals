export interface Deal {
  id: string;
  productName: string;
  retailer: string;
  price: number;
  originalPrice?: number;
  size: string;
  imageUrl: string;
  distance: number; // in miles
  location: string;
  category: string;
  description?: string;
  validUntil?: string;
}

export interface SavedItem {
  dealId: string;
  savedAt: number;
  type: 'deal' | 'search';
  searchQuery?: string;
}

export type RootStackParamList = {
  DealsList: undefined;
  DealDetail: { deal: Deal };
  SavedItems: undefined;
};
