import prisma from '../../db';

/**
 * Get all kits (public catalogue - no authentication required)
 */
export const getKits = async (): Promise<any[]> => {
  const kits = await prisma.kit.findMany({
    include: {
      city: true,
      listings: {
        select: {
          id: true,
          availability: true
        }
      }
    }
  });
  return kits;
};

/**
 * Get kit by ID
 */
export const getKitById = async (id: string): Promise<any | null> => {
  return prisma.kit.findUnique({
    where: { id },
    include: {
      city: true,
      listings: {
        select: {
          id: true,
          availability: true
        }
      }
    }
  });
};

/**
 * Get kits by city slug
 */
export const getKitsByCitySlug = async (citySlug: string): Promise<any[]> => {
  return prisma.kit.findMany({
    where: { city: { slug: citySlug } },
    include: {
      city: true
    }
  });
};

/**
 * Get predefined V1 kits with their contents (as per product spec)
 * These are the fixed V1 SKUs and prices
 */
export const getV1Kits = () => {
  return [
    {
      id: 'reels',
      name: 'Reels',
      category: 'Reels',
      dailyPrice: 149900, // ₹1,499 in paise
      description: 'Smartphone gimbal, ring light, lapel mic, backdrop',
      images: []
    },
    {
      id: 'vlog',
      name: 'Vlog',
      category: 'Vlog',
      dailyPrice: 199900, // ₹1,999 in paise
      description: 'Camera, shotgun mic, tripod, portable light',
      images: []
    },
    {
      id: 'portrait',
      name: 'Portrait',
      category: 'Portrait',
      dailyPrice: 249900, // ₹2,499 in paise
      description: 'DSLR, prime lens, strobe, reflector, backdrop',
      images: []
    },
    {
      id: 'podcast',
      name: 'Podcast',
      category: 'Podcast',
      dailyPrice: 299900, // ₹2,999 in paise
      description: 'Audio interface, two XLR mics, headphones, pop filters',
      images: []
    }
  ];
};