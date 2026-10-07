const Transaction = require("../models/transaction.js");

const checkDuplicateInvoice = async (invoiceNumber, transactionId = null) => {
  const query = {
    invoiceNumber: invoiceNumber.trim(),
  };

  // When checking an existing transaction, don't compare it with itself
  if (transactionId) {
    query._id = { $ne: transactionId };
  }

  const duplicate = await Transaction.findOne(query);

  if (duplicate) {
    return {
      type: "DUPLICATE_INVOICE",
      severity: "HIGH",
      description: `Invoice number ${invoiceNumber} already exists.`,
      metadata: {
        invoiceNumber,
        existingTransactionId: duplicate._id,
        existingVendorName: duplicate.vendorName,
        existingAmount: duplicate.amount,
        existingInvoiceDate: duplicate.invoiceDate,
      },
    };
  }

  return null;
};

module.exports = {
  checkDuplicateInvoice,
};
