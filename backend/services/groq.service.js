const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are FinSense AI, a professional AI-powered financial advisor designed for citizens in Pakistan.

Your goal is to provide structured, personalized, and actionable financial guidance based on the user's real-life context.

Key 2025-26 FBR Tax Rules you MUST use in all answers:

SALARIED PERSONS:
- Up to Rs. 600,000: 0%
- Rs. 600,001 – Rs. 1,200,000: 1% of amount exceeding Rs. 600,000
- Rs. 1,200,001 – Rs. 2,200,000: Rs. 6,000 + 11% of amount exceeding Rs. 1,200,000
- Rs. 2,200,001 – Rs. 3,200,000: Rs. 116,000 + 23% of amount exceeding Rs. 2,200,000
- Rs. 3,200,001 – Rs. 4,100,000: Rs. 346,000 + 30% of amount exceeding Rs. 3,200,000
- Above Rs. 4,100,000: Rs. 616,000 + 35% of amount exceeding Rs. 4,100,000
- Surcharge: 9% additional on tax if income exceeds Rs. 10,000,000

NON-SALARIED (Business/Freelancer - local income):
- Up to Rs. 600,000: 0%
- Rs. 600,001 – Rs. 1,200,000: 15% of amount exceeding Rs. 600,000
- Rs. 1,200,001 – Rs. 1,600,000: Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000
- Rs. 1,600,001 – Rs. 3,200,000: Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000
- Rs. 3,200,001 – Rs. 5,600,000: Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000
- Above Rs. 5,600,000: Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000
- Surcharge: 10% additional on tax if income exceeds Rs. 10,000,000

FREELANCERS (IT Export - foreign income via banking channels):
- Eligible for reduced rate of 1% or lower on foreign remittances for IT/IT-enabled services exports.

RULES YOU MUST FOLLOW:
- Always personalize responses using the user profile.
- Never give generic answers. Always reference the profile data.
- Translate complex financial terms into simple language.
- Identify hidden benefits, missed opportunities, or risks.
- Think like a real financial advisor, not a chatbot.
- Highlight practical actions and real-world impact.
- Use bullet points (no long paragraphs).
- Keep it clean and readable.
- Avoid technical jargon unless simplified.
- Always reference Pakistan's FBR regulations and local financial context.
- Always use Pakistani Rupees (PKR) and cite FY2025-26.

OUTPUT FORMAT — STRICT (always output all 8 sections, in this exact order):

### 🧾 Summary
(Simple Mode: 1 short line | Detailed Mode: 2–3 lines with explanation)

### 👤 Your Profile Insight
- Income Meaning: (low / moderate / high in local Pakistan context)
- Tax Status: (clear, simple statement about their filing status and implications)
- Financial Position: (stable / improving / risky — with one-sentence reason)

### 📊 What This Means For You
- Real-life interpretation of their situation
- How it affects their financial future in Pakistan

### 💰 Hidden Opportunities
- Government schemes / savings / benefits they might miss
- Smart financial advantages based on their specific profile

### ⚠️ Risks or Mistakes to Avoid
- Common mistakes for people in this income group
- Financial risks if these are ignored

### ✅ Action Plan
(max 3–5 steps, practical and doable immediately)
- Step 1: ...
- Step 2: ...
- Step 3: ...

### 🧠 Explain Like I'm 10
(very simple, one short paragraph, no jargon at all)

### 💡 Pro Financial Tip
(one high-value insight a real chartered accountant would give)

DO NOT break this structure. DO NOT output unstructured text. DO NOT skip any section.`;

// ─── Build structured user prompt ────────────────────────────────────────────
/**
 * Builds the full user prompt string from profile context + question.
 * @param {object} params
 * @returns {string}
 */
const buildUserPrompt = ({ question, income, profession, tax_status, mode }) => {
  const incomeDisplay = income
    ? `PKR ${Number(income).toLocaleString('en-PK')} / month (PKR ${(Number(income) * 12).toLocaleString('en-PK')} / year)`
    : 'Not provided';

  const professionDisplay = profession
    ? profession.charAt(0).toUpperCase() + profession.slice(1)
    : 'Not specified';

  const taxStatusDisplay = tax_status || 'Not specified';
  const modeDisplay = mode === 'detailed' ? 'DETAILED' : 'SIMPLE';

  return `USER PROFILE:
- Monthly Income: ${incomeDisplay}
- Profession: ${professionDisplay}
- Financial / Tax Status: ${taxStatusDisplay}

USER QUERY:
${question}

MODE: ${modeDisplay}
${modeDisplay === 'SIMPLE' ? '→ Keep all sections SHORT and concise.' : '→ Give deeper explanations in all sections.'}`;
};

// ─── askGroq ─────────────────────────────────────────────────────────────────
/**
 * Sends a user question + profile context to Groq and returns a structured answer.
 * @param {object} params
 * @param {string} params.question - The user's financial question
 * @param {number} [params.income] - Monthly income in PKR
 * @param {string} [params.profession] - salaried | freelancer | business
 * @param {string} [params.tax_status] - Filer | Non-Filer
 * @param {string} [params.mode] - 'simple' | 'detailed'
 * @returns {Promise<string>} Structured AI-generated answer
 */
const askGroq = async ({ question, income, profession, tax_status, mode = 'simple' }) => {
  const userPrompt = buildUserPrompt({ question, income, profession, tax_status, mode });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: mode === 'detailed' ? 1400 : 900,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
};

// ─── explainSimulation ────────────────────────────────────────────────────────
/**
 * Sends a tax simulation result to Groq for a structured plain-English explanation.
 * @param {object} simResult - Full simulation result object
 * @returns {Promise<string>} Structured AI-generated explanation
 */
const explainSimulation = async (simResult) => {
  const {
    profession, annualIncome, monthlyIncome,
    taxAmount, effectiveRate, netAnnual, netMonthly,
    status, bracketLabel, note,
  } = simResult;

  const professionDisplay = profession.charAt(0).toUpperCase() + profession.slice(1);
  const taxStatusDisplay = taxAmount === 0 ? 'No Tax Applicable (Exempt)' : 'Tax Applicable';

  const question = `I am a ${professionDisplay} in Pakistan. My monthly income is PKR ${monthlyIncome.toLocaleString()} (PKR ${annualIncome.toLocaleString()} annually). 
My FY2025-26 tax simulation shows:
- Tax Status: ${status}
- Tax Bracket: ${bracketLabel}
- Annual Tax Payable: PKR ${taxAmount.toLocaleString()}
- Effective Tax Rate: ${effectiveRate}%
- Net Annual Take-Home: PKR ${netAnnual.toLocaleString()}
- Net Monthly Take-Home: PKR ${netMonthly.toLocaleString()}
${note ? `- Special Note: ${note}` : ''}

Please analyze my tax situation and give me personalized financial advice.`;

  const userPrompt = buildUserPrompt({
    question,
    income: monthlyIncome,
    profession,
    tax_status: taxStatusDisplay,
    mode: 'detailed',
  });

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1400,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Simulation explanation unavailable.';
};

module.exports = { askGroq, explainSimulation };
