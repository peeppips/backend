import express from 'express';
import {
  createReferal,
  getAllReferals,
  getReferalById,
  deleteReferal,
  updateReferal,
} from './referalController';

const router = express.Router();

// Create a new referral
router.post('/', createReferal);

// Get all referrals
router.get('/', getAllReferals);

// Get a referral by ID
router.get('/:id', getReferalById);

// Delete a referral by ID
router.delete('/:id', deleteReferal);

// Update a referral by ID
router.put('/:id', updateReferal);

export default router;
