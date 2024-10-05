const axios = require('axios');

/**
 * Fetches thread data from the Delirius API.
 * @param {string} threadUrl - The URL of the thread to fetch data from.
 * @returns {Promise<Object>} - The thread data.
 */
const fetchThreadData = async (threadUrl) => {
  try {
    const response = await axios.get('https://deliriusapi-official.vercel.app/download/threads', {
      params: { url: threadUrl }
    });

    // Check if response has data and is in the expected format
    if (response.data && response.data.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data.data // Extract the thread data
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from Threads API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching thread data.'
    };
  }
};

// Export the function
module.exports = fetchThreadData;
