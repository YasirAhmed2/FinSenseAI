const Joi = require('joi');
const { askGroq, explainSimulation } = require('../services/groq.service');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const askSchema = Joi.object({
  question: Joi.string().min(3).max(1000).required().messages({
    'string.min': 'Question must be at least 3 characters.',
    'string.max': 'Question must not exceed 1000 characters.',
    'any.required': 'Question is required.',
  }),
  // Optional user profile context for personalized AI responses
  income: Joi.number().positive().optional(),
  profession: Joi.string().valid('salaried', 'freelancer', 'business').optional(),
  tax_status: Joi.string().valid('Filer', 'Non-Filer').optional(),
  mode: Joi.string().valid('simple', 'detailed').default('simple'),
});

const simulateSchema = Joi.object({
  income: Joi.number().positive().required().messages({
    'number.positive': 'Income must be a positive number.',
    'any.required': 'Monthly income is required.',
  }),
  profession: Joi.string()
    .valid('salaried', 'freelancer', 'business')
    .required()
    .messages({
      'any.only': 'Profession must be one of: salaried, freelancer, business.',
      'any.required': 'Profession is required.',
    }),
});

// ─── Pakistan FBR Tax Rules FY2025-26 ─────────────────────────────────────────
/**
 * Progressive tax calculation for SALARIED persons - FY2025-26
 * @param {number} annualIncome
 * @returns {number} tax amount in PKR
 */
const calculateSalariedTax = (annualIncome) => {
  if (annualIncome <= 600000) return 0;
  if (annualIncome <= 1200000) return (annualIncome - 600000) * 0.01;
  if (annualIncome <= 2200000) return 6000 + (annualIncome - 1200000) * 0.11;
  if (annualIncome <= 3200000) return 116000 + (annualIncome - 2200000) * 0.23;
  if (annualIncome <= 4100000) return 346000 + (annualIncome - 3200000) * 0.30;
  let tax = 616000 + (annualIncome - 4100000) * 0.35;
  // 9% surcharge if income > 10,000,000
  if (annualIncome > 10000000) tax = tax * 1.09;
  return tax;
};

/**
 * Progressive tax calculation for NON-SALARIED (Business/Freelancer local) - FY2025-26
 * @param {number} annualIncome
 * @returns {number} tax amount in PKR
 */
const calculateNonSalariedTax = (annualIncome) => {
  if (annualIncome <= 600000) return 0;
  if (annualIncome <= 1200000) return (annualIncome - 600000) * 0.15;
  if (annualIncome <= 1600000) return 90000 + (annualIncome - 1200000) * 0.20;
  if (annualIncome <= 3200000) return 170000 + (annualIncome - 1600000) * 0.30;
  if (annualIncome <= 5600000) return 650000 + (annualIncome - 3200000) * 0.40;
  let tax = 1610000 + (annualIncome - 5600000) * 0.45;
  // 10% surcharge if income > 10,000,000
  if (annualIncome > 10000000) tax = tax * 1.10;
  return tax;
};

/**
 * Get tax bracket info for salaried
 */
const getSalariedBracketInfo = (annualIncome) => {
  if (annualIncome <= 600000)   return { rate: '0%', bracketLabel: 'Exempt (Up to Rs. 600,000)' };
  if (annualIncome <= 1200000)  return { rate: '1%', bracketLabel: 'Rs. 600,001 – Rs. 1,200,000 @ 1%' };
  if (annualIncome <= 2200000)  return { rate: '11%', bracketLabel: 'Rs. 1,200,001 – Rs. 2,200,000 @ 11%' };
  if (annualIncome <= 3200000)  return { rate: '23%', bracketLabel: 'Rs. 2,200,001 – Rs. 3,200,000 @ 23%' };
  if (annualIncome <= 4100000)  return { rate: '30%', bracketLabel: 'Rs. 3,200,001 – Rs. 4,100,000 @ 30%' };
  return { rate: '35%', bracketLabel: 'Above Rs. 4,100,000 @ 35%' };
};

/**
 * Get tax bracket info for non-salaried
 */
