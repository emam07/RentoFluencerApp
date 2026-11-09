export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  address: string;
  cityId: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderListing {
  id: string;
  providerId: string;
  kitId: string;
  availability: boolean;
  rentedFrom: Date | null;
  rentedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}