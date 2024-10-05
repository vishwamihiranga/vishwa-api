const express = require('express');
const checkApiKey = require('./middleware/checkApiKey');
const miscRoutes = require('./routes/misc');
const { addOrUpdateApiKey } = require('./controllers/apiKeyController');
const path = require('path');

// Initialize the app
const app = express();
const port = process.env.PORT || 3000; // Use environment port if available

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Protect all routes under '/misc' with the API key middleware
app.use('/misc', checkApiKey, miscRoutes);

// API key management route
app.post('/apikey/add', addOrUpdateApiKey);

// Root endpoint, serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



// Start the server
app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});
