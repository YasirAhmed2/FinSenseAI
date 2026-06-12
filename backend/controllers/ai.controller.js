const Joi = require('joi');
const { askGroq, explainSimulation } = require('../services/groq.service');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const askSchema = Joi.object({
  question: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Question must be at least 3 characters.',
    'string.max': 'Question must not exceed 500 characters.',
    'any.required': 'Question is required.',
  }),
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

// ─── Pakistan FBR Tax Rules FY2024-25 ─────────────────────────────────────────
/**
 * Computes tax status based on Pakistan FBR rules for FY2024-25.
 * @param {number} annualIncome - Annual income in PKR
 * @returns {{ status: string, taxRate: string, threshold: number }}
 */
const computeTaxStatus = (annualIncome) => {
  if (annualIncome < 600000) {
    return { status: 'No Tax Applicable', taxRate: '0%', threshold: 600000 };
  } else if (annualIncome <= 1200000) {
    return { status: 'Tax Applicable', taxRate: '2.5%', threshold: 600000 };
  } else if (annualIncome <= 2400000) {
    return { status: 'Tax Applicable', taxRate: '12.5%', threshold: 1200000 };
  } else if (annualIncome <= 3600000) {
    return { status: 'Tax Applicable', taxRate: '22.5%', threshold: 2400000 };
  } else {
    return { status: 'Tax Applicable', taxRate: '35%', threshold: 3600000 };
  }
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

    const { question } = value;
    const answer = await askGroq(question);

    return res.status(200).json({ answer });
  } catch (err) {
    console.error('[ask]', err.message);
    return res.status(500).json({ error: 'Failed to get AI response. Please try again.' });
  }
};

// ─── Controller: Simulate ─────────────────────────────────────────────────────
/**
 * POST /api/simulate
 * Performs rule-based tax calculation and returns a Groq explanation.
 */
const simulate = async (req, res) => {
  try {
    const { error, value } = simulateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { income, profession } = value;
    const annualIncome = income * 12;

    const { status, taxRate, threshold } = computeTaxStatus(annualIncome);

    // Get AI explanation from Groq
    const explanation = await explainSimulation(
      `${status} (${taxRate})`,
      annualIncome,
      profession
    );

    return res.status(200).json({
      status,
      taxRate,
      annualIncome,
      monthlyIncome: income,
      threshold,
      profession,
      explanation,
    });
  } catch (err) {
    console.error('[simulate]', err.message);
    return res.status(500).json({ error: 'Failed to run simulation. Please try again.' });
  }
};

module.exports = { ask, simulate };
