const Message = require('../models/message');
const express = require('express');
const router = express.Router();

// Example: Fetch messages for a specific user
router.get('/dashboard/message/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const userMessages = await Message.findOne({ name });
    if (!userMessages) {
      return res.status(200).json({ success: true, data: [] }); // No messages
    }
    res.status(200).json({ success: true, data: userMessages.messages });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error retrieving messages' });
  }
});

router.post('/dashboard/message/save', async (req, res) => {
    const { name, messages } = req.body;
    try {
        const result = await Message.findOneAndUpdate(
            { name },
            { $set: { messages } }, // Replace entire messages array
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, message: 'Messages saved successfully' });
    } catch (error) {
        console.error('Error saving messages:', error);
        res.status(500).json({ success: false, error: 'Failed to save messages' });
    }
});

module.exports = router;
