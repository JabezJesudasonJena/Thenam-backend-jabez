const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // store this securely

// ✅ Seller Login Route
router.post('/login-seller', async (req, res) => {
  const { email, password } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sellerId: seller._id }, JWT_SECRET, { expiresIn: '2d' });

    res.json({ token, seller: { fullName: seller.fullName, email: seller.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;x