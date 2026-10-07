const Transaction = require("../models/transaction.js");
const { analyzeTransaction } = require("../services/complianceService");
const { calculateRisk } = require("../services/riskService");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const {
      invoiceNumber,
      vendorName,
      invoiceDate,
      amount,
      taxRate,
      taxAmount,
    } = req.body;

    // Basic validation
    if (
      !invoiceNumber ||
      !vendorName ||
      !invoiceDate ||
      amount === undefined ||
      taxRate === undefined ||
      taxAmount === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All transaction fields are required",
      });
    }

    // Convert values to numbers
    const numericAmount = Number(amount);
    const numericTaxRate = Number(taxRate);
    const numericTaxAmount = Number(taxAmount);

    // Validate numeric values
    if (
      !Number.isFinite(numericAmount) ||
      !Number.isFinite(numericTaxRate) ||
      !Number.isFinite(numericTaxAmount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount, tax rate and tax amount must be valid numbers",
      });
    }

    // Prevent negative financial values
    if (numericAmount < 0 || numericTaxRate < 0 || numericTaxAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount, tax rate and tax amount cannot be negative",
      });
    }

    // Calculate expected tax on the server
    const expectedTax = (numericAmount * numericTaxRate) / 100;

    // Calculate difference
    const taxDifference = numericTaxAmount - expectedTax;

    // Create transaction
    const transaction = await Transaction.create({
      invoiceNumber,
      vendorName,
      invoiceDate,
      amount: numericAmount,
      taxRate: numericTaxRate,
      taxAmount: numericTaxAmount,
      expectedTax,
      taxDifference,
    });

    // Run compliance analysis
    const findings = await analyzeTransaction(transaction);

    // Calculate risk
    const risk = calculateRisk(findings, false);

    transaction.findings = findings;
    transaction.riskScore = risk.riskScore;
    transaction.riskLevel = risk.riskLevel;

    await transaction.save();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create transaction",
    });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
