const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches current cricket matches data from CricAPI.
 * @param {string} apikey - The CricAPI key.
 * @returns {Promise<Object>} - The current matches data or error message.
 */
const fetchCurrentMatches = async (apikey) => {
  try {
    const apiKey = apikey || 'f68d1cb5-a9c9-47c5-8fcd-fbfe52bace78'; // Use provided or default API key

    const response = await axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: { apikey: apiKey }
    });

    // Handle the response based on the API's status field
    if (response.data && response.data.status === 'success') {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data.data // Return the current matches data
      };
    } else if (response.data && response.data.status === 'failure') {
      return {
        status: 'failure',
        Author: 'Vishwa Mihiranga',
        data: response.data,
        message: response.data.reason || 'Unknown failure reason'
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from CricAPI.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'An error occurred while fetching current matches from CricAPI.'
    };
  }
};

// Export the fetchCurrentMatches function
module.exports = fetchCurrentMatches; // Use default export

// Example usage (can be removed in production)
if (require.main === module) {
  fetchCurrentMatches().then(console.log).catch(console.error);
}
