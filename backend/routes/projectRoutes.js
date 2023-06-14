import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject,
  getProjectByUser,
} from '../controllers/projectControllers.js';

const router = express.Router();

// Create a new project
router.post('/', createProject);

// Get all projects
router.get('/', getAllProjects);

// Get a project by ID
router.get('/:id', getProjectById);
router.get('/user/:user',getProjectByUser)

// Delete a project by ID
router.delete('/:id', deleteProject);

// Update a project by ID
router.put('/:id', updateProject);

export default router;
