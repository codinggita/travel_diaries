const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/travelData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const countrySchema = new mongoose.Schema({
  id: String,
  hero: {
    title: String,
    description: String,
    buttonText: String,
    image: String,
  },
  discover: {
    title: String,
    description: String,
  },
  infoCards: [
    {
      title: String,
      icon: String,
      description: String,
    },
  ],
  activities: [
    {
      image: String,
      title: String,
      description: String,
    },
  ],
});

const Country = mongoose.model('Country', countrySchema);

app.get('/api/countries', async (req, res) => {
  const data = await Country.find();
  res.json(data);
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
  if (!updatedData) {
    return res.status(404).json({ message: 'Data not found' });
  }
  res.json({ message: 'Country data updated successfully', data: updatedData });
});

app.delete('/api/countries/:id', async (req, res) => {
  const { id } = req.params;
  const deletedData = await Country.findOneAndDelete({ id });
  if (!deletedData) {
    return res.status(404).json({ message: 'Data not found' });
  }
  res.json({ message: 'Country data deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});