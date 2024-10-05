const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches NASA's Astronomy Picture of the Day (APOD) using NASA's API.
 * @param {string} apikey - The NASA API key.
 * @returns {Promise<Object>} - The APOD details.
 */
const fetchAPOD = async (apikey) => {
  try {
    // Make the request to the NASA APOD API using the provided API key
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: { api_key: 'gb6uaMdxU269hknYpQKIcDr1PQnWeTBNhjoc0VWj' } // Use the provided API key
    });

    // Check if the response has data and is in the expected format
    if (response.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data // Extract the APOD data
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from NASA API.'
      };
    }
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code outside of the 2xx range
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: `Error: ${error.response.status} - ${error.response.data}`
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'No response received from NASA API.'
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: `Error: ${error.message}`
      };
    }
  }
};

// Export the fetchAPOD function directly
module.exports = fetchAPOD;