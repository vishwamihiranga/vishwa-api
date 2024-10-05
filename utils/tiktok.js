const axios = require('axios');

/**
 * Fetches TikTok data from the Delirius API.
 * @param {string} tiktokUrl - The URL of the TikTok to fetch data from.
 * @returns {Promise<Object>} - The TikTok data.
 */
const fetchTikTokData = async (tiktokUrl) => {
  try {
    const response = await axios.get('https://deliriusapi-official.vercel.app/download/tiktok', {
      params: { url: tiktokUrl }
    });

    // Check if response has data and is in the expected format
    if (response.data && response.data.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data.data // Extract the TikTok data
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from TikTok API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching TikTok data.'
    };
  }
};

// Export the function
module.exports = fetchTikTokData;
