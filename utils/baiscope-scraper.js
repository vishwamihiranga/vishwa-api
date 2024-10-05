const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from www.baiscope.lk.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Object>} - The search results or an error message.
 */
const scrapeBaiscopeSearchResults = async (searchTerm) => {
  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://www.baiscope.lk/?s=${encodedSearchTerm}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let results = [];

    $('.elementor-post__card').each((i, elem) => {
      const titleElement = $(elem).find('.elementor-post__title a');
      const title = titleElement.text().trim();
      const link = titleElement.attr('href');
      const thumbnailElement = $(elem).find('.elementor-post__thumbnail img');
      const thumbnail = thumbnailElement.attr('src');

      if (title && link) {
        results.push({ title, link, thumbnail });
      }
    });

    return {
      status: 'success',
      data: results,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message || 'Error occurred while scraping the site.',
    };
  }
};

/**
 * Scrapes movie information from a specific Baiscope movie page.
 * @param {string} url - The URL of the movie page.
 * @returns {Promise<Object>} - The movie information or an error message.
 */
// Import required libraries


/**
 * Scrapes movie information from a Baiscope URL
 * @param {string} url - The URL of the Baiscope movie page
 * @returns {Promise<Object>} - A promise that resolves to an object containing the scraped data or an error
 */
const scrapeBaiscopeMovieInfo = async (url) => {
  try {
    // Fetch the HTML content of the page
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract movie title
    const title = $('h1.cm-entry-title').text().trim() || $('h1.entry-title').text().trim();

    // Extract movie poster URL
    const poster = $('.wp-block-image img').attr('src') || $('img.wp-image-234873').attr('src');

    // Extract movie description
    const description = $('.cm-entry-summary p').first().text().trim() || 
                        $('.wp-block-group__inner-container p').first().text().trim();

    // Extract summary (paragraphs 2-5)
    const summaryParagraphs = [];
    $('.cm-entry-summary p').each((i, elem) => {
      if (i > 0 && i < 5) {
        summaryParagraphs.push($(elem).text().trim());
      }
    });
    const summary = summaryParagraphs.join('\n\n');

    // Extract download links
    const downloadLinks = [];
    $('a[href*="Downloads"]').each((i, elem) => {
      const linkText = $(elem).text().trim();
      const linkUrl = $(elem).attr('href');
      if (linkText && linkUrl) {
        downloadLinks.push({ text: linkText, url: linkUrl });
      }
    });

    // Extract IMDB rating
    const imdbRating = $('.imdbRatingPlugin').attr('data-title');

    // Extract categories
    const categories = [];
    $('.cm-post-categories a').each((i, elem) => {
      categories.push($(elem).text().trim());
    });

    // Return the scraped data
    return {
      status: 'success',
      data: {
        title,
        poster,
        description,
        summary,
        downloadLinks,
        pageUrl: url,
        imdbRating,
        categories,
      },
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      status: 'error',
      message: 'Error occurred while scraping the movie information.',
      error: error.message,
    };
  }
};

module.exports = {
  scrapeBaiscopeSearchResults,
  scrapeBaiscopeMovieInfo,
};