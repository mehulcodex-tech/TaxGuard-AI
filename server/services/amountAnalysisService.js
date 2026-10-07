const Transaction = require("../models/transaction.js");

const UNUSUAL_AMOUNT_MULTIPLIER = 2;

const checkUnusualAmount = async (transaction) => {
  const previousTransactions = await Transaction.find({
    vendorName: transaction.vendorName,
    _id: { $ne: transaction._id },
  }).select("amount");

  // We need historical data to establish a baseline
  if (previousTransactions.length === 0) {
    return null;
  }

  const totalAmount = previousTransactions.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const averageAmount = totalAmount / previousTransactions.length;

  const currentAmount = Number(transaction.amount);

  const threshold = averageAmount * UNUSUAL_AMOUNT_MULTIPLIER;

  if (currentAmount > threshold) {
    const deviationPercentage =
      ((currentAmount - averageAmount) / averageAmount) * 100;

    return {
      type: "UNUSUAL_AMOUNT",
      severity: "MEDIUM",
      description: `Transaction amount is significantly higher than the vendor's historical average.`,
      metadata: {
        currentAmount,
        averageAmount,
        threshold,
        deviationPercentage: Number(deviationPercentage.toFixed(2)),
        previousTransactionCount: previousTransactions.length,
      },
    };
  }

  return null;
};

module.exports = {
  checkUnusualAmount,
};
