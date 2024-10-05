// utils/nationalize.js
const axios = require('axios');

/**
 * Fetches nationality prediction for a given name from the Nationalize API.
 * @param {string} name - The name to predict the nationalities for.
 * @returns {Promise<Object>} - The nationality prediction data or an error message.
 */
const fetchNationalityPrediction = async (name) => {
  try {
    const response = await axios.get(`https://api.nationalize.io`, {
      params: {
        name: name,
      },
    });

    return {
      status: 'success',
      data: response.data, // Contains nationality prediction details
    };
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred while fetching nationality prediction.');
  }
};

// Export the function
module.exports = fetchNationalityPrediction;
