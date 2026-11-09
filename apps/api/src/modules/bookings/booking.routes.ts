import { Request, Response } from 'express';
import { createBooking, getBookingById, getBookingsByRenter, getBookingsByListing, cancelBooking, approveBooking } from './booking.service';

const router = require('express').Router();

/**
 * POST /api/v1/bookings
 * Create a new booking request (renter only)
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const { listingId, startDate, endDate } = req.body;

    if (!listingId || !startDate || !endDate) {
      res.status(400).json({
        status: 'fail',
        message: 'listingId, startDate, and endDate are required'
      });
      return;
    }

    const booking = await createBooking(req.user.id, listingId, startDate, endDate);

    res.status(201).json({
      status: 'success',
      data: { booking }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create booking'
    });
  }
});

/**
 * GET /api/v1/bookings/:id
 * Get booking by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const booking = await getBookingById(req.params.id);

    if (!booking) {
      res.status(404).json({
        status: 'fail',
        message: 'Booking not found'
      });
      return;
    }

    // Check authorization: renter owns this booking or user is admin
    if (booking.renterId !== req.user.id) {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. You do not own this booking.'
      });
      return;
    }

    res.json({
      status: 'success',
      data: { booking }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch booking'
    });
  }
});

/**
 * GET /api/v1/bookings/renter/my-bookings
 * Get current renter's bookings
 */
router.get('/renter/my-bookings', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const bookings = await getBookingsByRenter(req.user.id);
    res.json({
      status: 'success',
      data: { bookings }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch renter bookings'
    });
  }
});

/**
 * POST /api/v1/bookings/:id/cancel
 * Cancel a booking (renter or admin only)
 */
router.post('/:id/cancel', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. No user found.'
      });
      return;
    }

    const booking = await cancelBooking(req.params.id);

    res.json({
      status: 'success',
      data: { booking }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to cancel booking'
    });
  }
});

/**
 * POST /api/v1/bookings/:id/approve
 * Approve a booking (admin only)
 */
router.post('/:id/approve', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const booking = await approveBooking(req.params.id);

    res.json({
      status: 'success',
      data: { booking }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve booking'
    });
  }
});

export default router;