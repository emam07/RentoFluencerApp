import { Request, Response } from 'express';
import { getCities, getCityBySlug } from './city.service';

const router = require('express').Router();

/**
 * GET /api/v1/cities
 * Get all cities with profile counts
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await getCities();
    res.json({
      status: 'success',
      data: { cities }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cities'
    });
  }
});

/**
 * GET /api/v1/cities/:slug
 * Get city by slug with profile details
 */
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const city = await getCityBySlug(slug);

    if (!city) {
      res.status(404).json({
        status: 'fail',
        message: 'City not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: { city }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch city'
    });
  }
});

export default router;