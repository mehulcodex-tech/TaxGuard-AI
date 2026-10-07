const express = require("express");

const {
  createTransaction,
  getTransactions,
} = require("../controllers/transactionController.js");

const router = express.Router();

// Create transaction
router.post("/", createTransaction);

// Get all transactions
router.get("/", getTransactions);

module.exports = router;