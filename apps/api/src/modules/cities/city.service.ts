/**
 * Module: cities
 * Public catalogue endpoints for RentoFluencer API
 */

// Type assertions for Prisma types that have resolution issues in this ESM/CJS env
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export interface City {
  id: string;
  name: string;
  slug: string;
}

/**
 * Get all cities with profile counts
 */
export const getCities = async () => {
  const cities = await prisma.city.findMany({
    include: {
      profiles: {
        select: {
          id: true
        }
      }
    }
  });
  return (cities as any[]).map(city => ({
    id: city.id,
    name: city.name,
    slug: city.slug,
    profileCount: city.profiles.length
  }));
};

/**
 * Get city by slug with profile count
 */
export const getCityBySlug = async (slug: string) => {
  const city = await prisma.city.findUnique({
    where: { slug },
    include: {
      profiles: {
        select: {
          id: true
        }
      }
    }
  });
  if (!city) return null;
  return {
    id: city.id,
    name: city.name,
    slug: city.slug,
    profileCount: city.profiles.length
  };
};