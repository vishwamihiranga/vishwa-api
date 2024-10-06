const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes movie information from a specific CineSubz movie page.
 * @param {string} url - The URL of the movie page.
 * @returns {Promise<Object>} - The movie information or an error message.
 */
const scrapeCineSubzMovieInfo = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Helper function to safely extract text
    const safeExtract = (selector, defaultValue = 'Not found') => {
      const element = $(selector);
      return element.length ? element.text().trim() : defaultValue;
    };

    // Extract movie information
    const title = safeExtract('.sheader .data h1');
    const thumbnailSrc = $('.sheader .poster img').attr('src');

    // Extract metadata
    const metadata = {
      releaseDate: safeExtract('.sheader .data .extra .date'),
      country: safeExtract('.sheader .data .extra .country'),
      runtime: safeExtract('.sheader .data .extra .runtime'),
      genres: $('.sheader .data .sgeneros a').map((_, el) => $(el).text().trim()).get(),
    };

    // Extract rating
    const rating = {
      value: safeExtract('.dt_rating_vgs'),
      count: safeExtract('.rating-count'),
    };

    // Extract download links
    const downloadLinks = [];
    $('table tbody tr').each((_, elem) => {
      downloadLinks.push({
        quality: $(elem).find('td:first-child a').text().trim(),
        size: $(elem).find('td:nth-child(2)').text().trim(),
        language: $(elem).find('td:nth-child(3)').text().trim(),
        link: $(elem).find('td:first-child a').attr('href')
      });
    });

    return {
      status: 'success',
      author: 'Vishwa Mihiranga',
      data: {
        title,
        thumbnail: thumbnailSrc,
        metadata,
        rating,
        downloadLinks,
        fullUrl: url,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Error occurred while scraping the movie information.',
    };
  }
};

module.exports = { scrapeCineSubzMovieInfo };
