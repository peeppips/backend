import express from 'express';
import {
  createAccount,
  getAllAccounts,
  getAccountByUuid,
  deleteAccount,
  getAccountsByUser,
  updateAccount
} from "../controllers/accountControllers.js";

const router = express.Router();

// Create a new account
router.post("/", createAccount);

// Get all accounts
router.get("/", getAllAccounts);

// Get an account by UUID
router.get("/:uid", getAccountByUuid);


// Define the route for updating an account
router.put("/:uid", updateAccount);


// Delete an account by UUID
router.delete("/:id", deleteAccount);

// Get accounts by user
router.get("/user/:user", getAccountsByUser);

export default router;
