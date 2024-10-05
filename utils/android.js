const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes latest news from Android වැඩකාරයෝ (androidwedakarayo.com).
 * @param {number} limit - The maximum number of items to fetch (default: 10).
 * @returns {Promise<Object>} - The latest news items or an error message.
 */
const scrapeAndroidWadakarayo = async (limit = 10) => {
  try {
    const url = 'https://androidwedakarayo.com/';

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });

    const $ = cheerio.load(response.data);
    let results = [];

    $('article[data-v-2e1b0d2a]').each((index, element) => {
      if (index < limit) {
        const title = $('h2', element).text().trim();
        const link = $('a[data-v-2e1b0d2a]', element).attr('href');
        const thumbnail = $('img', element).attr('src');
        const excerpt = $('p.line-clamp-3', element).text().trim();

        // Get the category
        const category = $('a[href^="/tag/"]', element).first().text().trim();

        // Get published time and read time
        const publishedTime = $(element).find('span:contains("ago")').text().trim(); // Adjusted selector to find time
        const readTime = $(element).find('span:contains("min read")').text().trim(); // Adjusted selector to find read time

        results.push({
          Author: 'Vishwa Mihiranga',
          title,
          link: link.startsWith('http') ? link : `https://androidwedakarayo.com${link}`, // Ensure absolute URL
          thumbnail,
          excerpt,
          category,
          publishedTime,
          readTime
        });
      }
    });

    if (results.length === 0) {
      return {
        status: 'warning',
        message: 'No news items found. The page structure might have changed.',
        data: []
      };
    }

    return {
      status: 'success',
      data: results
    };

  } catch (error) {
    console.error('Scraping error:', error);
    return {
      status: 'error',
      Author: 'Vishwa Mihiranga',
      message: error.message || 'An error occurred while scraping the site.',
      details: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

const scrapeArticle = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });

    const $ = cheerio.load(response.data);

    // Scraping relevant data
    const title = $('h1').text().trim();

    // Article image extraction based on the updated HTML structure
    const articleImage = $('figure.post-image-fig img').attr('src');
    console.log('Article Image URL:', articleImage); // Log for debugging

    const writerName = $('#articleAuthor a span').text().trim();
    const content = $('.post-body').text().trim();
    const sourceLink = url;

    const writtenDate = $('.section ul li').first().text().trim();
    const readTime = $('.section ul li').last().text().trim();

    // Construct the full image URL if it exists
    const fullImageUrl = articleImage ? (articleImage.startsWith('http') ? articleImage : `https://backend.androidwedakarayo.com${articleImage}`) : null;

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: {
        title,
        content,
        source: sourceLink,
        writtenDate,
        articleImage: fullImageUrl, // Use the full image URL
        writerName,
        readTime
      }
    };
  } catch (error) {
    console.error('Error scraping article:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while scraping the article.'
    };
  }
};


// Export the scraping functions
module.exports = {
  scrapeAndroidWadakarayo,
  scrapeArticle
};
