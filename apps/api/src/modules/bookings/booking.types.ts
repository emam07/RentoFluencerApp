export interface Booking {
  id: string;
  renterId: string;
  listingId: string;
  status: string; // PENDING, CONFIRMED, ACTIVE, COMPLETED
  totalPrice: number; // in paise per CLAUDE.md §8
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCreateDTO {
  listingId: string;
  startDate: Date;
  endDate: Date;
}