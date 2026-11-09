import { Request, Response } from 'express';
import { getAdminDashboard, getPendingListings, approveListing, rejectListing, getAllBookings, getAllTransactions, generatePaymentLink } from './admin.service';
import prisma from '../../db';

const router = require('express').Router();

/**
 * GET /api/v1/admin/dashboard - Admin dashboard overview
 */
router.get('/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const dashboard = await getAdminDashboard();
    res.json({
      status: 'success',
      data: { dashboard }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard overview'
    });
  }
});

/**
 * GET /api/v1/admin/listings - List all listings pending approval
 */
router.get('/listings', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const listings = await getPendingListings();
    res.json({
      status: 'success',
      data: { listings }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pending listings'
    });
  }
});

/**
 * POST /api/v1/admin/listings/:id/approve - Approve a provider listing
 */
router.post('/listings/:id/approve', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const { id } = req.params;
    const success = await approveListing(id);

    if (!success) {
      res.status(404).json({
        status: 'fail',
        message: 'Listing not found'
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Listing approved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve listing'
    });
  }
});

/**
 * POST /api/v1/admin/listings/:id/reject - Reject a provider listing
 */
router.post('/listings/:id/reject', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const { id } = req.params;
    const success = await rejectListing(id);

    if (!success) {
      res.status(404).json({
        status: 'fail',
        message: 'Listing not found'
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Listing rejected successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject listing'
    });
  }
});

/**
 * GET /api/v1/admin/bookings - List all booking requests
 */
router.get('/bookings', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const bookings = await getAllBookings();
    res.json({
      status: 'success',
      data: { bookings }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings'
    });
  }
});

/**
 * GET /api/v1/admin/transactions - List all transactions
 */
router.get('/transactions', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const transactions = await getAllTransactions();
    res.json({
      status: 'success',
      data: { transactions }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch transactions'
    });
  }
});

/**
 * POST /api/v1/admin/bookings/:id/payment-link - Generate Razorpay payment link for a booking
 */
router.post('/bookings/:id/payment-link', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.role || req.user.role !== 'ADMIN') {
      res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin only.'
      });
      return;
    }

    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      res.status(400).json({
        status: 'fail',
        message: 'Amount is required'
      });
      return;
    }

    const result = await generatePaymentLink(id, amount);

    res.json({
      status: 'success',
      data: { paymentLinkId: result.paymentLinkId, status: result.status }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate payment link'
    });
  }
});

export default router;