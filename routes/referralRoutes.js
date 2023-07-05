import express from 'express';
import {
  createReferal,
  getAllReferals,
  getReferalById,
  deleteReferal,
  getReferalByUser,
  updateReferral
  // updateReferal,
} from '../controllers/referalController.js';

const router = express.Router();

// Create a new referral
router.post('/', createReferal);

// Get all referrals
router.get('/', getAllReferals);

// Get a referral by ID
router.get('/:id', getReferalById);

router.get('/user/:user',getReferalByUser);

// Delete a referral by ID
router.delete('/:id', deleteReferal);


router.put('/:id',updateReferral)

// Update a referral by ID
// router.put('/:id', updateReferal);

export default router;
