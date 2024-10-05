const axios = require('axios');

/**
 * Searches for videos on YouTube using the Delirius API.
 * @param {string} query - The search query.
 * @returns {Promise<Object>} - The search results.
 */
const youtubeSearcher = async (query) => {
  try {
    const response = await axios.get('https://deliriusapi-official.vercel.app/search/ytsearch', {
      params: { q: query }
    });

    // Check if response has data and is in the expected format
    if (response.data && response.data.data) {
      return {
        status: 'success',
        data: response.data.data // Ensure you're extracting the correct data here
      };
    } else {
      return {
        status: 'error',
        message: 'Unexpected response format from YouTube API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'An error occurred while searching YouTube.'
    };
  }
};

/**
 * Generates a canvas image with the specified text using the Delirius API.
 * @param {string} text - The text to be displayed on the canvas.
 * @param {string} color - The color of the text.
 * @returns {Promise<Object>} - The canvas image URL.
 */
const generateCanvasImage = async (text, color = 'white') => {
  try {
    const response = await axios.get(`https://deliriusapi-official.vercel.app/canvas/ttp`, {
      params: {
        text: text,
        color: color
      }
    });

    // Check if response has data and is in the expected format
    if (response.data && response.data.url) {
      return {
        status: 'success',
        data: response.data.url // Extract the canvas image URL
      };
    } else {
      return {
        status: 'error',
        message: 'Unexpected response format from Canvas API.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'An error occurred while generating canvas image.'
    };
  }
};

// Export the functions
module.exports = {
  youtubeSearcher,
  generateCanvasImage
};
