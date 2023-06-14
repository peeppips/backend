import express from 'express';
import {
  createAccount,
  getAllAccounts,
  getAccountByUuid,
  deleteAccount,
  getAccountsByUser
} from "../controllers/accountControllers.js";

const router = express.Router();

// Create a new account
router.post("/", createAccount);

// Get all accounts
router.get("/", getAllAccounts);

// Get an account by UUID
router.get("/:uuid", getAccountByUuid);

// Delete an account by UUID
router.delete("/:uuid", deleteAccount);

// Get accounts by user
router.get("/user/:user", getAccountsByUser);

export default router;
