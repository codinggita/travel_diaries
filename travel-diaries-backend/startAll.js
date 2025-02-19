import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ---------------- COUNTRY MODEL ----------------
const countrySchema = new mongoose.Schema({
  id: String,
  hero: { title: String, description: String, buttonText: String, image: String },
  discover: { title: String, description: String },
  infoCards: [{ title: String, icon: String, description: String }],
  activities: [{ image: String, title: String, description: String }],
});

const Country = mongoose.model('Country', countrySchema);

app.get('/api/countries', async (req, res) => {
  const data = await Country.find();
  res.json(data);
});

app.get('/api/countries/id', async (req, res) => {
  try {
    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/api/countries', async (req, res) => {
  const newData = new Country(req.body);
  await newData.save();
  res.status(201).json({ message: 'New country data added successfully', data: newData });
});

app.patch('/api/countries/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedData = await Country.findOneAndUpdate({ id }, updates, { new: true });
  if (!updatedData) return res.status(404).json({ message: 'Data not found' });
  res.json({ message: 'Country data updated successfully', data: updatedData });
});

app.delete('/api/countries/:id', async (req, res) => {
  const { id } = req.params;
  const deletedData = await Country.findOneAndDelete({ id });
  if (!deletedData) return res.status(404).json({ message: 'Data not found' });
  res.json({ message: 'Country data deleted successfully' });
});

// ---------------- JOURNAL MODEL ----------------
const journalSchema = new mongoose.Schema({
  journalId: { type: String, unique: true, default: uuidv4 },
  title: String,
  content: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
});

const Journal = mongoose.model('Journal', journalSchema);

app.post('/api/journals', async (req, res) => {
  try {
    const { title, content, username } = req.body;
    const journal = new Journal({ title, content, username });
    await journal.save();
    res.status(201).json({ message: 'Journal created successfully', journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/journals', async (req, res) => {
  const journals = await Journal.find();
  res.json(journals);
});

app.get('/api/journals/:journalId', async (req, res) => {
  const { journalId } = req.params;
  const journal = await Journal.findOne({ journalId });
  if (!journal) return res.status(404).json({ error: 'Journal not found' });
  res.json(journal);
});

app.get('/api/journals/user/:username', async (req, res) => {
  const { username } = req.params;
  const journals = await Journal.find({ username });
  if (!journals.length) return res.status(404).json({ error: 'No journals found for this username' });
  res.json(journals);
});

app.put('/api/journals/:journalId', async (req, res) => {
  const { journalId } = req.params;
  const { title, content } = req.body;
  const updatedJournal = await Journal.findOneAndUpdate(
    { journalId },
    { title, content },
    { new: true }
  );
  if (!updatedJournal) return res.status(404).json({ error: 'Journal not found' });
  res.json({ message: 'Journal updated successfully', updatedJournal });
});

app.delete('/api/journals/:journalId', async (req, res) => {
  const { journalId } = req.params;
  const deletedJournal = await Journal.findOneAndDelete({ journalId });
  if (!deletedJournal) return res.status(404).json({ error: 'Journal not found' });
  res.json({ message: 'Journal deleted successfully' });
});

// ---------------- USER MODEL ----------------
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  authMethod: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
  const { username, email, password, authMethod } = req.body;
  const user = new User({ username, email, password, authMethod });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// ---------------- PROXY ROUTE ----------------
app.get('/proxy', async (req, res) => {
  const targetURL = req.query.url;
  if (!targetURL) return res.status(400).send('URL is required');

  try {
    const response = await fetch(targetURL);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(500).send(`Error fetching the URL: ${error.message}`);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
