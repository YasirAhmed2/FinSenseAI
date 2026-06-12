const express = require('express');
const { ask, simulate } = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/ask — Protected: requires valid JWT
router.post('/ask', authMiddleware, ask);

// POST /api/simulate — Protected: requires valid JWT
router.post('/simulate', authMiddleware, simulate);

module.exports = router;
