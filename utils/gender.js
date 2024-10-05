// utils/genderize.js
const axios = require('axios');

/**
 * Fetches gender prediction for a given name from the Genderize API.
 * @param {string} name - The name to predict the gender for.
 * @returns {Promise<Object>} - The gender prediction data or an error message.
 */
const fetchGenderPrediction = async (name) => {
  try {
    const response = await axios.get(`https://api.genderize.io`, {
      params: {
        name: name,
      },
    });

    return {
      status: 'success',
      data: response.data, // Contains gender prediction details
    };
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred while fetching gender prediction.');
  }
};

// Export the function
module.exports = fetchGenderPrediction;
