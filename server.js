require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proposalDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Response schema
const responseSchema = new mongoose.Schema({
  name: String,
  answer: String,
  message: String,
  contact: String,
  date: { type: Date, default: Date.now },
  location: String,
  customLocation: String
});

const Response = mongoose.model('Response', responseSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.post('/submit-response', async (req, res) => {
  try {
    const { name, answer, message, contact, location, customLocation } = req.body;
    const newResponse = new Response({ 
      name, 
      answer, 
      message, 
      contact, 
      location,
      customLocation 
    });
    await newResponse.save();
    res.json({ success: true, message: 'Response saved successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving response' });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/admin/responses', async (req, res) => {
  try {
    const responses = await Response.find().sort({ date: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching responses' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});