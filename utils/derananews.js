// utils/deranews.js
const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches Dera News data from the API.
 * @returns {Promise<Object>} - The Dera News data.
 */
const fetchDeraNews = async () => {
  try {
    const response = await axios.get('https://prabath-md-api.up.railway.app/api/derananews', {
      params: { apikey: '6467ad0b29' }
    });

    // Check if response has data and is in the expected format
    if (response.data && response.data.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data.data // Extract the Dera News data
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from Dera News API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.message || 'An error occurred while fetching Dera News data.'
    };
  }
};

// Export the fetchDeraNews function
module.exports = {
  fetchDeraNews,
};