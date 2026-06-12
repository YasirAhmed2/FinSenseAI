# FinSense AI

AI-powered financial assistant for Pakistani users — built with Next.js, Express.js, and Groq LLM.

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your GROQ_API_KEY, MONGO_URI, JWT_SECRET
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# .env.local is already configured for localhost
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend:  http://localhost:5000

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Recharts, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **AI**: Groq API (llama3-70b-8192)
- **Auth**: JWT + bcrypt
- **DB**: MongoDB
