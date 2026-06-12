const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User.model');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters.',
    'any.required': 'Password is required.',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ─── Controller: Register ──────────────────────────────────────────────────────
/**
 * POST /api/auth/register
 * Creates a new user account with bcrypt-hashed password.
 */
const register = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({ email, password: hashedPassword });

    return res.status(201).json({
      message: 'Account created successfully! Please log in.',
      userId: user._id,
    });
  } catch (err) {
    console.error('[register]', err.message);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

// ─── Controller: Login ─────────────────────────────────────────────────────────
/**
 * POST /api/auth/login
 * Validates credentials and returns a signed JWT.
 */
const login = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('[login]', err.message);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

module.exports = { register, login };