const getNonSalariedBracketInfo = (annualIncome) => {
  if (annualIncome <= 600000)   return { rate: '0%', bracketLabel: 'Exempt (Up to Rs. 600,000)' };
  if (annualIncome <= 1200000)  return { rate: '15%', bracketLabel: 'Rs. 600,001 – Rs. 1,200,000 @ 15%' };
  if (annualIncome <= 1600000)  return { rate: '20%', bracketLabel: 'Rs. 1,200,001 – Rs. 1,600,000 @ 20%' };
  if (annualIncome <= 3200000)  return { rate: '30%', bracketLabel: 'Rs. 1,600,001 – Rs. 3,200,000 @ 30%' };
  if (annualIncome <= 5600000)  return { rate: '40%', bracketLabel: 'Rs. 3,200,001 – Rs. 5,600,000 @ 40%' };
  return { rate: '45%', bracketLabel: 'Above Rs. 5,600,000 @ 45%' };
};

/**
 * Main tax computation dispatcher — FY2025-26
 */
const computeTax = (annualIncome, profession) => {
  let taxAmount = 0;
  let bracketInfo;
  let note = '';

  if (profession === 'salaried') {
    taxAmount = calculateSalariedTax(annualIncome);
    bracketInfo = getSalariedBracketInfo(annualIncome);
    if (annualIncome > 10000000) note = 'Includes 9% surcharge on tax (income > Rs. 10M).';
  } else if (profession === 'freelancer') {
    // Freelancer: use non-salaried slabs (local income rate)
    // Note: foreign IT export income may qualify for 1% reduced rate
    taxAmount = calculateNonSalariedTax(annualIncome);
    bracketInfo = getNonSalariedBracketInfo(annualIncome);
    note = 'Foreign IT export income remitted through banking channels may qualify for a reduced 1% rate.';
    if (annualIncome > 10000000) note += ' Surcharge of 10% applies on tax (income > Rs. 10M).';
  } else {
    // business
    taxAmount = calculateNonSalariedTax(annualIncome);
    bracketInfo = getNonSalariedBracketInfo(annualIncome);
    if (annualIncome > 10000000) note = 'Includes 10% surcharge on tax (income > Rs. 10M).';
  }

  taxAmount = Math.round(taxAmount);
  const effectiveRate = annualIncome > 0 ? ((taxAmount / annualIncome) * 100).toFixed(2) : '0.00';
  const netAnnual = annualIncome - taxAmount;
  const netMonthly = Math.round(netAnnual / 12);
  const monthlyTax = Math.round(taxAmount / 12);
  const status = taxAmount === 0 ? 'No Tax Applicable' : 'Tax Applicable';

  return {
    status,
    taxAmount,
    monthlyTax,
    effectiveRate,
    netAnnual,
    netMonthly,
    bracketRate: bracketInfo.rate,
    bracketLabel: bracketInfo.bracketLabel,
    note,
    fiscalYear: 'FY2025-26',
  };
};

// ─── Controller: Ask ──────────────────────────────────────────────────────────
/**
 * POST /api/ask
 * Receives a financial question and returns a Groq-powered answer.
 */
const ask = async (req, res) => {
  try {
    const { error, value } = askSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { question, income, profession, tax_status, mode } = value;

    const answer = await askGroq({ question, income, profession, tax_status, mode });

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('[ask] Error:', err.message);
    return res.status(500).json({ error: `AI service error: ${err.message}` });
  }
};

// ─── Controller: Simulate ─────────────────────────────────────────────────────
/**
 * POST /api/simulate
 * Performs FY2025-26 progressive tax calculation and returns a Groq explanation.
 */
const simulate = async (req, res) => {
  try {
    const { error, value } = simulateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { income, profession } = value;
    const annualIncome = income * 12;

    const taxResult = computeTax(annualIncome, profession);

    const simData = {
      profession,
      annualIncome,
      monthlyIncome: income,
      ...taxResult,
    };

    // Get AI explanation from Groq
    const explanation = await explainSimulation(simData);

    return res.status(200).json({
      ...simData,
      explanation,
    });
  } catch (err) {
    console.error('[simulate] Error:', err.message);
    return res.status(500).json({ error: `Simulation error: ${err.message}` });
  }
};

module.exports = { ask, simulate };
