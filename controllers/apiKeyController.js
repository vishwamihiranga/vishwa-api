const { updateApiKey } = require('../config/config'); // Adjust path as necessary

// Route to add or update an API key
const addOrUpdateApiKey = (req, res) => {
  const { key, expiration } = req.body;

  if (!key || !expiration) {
    return res.status(400).json({ error: 'Both key and expiration date are required' });
  }

  updateApiKey(key, expiration);
  res.json({ message: `API Key ${key} has been added/updated successfully!` });
};

module.exports = { addOrUpdateApiKey }; // Export the function using CommonJS syntax
