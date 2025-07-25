const express = require('express');
const Plot = require('../models/Plot');
const { verifyAdmin } = require('../utils/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for this route
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all plots
router.get('/', async (req, res) => {
  try {
    const plots = await Plot.find().sort({ createdAt: -1 });
    res.json(plots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new plot with image upload (admin only)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const plotData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      contactInfo: req.body.contactInfo
    };

    // Add image path if file was uploaded
    if (req.file) {
      plotData.image = '/uploads/' + req.file.filename;
    }

    const plot = new Plot(plotData);
    await plot.save();
    res.status(201).json(plot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete plot (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Plot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plot deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update plot (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const plot = await Plot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 