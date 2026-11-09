import { Request, Response } from 'express';
import { getKits, getKitById, getKitsByCitySlug, getV1Kits } from './kits.service';

const router = require('express').Router();

/**
 * GET /api/v1/kits
 * Get all kits with city information
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const kits = await getKits();
    res.json({
      status: 'success',
      data: { kits }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch kits'
    });
  }
});

/**
 * GET /api/v1/kits/:id
 * Get kit by ID with full details
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const kit = await getKitById(id);

    if (!kit) {
      res.status(404).json({
        status: 'fail',
        message: 'Kit not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: { kit }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch kit'
    });
  }
});

/**
 * GET /api/v1/kits/city/:slug
 * Get kits by city slug
 */
router.get('/city/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const kits = await getKitsByCitySlug(slug);
    res.json({
      status: 'success',
      data: { kits }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch kits by city'
    });
  }
});

/**
 * GET /api/v1/kits/v1/predefined
 * Get predefined V1 kits (fixed SKUs and prices)
 */
router.get('/v1/predefined', async (req: Request, res: Response): Promise<void> => {
  try {
    const kits = await getV1Kits();
    res.json({
      status: 'success',
      data: { kits }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch predefined kits'
    });
  }
});

export default router;