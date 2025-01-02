const OpenAI = require("openai");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const axios = require('axios');
const messagesRouter = require('./routes/messages');
const Message = require('./models/message');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'your_secret_key', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// MongoDB connection using promises
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {

    const { username, password, confirmPassword } = req.body;
  
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    if(password != confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });
  
    try {
      await newUser.save();
      req.session.userId = user._id;
      res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Error creating user', error: err });
    }
  });
  

app.post('/', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    try {
  
      if (user==null) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      req.session.userId = user._id;
      res.json({ msg: 'Login successful' });
    } catch (err) {
        console.log(err);
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    
    return res.json({ msg: 'Welcome to the dashboard' });
  } else {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
});

app.post('/dashboard', async (req, res) => {
  try {
    const { age, skinType, concerns } = req.body;

    const response = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/Ruthu1/skincare',
      headers: {
        // Replace with your new token
        'Authorization':  `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: `You are an expert dermatologist. I am of ${age} years old and have ${skinType} skin, my concerns are ${concerns}, Reccomend a product to solve my concerns.`
      }
    });
    const routine = response.data[0].generated_text;
    console.log('API Response:', routine);
    res.status(200).json({ routine });
  } catch (error) {
    // Better error logging
    if (error.response?.data) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    res.status(500).json({ 
      error: 'Failed to get a response from AI.',
      details: error.response?.data || error.message
    });
  }
});
app.post('/dashboard/chat', async(req,res ) => {
  try{
    const { messages } = req.body;  // Changed from {message} to {messages}
    const response = await axios({
      method: 'post',
      url: 'https://api-inference.huggingface.co/models/Ruthu1/skincare',
      headers: {
        'Authorization':  `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        // Get the last message from messages array
        inputs: messages[messages.length - 1].content
      }
    });
    const reply = response.data[0].generated_text;
    res.status(200).json({reply});
  }
  catch (error) {
      if (error.response?.data) {
        console.error('API Error:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      res.status(500).json({ 
        error: 'Failed to get a response from AI.',
        details: error.response?.data || error.message
      });
    }
});
app.post('/dashboard/message/save', async (req, res) => {
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
app.get('/dashboard/message/:name', async (req, res) => {
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

app.delete('/dashboard/messages/clear/:name', async (req, res) => {
  const {name} = req.params;

  try {
    await Message.deleteMany({ name });

    res.status(200).json({ message: 'Messages cleared successfully.' });
  } catch (error) {
    console.error('Error clearing messages:', error);
    res.status(500).json({ error: 'Failed to clear messages.' });
  }
});
app.post('/logout', async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, error: 'Failed to log out' });
  }
});

app.use(express.static('public'));

// Use the messages route
// app.use('/dashboard/message/save', messagesRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
