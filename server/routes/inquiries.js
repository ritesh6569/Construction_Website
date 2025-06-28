const express = require('express');
const Inquiry = require('../models/Inquiry');
const { verifyAdmin } = require('../utils/auth');
const router = express.Router();

// Submit inquiry (public)
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all inquiries (admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 