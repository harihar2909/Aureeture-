// backend/src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import all your models
import Lead from './modals/Lead'; 
import EnterpriseDemo from './modals/EnterpriseDemo';
import Message from './modals/Message'; // <-- 1. Import the new Message model
import Profile from './modals/Profile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

  
// --- EXISTING API ENDPOINT for Lead Modal ---
app.post('/api/leads', async (req, res) => {
  // (This code remains unchanged)
  try {
    const { name, email, mobile, utm, page } = req.body;
    if (!name || !email || !mobile) {
      return res.status(400).json({ message: 'Name, email, and mobile are required.' });
    }
    const newLead = new Lead({ name, email, mobile, utm, page, source: 'website-modal' });
    await newLead.save();
    res.status(201).json({ message: 'Lead saved successfully!' });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// --- PROFILE API ---
// Get profile by Clerk userId
app.get('/api/profile', async (req, res) => {
  try {
    const { userId } = req.query as { userId?: string };
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// Create or update profile
app.post('/api/profile', async (req, res) => {
  try {
    const { userId, email, name, education, skills, interests } = req.body;
    if (!userId || !email || !name) {
      return res.status(400).json({ message: 'userId, email, and name are required.' });
    }
    const update = { email, name, education, skills, interests };
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: update },
      { upsert: true, new: true }
    );
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// --- NEW API ENDPOINT for Enterprise Demo Form ---
app.post('/api/enterprise-demo', async (req, res) => {
  try {
    const { name, email, company, page } = req.body;

    // Server-side validation
    if (!name || !email || !company) {
      return res.status(400).json({ message: 'Name, email, and company are required.' });
    }

    const newDemoRequest = new EnterpriseDemo({ name, email, company, page });
    await newDemoRequest.save();

    res.status(201).json({ message: 'Demo request saved successfully!' });
  } catch (error) {
    console.error('Error saving demo request:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// --- NEW API ENDPOINT for Contact Form ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Server-side validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required.' });
    }

    const newMessage = new Message({ name, email, phone, subject, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});