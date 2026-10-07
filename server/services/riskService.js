const RISK_POINTS = {
  DUPLICATE_INVOICE: 40,
  TAX_MISMATCH: 30,
  MISSING_INFORMATION: 10,
  INVALID_TAX_RATE: 15,
  UNUSUAL_AMOUNT: 15,
  ML_ANOMALY: 20,
};

const calculateRiskScore = (findings = [], isAnomaly = false) => {
  let score = 0;

  for (const finding of findings) {
    if (RISK_POINTS[finding.type]) {
      score += RISK_POINTS[finding.type];
    }
  }

  // Add ML anomaly points separately
  if (isAnomaly) {
    score += RISK_POINTS.ML_ANOMALY;
  }

  // Never allow score above 100
  return Math.min(score, 100);
};

const getRiskLevel = (score) => {
  if (score >= 80) {
    return "CRITICAL";
  }

  if (score >= 60) {
    return "HIGH";
  }

  if (score >= 30) {
    return "MEDIUM";
  }

  return "LOW";
};

const calculateRisk = (findings = [], isAnomaly = false) => {
  const riskScore = calculateRiskScore(findings, isAnomaly);

  const riskLevel = getRiskLevel(riskScore);

  return {
    riskScore,
    riskLevel,
  };
};

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  calculateRisk,
};
