let apiKeys = {
  'key1': { expires: '2024-12-31' },
  'key2': { expires: '2025-01-31' },
  'key3': { expires: '2025-06-30' }
};

// Function to add or update an API key
const updateApiKey = (key, expirationDate) => {
  apiKeys[key] = { expires: expirationDate };
  console.log(`API Key ${key} has been updated/added with expiration: ${expirationDate}`);
};

// Exporting apiKeys and updateApiKey using CommonJS
module.exports = { apiKeys, updateApiKey };
