const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from sinhalasub.lk.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Object>} - The search results or an error message.
 */
const sscrapeSearchResults = async (searchTerm) => {
  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://sinhalasub.lk/?s=${encodedSearchTerm}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let results = [];

    // Check if there are no results
    if ($('.no-results').length) {
      return {
        status: 'error',
        author: 'AI Assistant',
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
      const type = $(elem).find('.movies').text().trim();

      if (title && link) {
        results.push({ 
          title, 
          link,
          thumbnail: thumbnailSrc,
          rating,
          year,
          description,
          type
        });
      }
    });

    return {
      status: 'success',
      author: 'Vishwa MIhiranga',
      data: results,
    };
  } catch (error) {
    return {
      status: 'error',
      author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the site.',
    };
  }
};

/**
 * Scrapes movie information from a specific sinhalasub.lk movie page.
 * @param {string} url - The URL of the movie page.
 * @returns {Promise<Object>} - The movie information or an error message.
 */
const sscrapeMovieInfo = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Helper function to safely extract text
    const safeExtract = (selector, defaultValue = 'Not found') => {
      const element = $(selector);
      return element.length ? element.text().trim() : defaultValue;
    };

    // Extract movie information
    const title = safeExtract('.sheader .data .head h1');
    const description = safeExtract('.wp-content p');
    const thumbnailSrc = $('.sheader .poster img').attr('src');

    // Extract movie metadata
    const metadata = {
      tagline: safeExtract('.sheader .data .extra .tagline'),
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
    $('#download .links_table tbody tr').each((_, elem) => {
      downloadLinks.push({
        option: $(elem).find('td:first-child a').text().trim(),
        quality: $(elem).find('td:nth-child(2) strong').text().trim(),
        size: $(elem).find('td:last-child').text().trim(),
        link: $(elem).find('td:first-child a').attr('href')
      });
    });

    return {
      status: 'success',
      author: 'Vishwa Mihiranga',
      data: {
        title,
        description,
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
      author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the movie information.',
    };
  }
};

const scrapeDownloadLink = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract the download link
    const fullDownloadLink = $('#link').attr('href');

    // Extract the file ID from the full download link
    const fileId = fullDownloadLink.split('/').pop();

    // Construct the pixeldrain API URL
    const pixeldrainApiUrl = `https://pixeldrain.com/api/file/${fileId}`;

    return {
      status: 'success',
      author: 'Vishwa Mihiranga',
      data: {
        downloadLink: pixeldrainApiUrl,
        fullUrl: url,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the download link.',
    };
  }
};


module.exports = {
  sscrapeSearchResults,
  sscrapeMovieInfo,
  scrapeDownloadLink,
};
