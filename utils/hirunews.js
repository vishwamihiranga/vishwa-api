const axios = require('axios');

/**
 * Fetches data from the Delirius API using a query.
 * @param {string} query - The query string to search for.
 * @returns {Promise<Object>} - The API response data or an error message.
 */
const fetchDeliriusData = async (query) => {
  const baseUrl = 'https://deliriusapi-official.vercel.app/ia/chatgpt?q=';
  const url = `${baseUrl}${encodeURIComponent(query)}`; // Encode the query for the URL

  try {
    const response = await axios.get(url); // Fetch data from the API
    console.log('Fetched Delirius Data:', response.data); // Log the raw response

    // Check if the response contains valid data
    if (response.data) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.data, // Return the fetched data
      };
    } else {
      throw new Error('No data found for the given query.');
    }
  } catch (error) {
    console.error('Error details:', error.message); // Log the error message
    throw new Error(`Error fetching data from Delirius API: ${error.message}`);
  }
};

// Export the function
module.exports = fetchDeliriusData;
