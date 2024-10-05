const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches APK details from the specified API.
 * @param {string} packageName - The package name of the APK (e.g., 'com.whatsapp').
 * @returns {Promise<Object>} - The APK details or an error message.
 */
const fetchApkDetails = async (packageName) => {
  const apiKey = '6467ad0b29'; // Your API key

  try {
    const response = await axios.get('https://prabath-md-api.up.railway.app/api/apkdl', {
      params: {
        q: packageName,
        apikey: apiKey
      }
    });

    // Log the actual response for debugging
    console.log("API Response:", response.data);

    // Check if response has data and is in the expected format
    if (response.data && response.data.status === 'success ✅') {
      const { Created_by, ...apkData } = response.data; // Destructure and remove 'Created_by'
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: apkData.data // Return the APK details
      };
    } else {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'Unexpected response format from APK API.',
        actualResponse: response.data // Include the actual response for debugging
      };
    }
  } catch (error) {
    console.error("Error fetching APK details:", error);
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response ? error.response.data.message : error.message || 'An error occurred while fetching APK details.'
    };
  }
};

// Export the fetchApkDetails function as a default export
module.exports = fetchApkDetails; // Change to default export

// Example usage (can be removed in production)
if (require.main === module) {
  fetchApkDetails('com.whatsapp').then(console.log).catch(console.error);
}
