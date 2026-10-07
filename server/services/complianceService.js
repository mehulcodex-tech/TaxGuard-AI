const TAX_TOLERANCE = 0.01;

const ALLOWED_TAX_RATES = [0, 5, 12, 18, 28];

const { checkDuplicateInvoice } = require("./duplicateDetectionService");
const { checkUnusualAmount } = require("./amountAnalysisService");

// Check tax mismatch
const checkTaxMismatch = (transaction) => {
  const difference = Math.abs(
    Number(transaction.taxAmount) - Number(transaction.expectedTax),
  );

  if (difference > TAX_TOLERANCE) {
    return {
      type: "TAX_MISMATCH",
      severity: "HIGH",
      description: `Reported tax differs from expected tax by ${difference.toFixed(2)}.`,
      metadata: {
        expectedTax: transaction.expectedTax,
        reportedTax: transaction.taxAmount,
        difference,
      },
    };
  }

  return null;
};

// Check for missing transaction information
const checkMissingInformation = (transaction) => {
  const missingFields = [];

  if (!transaction.invoiceNumber) {
    missingFields.push("invoiceNumber");
  }

  if (!transaction.vendorName) {
    missingFields.push("vendorName");
  }

  if (!transaction.invoiceDate) {
    missingFields.push("invoiceDate");
  }

  if (transaction.amount === undefined || transaction.amount === null) {
    missingFields.push("amount");
  }

  if (transaction.taxRate === undefined || transaction.taxRate === null) {
    missingFields.push("taxRate");
  }

  if (transaction.taxAmount === undefined || transaction.taxAmount === null) {
    missingFields.push("taxAmount");
  }

  if (missingFields.length > 0) {
    return {
      type: "MISSING_INFORMATION",
      severity: "MEDIUM",
      description: `Required transaction information is missing: ${missingFields.join(", ")}.`,
      metadata: {
        missingFields,
      },
    };
  }

  return null;
};

// Check whether the tax rate is configured as valid
const checkInvalidTaxRate = (transaction) => {
  const taxRate = Number(transaction.taxRate);

  if (!ALLOWED_TAX_RATES.includes(taxRate)) {
    return {
      type: "INVALID_TAX_RATE",
      severity: "MEDIUM",
      description: `Tax rate ${taxRate}% is not in the configured allowed tax rates.`,
      metadata: {
        taxRate,
        allowedTaxRates: ALLOWED_TAX_RATES,
      },
    };
  }

  return null;
};

// Run all compliance checks
const analyzeTransaction = async (transaction) => {
  const findings = [];

  // Rule 1: Tax mismatch
  const taxFinding = checkTaxMismatch(transaction);

  if (taxFinding) {
    findings.push(taxFinding);
  }

  // Rule 2: Missing information
  const missingFinding = checkMissingInformation(transaction);

  if (missingFinding) {
    findings.push(missingFinding);
  }

  // Rule 3: Invalid tax rate
  const taxRateFinding = checkInvalidTaxRate(transaction);

  if (taxRateFinding) {
    findings.push(taxRateFinding);
  }

  // Rule 4: Unusual transaction amount
  const unusualAmountFinding = await checkUnusualAmount(transaction);

  if (unusualAmountFinding) {
    findings.push(unusualAmountFinding);
  }

  // Rule 5: Duplicate invoice
  const duplicateFinding = await checkDuplicateInvoice(
    transaction.invoiceNumber,
    transaction._id,
  );

  if (duplicateFinding) {
    findings.push(duplicateFinding);
  }

  return findings;
};

module.exports = {
  analyzeTransaction,
  checkTaxMismatch,
  checkMissingInformation,
  checkInvalidTaxRate,
};
