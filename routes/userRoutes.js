import express from 'express'

const router = express.Router()
import {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
// router
//   .route('/profile')
//   .get(getUserProfile)
//   .put(protect, updateUserProfile)
router
  .route('/:uid')
  .delete(protect, admin, deleteUser)
  .get(getUserById)
  .put(updateUser)

export default router
