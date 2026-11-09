import prisma from '../../db';

/**
 * Create a new booking request
 */
export const createBooking = async (
  renterId: string,
  listingId: string,
  startDate: Date,
  endDate: Date
) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { kit: true }
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (!listing.availability) {
    throw new Error('Equipment is not available for the requested dates');
  }

  // Calculate total price in paise
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationDays = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));
  const dailyPrice = listing.kit.dailyPrice;
  const totalPrice = dailyPrice * durationDays;

  const result = await prisma.booking.create({
    data: {
      renterId,
      listingId,
      status: 'PENDING',
      totalPrice
    },
    include: {
      user: {
        select: { id: true, email: true, role: true }
      },
      listing: {
        include: { kit: { include: { city: true } } }
      }
    }
  });

  return {
    id: result.id,
    renterId: result.renterId,
    listingId: result.listingId,
    status: result.status,
    totalPrice: result.totalPrice,
    createdAt: result.createdAt
  };
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: { id: true, email: true, role: true }
      },
      listing: {
        include: { kit: { include: { city: true } } }
      }
    }
  });

  if (!result) return null;

  return {
    id: result.id,
    renterId: result.renterId,
    listingId: result.listingId,
    status: result.status,
    totalPrice: result.totalPrice,
    createdAt: result.createdAt
  };
};

/**
 * Get bookings by renter ID
 */
export const getBookingsByRenter = async (renterId: string) => {
  const results = await prisma.booking.findMany({
    where: { renterId },
    include: {
      listing: {
        include: { kit: { include: { city: true } } }
      }
    }
  });

  return results.map((b: any) => ({
    id: b.id,
    renterId: b.renterId,
    listingId: b.listingId,
    status: b.status,
    totalPrice: b.totalPrice,
    createdAt: b.createdAt
  }));
};

/**
 * Get bookings by listing ID
 */
export const getBookingsByListing = async (listingId: string) => {
  const results = await prisma.booking.findMany({
    where: { listingId },
    include: {
      user: {
        select: { id: true, email: true, role: true }
      }
    }
  });

  return results.map((b: any) => ({
    id: b.id,
    renterId: b.renterId,
    listingId: b.listingId,
    status: b.status,
    totalPrice: b.totalPrice,
    createdAt: b.createdAt
  }));
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!result) {
    throw new Error('Booking not found');
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' }
  });

  return {
    id: updated.id,
    renterId: updated.renterId,
    listingId: updated.listingId,
    status: updated.status,
    totalPrice: updated.totalPrice,
    createdAt: updated.createdAt
  };
};

/**
 * Approve a booking (admin only)
 */
export const approveBooking = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!result) {
    throw new Error('Booking not found');
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' }
  });

  return {
    id: updated.id,
    renterId: updated.renterId,
    listingId: updated.listingId,
    status: updated.status,
    totalPrice: updated.totalPrice,
    createdAt: updated.createdAt
  };
};