const pkg = require('ios-news');
const { IOSNEWS } = pkg;

/**
 * Fetches the latest news from the iOS News API.
 * @returns {Promise<Object>} - The latest news data.
 */
const fetchIOSNews = async () => {
  try {
    // Fetch the news data
    const data = await IOSNEWS();
    const response = await data.all(); // Fetch all news

    // Log the full response for debugging
    console.log('Full iOS News API Response:', response);

    // Check if response is valid and contains the expected properties
    if (response && response.status && Array.isArray(response.result)) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: response.result // Extract the articles from the response
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from iOS News API. Please check the API documentation for the correct response structure.'
      };
    }
  } catch (error) {
    console.error('Error fetching iOS News data:', error); // Debugging line
    return {
      status: 'error',
      message: error.message || 'An error occurred while fetching iOS News data.'
    };
  }
};

// Export the function
module.exports = fetchIOSNews;
