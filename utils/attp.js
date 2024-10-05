// utils/canvasGenerator.js
const axios = require('axios');
const FormData = require('form-data');

/**
 * Generates a canvas image using the Delirius API and uploads it to imgbb.
 * @param {string} text - The text to be displayed on the canvas.
 * @param {string} color - The color of the text.
 * @returns {Promise<Object>} - The URL of the uploaded image on imgbb or an error message.
 */
const generateCanvasImage = async (text, color) => {
  try {
    // Step 1: Generate the canvas image
    const response = await axios.get(`https://deliriusapi-official.vercel.app/canvas/ttp`, {
      params: {
        text: text,
        color: color,
      },
      responseType: 'arraybuffer' // Important: Get the response as binary data
    });

    // Step 2: Upload the image to imgbb
    const formData = new FormData();
    formData.append('image', response.data, { filename: 'canvas.png' });
    formData.append('key', '9239fd3b50c89a683392ede29672318c'); // Your imgbb API key

    const uploadResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Return the direct link to the uploaded image
    return {
      status: 'success',
      data: uploadResponse.data.data.url, // Direct link to the uploaded image
    };
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'An error occurred while generating the canvas image.');
  }
};

// Export the function
module.exports = generateCanvasImage;
