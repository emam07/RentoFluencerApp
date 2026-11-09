export interface AdminDashboard {
  totalUsers: number;
  totalProviders: number;
  totalListings: number;
  totalBookings: number;
  pendingApprovals: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  pendingPayouts: number;
}

export interface PendingListing {
  id: string;
  kitId: string;
  providerId: string;
  kitName: string;
  dailyPrice: number; // in paise
  category: string;
  images: string[];
  availability: boolean;
  createdAt: Date;
}

export interface AdminBooking {
  id: string;
  renterId: string;
  listingId: string;
  status: string; // PENDING, CONFIRMED, ACTIVE, COMPLETED
  totalPrice: number; // in paise per CLAUDE.md §8
  createdAt: Date;
  listing?: {
    kit: {
      name: string;
      category: string;
      dailyPrice: number;
    };
    provider: {
      user: {
        name: string | null;
        email: string | null;
      };
    };
  };
}

export interface AdminTransaction {
  id: string;
  bookingId: string;
  providerId: string;
  amount: number; // in paise
  status: string; // "PENDING", "PAID", "REFUNDED", "FAILED"
  paymentId?: string; // Razorpay payment link ID
  createdAt: Date;
}