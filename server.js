const express = require('express');
const path = require('path');
const cors = require('cors');
const classifyRouter = require('./classify');

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

app.use('/', classifyRouter);

// Mount the router on the app
app.use('/', router);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});