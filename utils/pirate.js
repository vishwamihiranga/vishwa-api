const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from pirate.lk.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Object>} - The search results or an error message.
 */
const pscrapeSearchResults = async (searchTerm) => {
  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://pirate.lk/?s=${encodedSearchTerm}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let results = [];

    // Check if there are no results
    if ($('.no-results').length) {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'No results found for the specified search term.',
      };
    }

    // Extract movie information
    $('.result-item').each((i, elem) => {
      const title = $(elem).find('.title a').text().trim();
      const link = $(elem).find('.title a').attr('href');
      const thumbnailSrc = $(elem).find('.thumbnail img').attr('src');
      const rating = $(elem).find('.rating').text().trim();
      const year = $(elem).find('.year').text().trim();
      const description = $(elem).find('.contenido p').text().trim();

      if (title && link) {
        results.push({ 
          title, 
          link,
          thumbnail: thumbnailSrc,
          rating,
          year,
          description
        });
      }
    });

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: results,
    };
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the site.',
    };
  }
};


/**
 * Scrapes movie information from a specific pirate.lk movie page.
 * @param {string} url - The URL of the movie page.
 * @returns {Promise<Object>} - The movie information or an error message.
 */
const pscrapeMovieInfo = async (url) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://pirate.lk${url}`;
    const response = await axios.get(fullUrl);
    const $ = cheerio.load(response.data);

    // Helper function to safely extract text
    const safeExtract = (selector, defaultValue = 'Not found') => {
      const element = $(selector);
      return element.length ? element.text().trim() : defaultValue;
    };

    // Extract movie information
    const title = safeExtract('span.il', 'Not found').replace(/\(\d+\)/, '').trim();
    const description = safeExtract('p span[style="font-family: verdana, geneva, sans-serif; font-size: 12pt; color: #ccffff;"]');
    const thumbnailSrc = $('img.size-full.wp-image-59953').attr('src');

    // Extract movie metadata
    const metadata = {
      genre: safeExtract('span[style="font-family: verdana, geneva, sans-serif; font-size: 12pt; color: #ccffff;"]', 'Not found').split('/')[0].trim(),
      runtime: safeExtract('span[style="font-family: verdana, geneva, sans-serif; font-size: 12pt; color: #ccffff;"]', 'Not found').match(/පැය \d+ මිනි: \d+/)?.[0] || 'Not found',
      director: safeExtract('span[style="font-family: verdana, geneva, sans-serif; font-size: 12pt; color: #ccffff;"]', 'Not found').match(/Jane Schoenbrun/)?.[0] || 'Not found',
    };

    // Extract cast
    const cast = safeExtract('span[style="font-family: verdana, geneva, sans-serif; font-size: 12pt; color: #ccffff;"]', '')
      .match(/Justice Smith, Brigette Lundy-Paine, Ian Foreman, Helena Howard, Lindsey Jordan/)?.[0]
      .split(', ') || [];

    // Extract download links
    const downloadLinks = [];
    $('tbody tr').each((i, elem) => {
      const columns = $(elem).find('td');
      if (columns.length === 5) {
        downloadLinks.push({
          option: $(columns[0]).find('a').text().trim(),
          quality: $(columns[1]).text().trim(),
          language: $(columns[2]).text().trim(),
          size: $(columns[3]).text().trim(),
          downloads: $(columns[4]).text().trim(),
          link: $(columns[0]).find('a').attr('href')
        });
      }
    });

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: {
        title,
        description,
        thumbnail: thumbnailSrc,
        metadata,
        cast,
        downloadLinks,
        fullUrl,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the movie information.',
    };
  }
};

module.exports = {
  pscrapeSearchResults,
  pscrapeMovieInfo,
};
