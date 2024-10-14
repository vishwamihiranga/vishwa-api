const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from pastpapers.wiki
 * @param {string} searchQuery - The search query
 * @returns {Promise<Object>} - The search results or an error message
 */
const scrapePastPapersWiki = async (searchQuery) => {
  try {
    const url = `https://pastpapers.wiki/?s=${encodeURIComponent(searchQuery)}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);

    const searchResults = [];

    $('article.jeg_post').each((_, element) => {
      const $element = $(element);

      const title = $element.find('.jeg_post_title a').text().trim();
      const link = $element.find('.jeg_post_title a').attr('href');
      const excerpt = $element.find('.jeg_post_excerpt p').text().trim();
      const thumbnail = $element.find('.thumbnail-container img').attr('src');

      searchResults.push({
        title,
        link,
        excerpt,
        thumbnail
      });
    });

    return {
      status: 'success',
      query: searchQuery,
      results: searchResults,
      totalResults: searchResults.length
    };
  } catch (error) {
    console.error('Scraping error:', error);

    return {
      status: 'error',
      message: 'Error occurred while scraping search results.',
      details: error.message
    };
  }
};

module.exports = { scrapePastPapersWiki };
