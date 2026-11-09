import { Request, Response } from 'express';
import prisma from '../../db';
import { getProviderProfile, getProviderListings, createProviderListing, updateProviderListing } from './provider.service';

const router = require('express').Router();

/**
 * GET /api/v1/providers/me
 * Get current user's provider profile (authenticated provider only)
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const profile = await getProviderProfile(req.user.id);

    if (!profile) {
      res.status(404).json({
        status: 'fail',
        message: 'Provider profile not found. Please register as a provider first.'
      });
      return;
    }

    res.json({
      status: 'success',
      data: { profile }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch provider profile'
    });
  }
});

/**
 * GET /api/v1/providers/me/listings
 * Get current provider's listings
 */
router.get('/me/listings', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const listings = await getProviderListings(req.user.id);
    res.json({
      status: 'success',
      data: { listings }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch provider listings'
    });
  }
});

/**
 * POST /api/v1/providers/listings
 * Create a new listing (authenticated provider only)
 */
router.post('/listings', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const { kitId, availability } = req.body;

    if (!kitId) {
      res.status(400).json({
        status: 'fail',
        message: 'Kit ID is required'
      });
      return;
    }

    const listing = await createProviderListing(req.user.id, kitId, availability !== false);

    res.status(201).json({
      status: 'success',
      data: { listing }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create provider listing'
    });
  }
});

/**
 * PATCH /api/v1/providers/listings/:id
 * Update a listing (authenticated provider only, owner-only)
 */
router.patch('/listings/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const { id } = req.params;
    const { availability, rentedFrom, rentedUntil } = req.body;

    const listing = await updateProviderListing(id, {
      availability,
      rentedFrom: rentedFrom || undefined,
      rentedUntil: rentedUntil || undefined
    });

    if (!listing) {
      res.status(404).json({
        status: 'fail',
        message: 'Listing not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: { listing }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update provider listing'
    });
  }
});

/**
 * DELETE /api/v1/providers/listings/:id
 * Delete a listing (authenticated provider only, owner-only)
 */
router.delete('/listings/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const { id } = req.params;

    await prisma.listing.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Listing deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete provider listing'
    });
  }
});

export default router;