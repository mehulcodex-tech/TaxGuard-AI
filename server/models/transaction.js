const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    vendorName: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
      type: Number,
      required: true,
      min: 0,
    },

    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    expectedTax: {
      type: Number,
      default: 0,
    },

    taxDifference: {
      type: Number,
      default: 0,
    },

    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "UNDER_INVESTIGATION",
        "VALID",
        "ISSUE_CONFIRMED",
        "FALSE_POSITIVE",
      ],
      default: "PENDING",
    },

    anomalyScore: {
      type: Number,
      default: 0,
    },

    isAnomaly: {
      type: Boolean,
      default: false,
    },

    findings: [
      {
        type: {
          type: String,
        },

        severity: {
          type: String,
        },

        description: {
          type: String,
        },

        metadata: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
