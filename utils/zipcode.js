// utils/zipcodeLookup.js
const axios = require('axios');

/**
 * Fetches ZIP code information from Zipcodebase.
 * @param {string} zipCode - The ZIP code to search for.
 * @param {string} apiKey - Your Zipcodebase API key.
 * @returns {Promise<Object>} - The ZIP code information or an error message.
 */
const fetchZipcodeInfo = async (zipCode, apiKey) => {
  try {
    const response = await axios.get(`https://app.zipcodebase.com/api/v1/search`, {
      params: {
        apikey: apiKey,
        codes: zipCode,
      },
    });

    return {
      status: 'success',
      data: response.data,
    };
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred while fetching ZIP code information.');
  }
};

// Export the function
module.exports = fetchZipcodeInfo;
