const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches search results from the Bing API using the Delirius API.
 * @param {string} query - The search query.
 * @returns {Promise<Object[]>} - An array of search results.
 */
async function Bing(query) {
  const searchUrl = `https://deliriusapi-official.vercel.app/search/bingsearch?query=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(searchUrl);

    // Check if the data is in the expected format
    if (data && Array.isArray(data.results)) {
      return data.results.map(result => ({
        Author: 'Vishwa Mihiranga',
        title: result.title || 'No title available', // Provide a default if title is missing
        link: result.url || 'No link available', // Provide a default if url is missing
        description: result.description || 'No description available' // Provide a default if description is missing
      })).filter(result => result.title && result.link && result.description);
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Bing search results:', error);
    return [];
  }
}

// Export the Bing function
module.exports = Bing; // Export directly
