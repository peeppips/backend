import express from 'express';
import {
  createServer,
  deleteServer,
  getServerByBroker
} from '../controllers/serverContollers.js';

const router = express.Router();

// Create a new server
router.post('/', createServer);

router.get('broker/:uuid', getServerByBroker);

// Delete a server by ID
router.delete('/:uuid', deleteServer);

export default router;
