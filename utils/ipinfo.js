// utils/ipLookup.js
const axios = require('axios');

/**
 * Fetches information about the given IP address.
 * @param {string} ipAddress - The IP address to look up.
 * @returns {Promise<Object>} - The IP information or an error message.
 */
const fetchIPInfo = async (ipAddress) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${encodeURIComponent(ipAddress)}/json`);

    return {
      status: 'success',
      data: response.data,
    };
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'An error occurred while fetching IP information.');
  }
};

// Export the function
module.exports = fetchIPInfo;
