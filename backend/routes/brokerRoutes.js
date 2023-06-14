import express from 'express';
import {
  createBroker,
  getAllBrokers,
  getBrokerById,
  deleteBroker,
  updateBroker,
} from '../controllers/brokerControllers.js';

const router = express.Router();

// Create a new broker
router.post('/', createBroker);

// Get all brokers
router.get('/', getAllBrokers);

// Get a broker by ID
router.get('/:id', getBrokerById);

// Delete a broker by ID
router.delete('/:id', deleteBroker);

// Update a broker by ID
router.put('/:id', updateBroker);

export default router;
