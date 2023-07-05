import express from 'express';
import {
  createCredit,
  getAllCredits,
  getCreditByUuid,
  deleteCredit,
  getCreditsByUser,
} from '../controllers/creditControllers.js';

const router = express.Router();

// Create a new credit
router.post('/', createCredit);

// Get all credits
router.get('/', getAllCredits);

// Get a credit by UUID
router.get('/:uuid', getCreditByUuid);

// Delete a credit by UUID
router.delete('/:uuid', deleteCredit);

// Get credits by user
router.get('/users/:user/', getCreditsByUser);

export default router;
