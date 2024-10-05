const axios = require('axios');

/**
 * Fetches location information based on the provided IP address.
 * @param {string} ipAddress - The IP address to look up.
 * @returns {Promise<Object>} - The location information.
 */
const getLocationInfo = async (ipAddress) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${encodeURIComponent(ipAddress)}/json`);

    // Check if response has data and is in the expected format
    if (response.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data // Return the location data
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from IPinfo API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching location information.'
    };
  }
};

// Export the function
module.exports = getLocationInfo;
