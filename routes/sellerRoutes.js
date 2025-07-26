const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // store securely

router.post('/register-seller', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if seller already exists
    const existing = await Seller.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Seller already registered' });
    }

    // Hash password manually (since .pre('save') sometimes skips during bulk updates)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ ...req.body, password: hashedPassword });
    await newSeller.save();

    // Create token
    const token = jwt.sign({ sellerId: newSeller._id }, JWT_SECRET, { expiresIn: '2d' });

    res.status(201).json({
      message: 'Seller registered and logged in successfully!',
      token,
      seller: {
        fullName: newSeller.fullName,
        email: newSeller.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});
