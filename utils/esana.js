const Esana = require('@sl-code-lords/esana-news'); // Use require for CommonJS

const api = new Esana(); // Initialize the Esana API

/**
 * Fetches the latest news articles from Esana.
 * @returns {Promise<Object>} - The latest news articles or an error message.
 */
const fetchEsanaNews = async () => {
  try {
    const newsData = await api.list(); // Fetch the latest news articles

    // Check if the results field contains an array
    if (newsData.code === 200 && Array.isArray(newsData.results)) {
      // Here, we only take the latest 20 news articles
      const latestNews = newsData.results.slice(0, 20);
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        data: latestNews,
      };
    } else {
      throw new Error('Invalid data format: Expected an array in results.');
    }
  } catch (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }
};

// Export the fetchEsanaNews function
module.exports = {
  fetchEsanaNews,
};
