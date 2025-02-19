import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

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

app.listen(5000, () => {
  console.log('Proxy server running on port 5000');
});
