const axios = require('axios');

/**
 * Fetches game details from the specified API.
 * @param {string} query - The game title to search for (e.g., 'Left 4 Dead').
 * @returns {Promise<Object>} - The game details or an error message.
 */
const fetchGameDetails = async (query) => {
  try {
    const response = await axios.get('https://deliriusapi-official.vercel.app/search/steam', {
      params: {
        query: query
      }
    });

    // Log the actual response for debugging
    console.log("API Response:", response.data);

    // Check if response has data and is in the expected format
    if (response.data && response.data.total_results > 0) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        total_results: response.data.total_results,
        data: response.data.data.map(game => ({
          title: game.title,
          url: game.url,
          image: game.image,
          release_date: game.release_date,
          price: game.price,
          rating: game.rating
        }))
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'No games found for the given query.',
        actualResponse: response.data // Include the actual response for debugging
      };
    }
  } catch (error) {
    console.error("Error fetching game details:", error);
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response ? error.response.data.message : error.message || 'An error occurred while fetching game details.'
    };
  }
};

// Export the function
module.exports = fetchGameDetails;
