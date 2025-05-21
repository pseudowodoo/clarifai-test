const express = require('express');
const path = require('path');
const cors = require('cors');
const classifyRouter = require('./classify');
const axios = require('axios'); // Use axios instead of node-fetch

const app = express();
const router = express.Router();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example default route: Home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Good Vibes route: fetch a feel-good quote of the day using axios
router.get('/api/good_vibes', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/today');
    const data = response.data;
    // ZenQuotes returns an array of quotes
    const quote = data[0]?.q;
    const author = data[0]?.a;
    res.json({ quote, author });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

app.use('/', classifyRouter);

// Mount the router on the app
app.use('/', router);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});