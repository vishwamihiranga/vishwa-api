const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes news articles from www.pcguide.lk
 * @param {number} page - The page number to scrape (for pagination)
 * @returns {Promise<Object>} - The scraped news articles or an error message
 */
const scrapePCGuide = async (page = 1) => {
  try {
    const url = `https://www.pcguide.lk/page/${page}/`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);
    const newsArticles = [];

    $('.post-grid').each((_, element) => {
      const $element = $(element);
      const title = $element.find('.post-title a').text().trim();
      const link = $element.find('.post-title a').attr('href');
      const excerpt = $element.find('.excerpt').text().trim();
      const thumbnail = $element.find('.thumb img').attr('src');
      const date = $element.find('.meta li:nth-child(2)').text().trim();
      const author = $element.find('.meta li:nth-child(1) a').text().trim();

      newsArticles.push({
        title,
        link,
        excerpt,
        thumbnail,
        date,
        author
      });
    });

    const hasMorePages = $('.btn.btn-simple').length > 0;

    return {
      status: 'success',
      page,
      results: newsArticles,
      hasMorePages
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      status: 'error',
      message: 'Error occurred while scraping news articles.',
      details: error.message
    };
  }
};

module.exports = { scrapePCGuide };
