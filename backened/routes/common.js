const express = require('express');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Private
router.get('/announcements', protect, async (req, res) => {
    try {
        const announcements = await Announcement.find({
            $or: [
                { targetAudience: 'all' },
                { targetAudience: req.user.role }
            ],
            isActive: true,
            $or: [
                { expiryDate: { $gte: new Date() } },
                { expiryDate: null }
            ]
        })
        .populate('author', 'name')
        .sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;