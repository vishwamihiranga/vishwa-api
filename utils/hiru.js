const Hiru = require('hirunews-scrap');

/**
 * Fetches the latest news articles from HiruNews.
 * @returns {Promise<Object>} - The latest news articles or an error message.
 */
const fetchHiruNews = async () => {
  const api = new Hiru(); // Initialize the Hiru API

  try {
    const breakingNews = await api.BreakingNews();
    const mainNews = await api.MainNews();

    // Combine breaking news and main news
    const allNews = [breakingNews.results, mainNews.results].filter(Boolean);

    if (breakingNews.code === 200 && mainNews.code === 200) {
      return {
        status: 'success',
        Author: 'Omindu Anjana',
        data: allNews,
      };
    } else {
      throw new Error('Invalid data format: Expected successful response codes.');
    }
  } catch (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }
};

// Export the fetchHiruNews function
module.exports = {
  fetchHiruNews,
};