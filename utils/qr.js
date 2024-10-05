// utils/qrcodeGenerator.js
const qrcode = require('qrcode');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Generates a QR code for the given text and uploads it to imgbb.
 * @param {string} text - The text to encode in the QR code.
 * @returns {Promise<Object>} - The uploaded QR code image URL or an error message.
 */
const generateAndUploadQRCode = async (text) => {
  try {
    // Step 1: Generate the QR code as a PNG image buffer
    const qrCodeBuffer = await qrcode.toBuffer(text);

    // Step 2: Upload the image to imgbb
    const formData = new FormData();
    formData.append('image', qrCodeBuffer, { filename: 'qrcode.png' });
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
    throw new Error(error.response ? error.response.data.message : 'An error occurred while generating and uploading the QR code.');
  }
};

// Export the function
module.exports = generateAndUploadQRCode;
