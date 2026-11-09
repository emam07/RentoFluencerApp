import prisma from '../../db';
import { Provider, ProviderListing } from './provider.types';

/**
 * Get provider profile by user ID
 */
export const getProviderProfile = async (userId: string): Promise<Provider | null> => {
  return prisma.provider.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true
        }
      }
    }
  });
};

/**
 * Get provider listings
 */
export const getProviderListings = async (providerId: string): Promise<ProviderListing[]> => {
  return prisma.listing.findMany({
    where: { providerId },
    include: {
      kit: {
        include: {
          city: true
        }
      }
    }
  });
};

/**
 * Create a new provider listing
 */
export const createProviderListing = async (
  providerId: string,
  kitId: string,
  availability: boolean = true
): Promise<ProviderListing> => {
  return prisma.listing.create({
    data: {
      providerId,
      kitId,
      availability
    },
    include: {
      kit: {
        include: {
          city: true
        }
      }
    }
  });
};

/**
 * Update a provider listing
 */
export const updateProviderListing = async (
  listingId: string,
  data: { availability?: boolean; rentedFrom?: Date; rentedUntil?: Date }
): Promise<ProviderListing | null> => {
  return prisma.listing.update({
    where: { id: listingId },
    data,
    include: {
      kit: {
        include: {
          city: true
        }
      }
    }
  });
};