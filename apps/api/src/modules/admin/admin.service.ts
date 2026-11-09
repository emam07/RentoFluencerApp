import prisma from '../../db';

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
};

/**
 * Get admin dashboard overview
 */
export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.provider.count();
  const totalListings = await prisma.listing.count();
  const totalBookings = await prisma.booking.count();
  const pendingApprovals = await prisma.booking.count({ where: { status: 'PENDING' } });
  const activeBookings = await prisma.booking.count({ where: { status: 'ACTIVE' } });
  const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });
  const pendingPayouts = await prisma.providerPayout.count({ where: { status: 'PENDING' } });

  return {
    totalUsers,
    totalProviders,
    totalListings,
    totalBookings,
    pendingApprovals,
    activeBookings,
    completedBookings,
    totalRevenue: 0, // TODO: Implement revenue calculation
    pendingPayouts
  };
};

/**
 * Get all listings pending approval
 */
export const getPendingListings = async (): Promise<PendingListing[]> => {
  const listings: any[] = await prisma.listing.findMany({
    where: { availability: true },
    include: {
      kit: {
        select: {
          id: true,
          name: true,
          category: true,
          images: true
        }
      },
      provider: {
        select: {
          userId: true
        }
      }
    }
  });

  return listings.map((listing: any) => ({
    id: listing.id,
    kitId: listing.kitId,
    providerId: listing.providerId,
    kitName: listing.kit.name,
    dailyPrice: listing.kit.dailyPrice,
    category: listing.kit.category,
    images: listing.kit.images,
    availability: listing.availability,
    createdAt: listing.createdAt
  }));
};

/**
 * Approve a provider listing
 */
export const approveListing = async (listingId: string): Promise<boolean> => {
  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: { availability: false }
  });
  return !!listing;
};

/**
 * Reject a provider listing
 */
export const rejectListing = async (listingId: string): Promise<boolean> => {
  const listing = await prisma.listing.delete({
    where: { id: listingId }
  });
  return !!listing;
};

/**
 * Get all booking requests
 */
export const getAllBookings = async (): Promise<AdminBooking[]> => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      },
      listing: {
        include: {
          kit: {
            select: {
              name: true,
              category: true
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });

  return bookings.map((booking: any) => ({
    id: booking.id,
    renterId: booking.renterId,
    listingId: booking.listingId,
    status: booking.status,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    listing: {
      kit: {
        name: booking.listing.kit.name,
        category: booking.listing.kit.category,
        dailyPrice: booking.listing.kit.dailyPrice
      },
      provider: {
        user: {
          name: booking.listing.provider.user?.name || null,
          email: booking.listing.provider.user?.email || null
        }
      }
    }
  }));
};

/**
 * Get all transactions
 */
export const getAllTransactions = async (): Promise<{ id: string; bookingId: string; providerId: string; amount: number; status: string; paymentId?: string; createdAt: Date }[]> => {
  const transactions: any[] = await prisma.transaction.findMany({
    include: {
      booking: {
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          },
          listing: {
            include: {
              kit: true,
              provider: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  return transactions.map(tx => ({
    id: tx.id,
    bookingId: tx.bookingId,
    providerId: tx.providerId,
    amount: tx.amount,
    status: tx.status,
    paymentId: tx.paymentId,
    createdAt: tx.createdAt
  }));
};

/**
 * Generate Razorpay payment link for a booking
 */
export const generatePaymentLink = async (
  bookingId: string,
  amount: number, // in paise
  currency: string = 'INR'
): Promise<{ paymentLinkId: string; status: string }> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: {
        include: { kit: true }
      }
    }
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // In a real implementation, we would call Razorpay API
  // For now, we'll create a transaction record and return a mock payment link ID
  const paymentLinkId = `rzp_test_${bookingId}_${Date.now()}`;

  await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      providerId: booking.listing.providerId,
      amount,
      status: 'PENDING',
      paymentId: paymentLinkId
    }
  });

  return { paymentLinkId, status: 'created' };
};