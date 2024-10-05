// utils.js
const axios = require('axios');

/**
 * Fetches the current location of the International Space Station (ISS).
 * @returns {Promise<Object>} - The current latitude and longitude of the ISS or an error message.
 */
const fetchISSLocation = async () => {
  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json');

    if (response.data.message === 'success' && response.data.iss_position) {
      const { latitude, longitude } = response.data.iss_position;

      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: {
          latitude,
          longitude,
          timestamp: response.data.timestamp // Include the timestamp for reference
        }
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Failed to retrieve ISS location or invalid response format.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.message || 'An error occurred while fetching ISS location.'
    };
  }
};

// Export the function
module.exports = fetchISSLocation;
