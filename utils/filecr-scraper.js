const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from filecr.com
 * @param {string} query - The search query
 * @param {number} page - The page number to scrape (default: 1)
 * @returns {Promise<Object>} - The search results or an error message
 */
const scrapeFileCR = async (query, page = 1) => {
  try {
    const url = `https://filecr.com/search/?q=${encodeURIComponent(query)}&id=927598590000&page=${page}`;
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

    $('.card_wrap__S35wt').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.card_title__az7G7').text().trim();
      const link = 'https://filecr.com' + $element.find('.card_title__az7G7').attr('href');
      const description = $element.find('.card_desc__b66Ca').text().trim();
      const category = $element.find('.card_category__4DBde').text().trim();
      const downloads = $element.find('.card_meta-text__KdSKY').text().trim();
      const size = $element.find('.card_size__8bQyg').text().trim();
      const rating = $element.find('.ratings').children('.faved').length;

      searchResults.push({
        title,
        link,
        description,
        category,
        downloads,
        size,
        rating
      });
    });

    // Get pagination info
    const totalPages = $('.pagination button').length;
    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      status: 'success',
      query,
      currentPage: page,
      totalPages,
      hasNextPage,
      nextPage,
      results: searchResults
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

module.exports = { scrapeFileCR };
