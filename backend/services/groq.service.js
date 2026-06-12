const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are FinSense AI, a friendly and knowledgeable financial assistant for Pakistani users.
Your role is to explain financial questions in simple, plain English with step-by-step guidance.
Always reference Pakistan's tax laws, FBR (Federal Board of Revenue) regulations, and local financial context.
Keep answers concise (under 200 words), jargon-free, and actionable.
If you mention thresholds, always use Pakistani Rupees (PKR) and cite the relevant fiscal year.
Be warm, encouraging, and never intimidating — finances are stressful enough!`;

/**
 * Sends a user question to Groq and returns a plain-English answer.
 * @param {string} question - The user's financial question
 * @returns {Promise<string>} The AI-generated answer
 */
const askGroq = async (question) => {
  const completion = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: question },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
};

/**
 * Sends a tax simulation result to Groq for a plain-English explanation.
 * @param {string} status - Tax status string (e.g. "No Tax Applicable")
 * @param {number} annualIncome - Computed annual income in PKR
 * @param {string} profession - User's profession type
 * @returns {Promise<string>} The AI-generated explanation
 */
const explainSimulation = async (status, annualIncome, profession) => {
  const prompt = `A ${profession} in Pakistan earns PKR ${annualIncome.toLocaleString()} per year.
Tax simulation result: "${status}".
Please explain what this means for them in simple terms, what steps they should take next, and any FBR filing requirements they should be aware of for FY2024-25.`;

  const completion = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 350,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Simulation explanation unavailable.';
};

module.exports = { askGroq, explainSimulation };
