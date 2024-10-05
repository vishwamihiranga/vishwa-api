const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes search results from ginisisilacartoon.net.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<Object>} - The search results or an error message.
 */
const scrapeSearchResults = async (searchTerm) => {
  try {
    // Encode the search term to handle spaces and special characters
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `https://ginisisilacartoon.net/search.php?q=${encodedSearchTerm}`;

    const response = await axios.get(url);

    // Load the HTML response into cheerio
    const $ = cheerio.load(response.data);
    let results = [];

    // Check for a specific element that indicates successful loading
    if ($('h1:contains("404")').length) {
      return {
        status: 'error',
        Author: 'Vishwa Mihiranga',
        message: 'No results found for the specified search term.',
      };
    }

    // Use the correct selector to find video titles and links
    $('.video-title a').each((i, elem) => {
      const title = $(elem).attr('title');  // Get title from the title attribute
      const relativeLink = $(elem).attr('href'); // Get the relative link
      const fullLink = `https://ginisisilacartoon.net/${relativeLink}`; // Prepend the base URL
      if (title && fullLink) {
        results.push({ title, link: fullLink });
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

const scrapeVideoInfo = async (url) => {
  try {
    // Ensure the URL is complete
    const fullUrl = url.startsWith('http') ? url : `https://ginisisilacartoon.net/${url}`;
    const response = await axios.get(fullUrl);
    const $ = cheerio.load(response.data);

    // Helper function to safely extract text
    const safeExtract = (selector, defaultValue = 'Not found') => {
      const element = $(selector);
      return element.length ? element.text().trim() : defaultValue;
    };

    // Extract video information safely
    const title = safeExtract('#watch-contentHd', 'Title not found');

    // Extract information from vdo_information_txt
    const infoText = $('#vdo_information_txt').html();
    const uploader = $('strong', '#vdo_information_txt').text().trim() || 'Uploader not found';

    // Use regex to extract upload date, accounting for the extra <br>
    const uploadDateMatch = infoText.match(/<br>\s*on\s*(.*?)<br>/);
    const uploadDate = uploadDateMatch ? uploadDateMatch[1].trim() : 'Upload date not found';

    const viewsMatch = infoText.match(/(\d+)\s*views/);
    const views = viewsMatch ? viewsMatch[1] + ' views' : 'Views not found';

    // Extract video link
    const videoLinkElement = $('.player iframe');
    const videoLink = videoLinkElement.length ? videoLinkElement.attr('src') : 'Video link not found';

    // Extract thumbnail image
    const thumbnailElement = $('.watch-video-thumb-wrapper img');
    const thumbnailSrc = thumbnailElement.length ? thumbnailElement.attr('src') : 'Thumbnail not found';
    const thumbnail = thumbnailSrc.startsWith('http') ? thumbnailSrc : `https://ginisisilacartoon.net/${thumbnailSrc}`;

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: {
        title,
        uploader,
        uploadDate,
        views,
        videoLink,
        thumbnail,
        fullUrl,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.response?.data?.reason || error.message || 'Error occurred while scraping the video information.',
    };
  }
};

module.exports = {
  scrapeSearchResults,
  scrapeVideoInfo,
};