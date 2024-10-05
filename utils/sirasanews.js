const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes latest news from sinhala.newsfirst.lk.
 * @param {number} limit - The maximum number of items to fetch (default: 10).
 * @returns {Promise<Object>} - The latest news items or an error message.
 */

const sirasalatestnewslist = async (limit = 10, page = 1) => {
  try {
    const baseUrl = 'https://sinhala.newsfirst.lk';
    const url = `${baseUrl}/latest-news?page=${page}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });
    const $ = cheerio.load(response.data);
    let results = [];

    $('.local_news_main .ng-star-inserted').each((index, element) => {
      if (results.length < limit) {
        const title = $('h2.local_news_sub_header, h4.top_stories_sub_header', element).text().trim();
        const link = $('a', element).attr('href');
        const thumbnail = $('img', element).attr('src');
        const excerpt = $('.top_stories_sub_detail', element).text().trim();
        const date = $('.time_date', element).text().trim();

        if (title && link) {
          results.push({
            title,
            link: link.startsWith('http') ? link : `${baseUrl}${link}`,
            thumbnail,
            excerpt,
            date
          });
        }
      }
    });

    const hasNextPage = $('.pagination-next').length > 0;

    if (results.length === 0) {
      return {
        status: 'warning',
        message: 'No news items found. The page structure might have changed.',
        data: [],
        hasNextPage: false,
        currentPage: page
      };
    }

    return {
      status: 'success',
      data: results,
      hasNextPage,
      currentPage: page
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while scraping the site.',
      data: [],
      details: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

const fetchMultiplePages = async (totalLimit = 20, startPage = 1) => {
  let allResults = [];
  let currentPage = startPage;
  let hasNextPage = true;
  const seenTitles = new Set();

  while (allResults.length < totalLimit && hasNextPage) {
    try {
      const result = await sirasalatestnewslist(totalLimit - allResults.length, currentPage);

      if (result.status === 'success') {
        // Filter out duplicates and add new items
        const newItems = result.data.filter(item => {
          if (!seenTitles.has(item.title)) {
            seenTitles.add(item.title);
            return true;
          }
          return false;
        });

        allResults = allResults.concat(newItems);
        hasNextPage = result.hasNextPage;
        currentPage++;
      } else if (result.status === 'warning') {
        console.warn(`Warning on page ${currentPage}:`, result.message);
        break;
      } else {
        console.error(`Error on page ${currentPage}:`, result.message);
        break;
      }

      // Break if no new items were added (to prevent infinite loop)
      if (newItems.length === 0) {
        break;
      }
    } catch (error) {
      console.error(`Unexpected error on page ${currentPage}:`, error.message);
      break;
    }
  }

  return {
    status: allResults.length > 0 ? 'success' : 'warning',
    data: allResults,
    totalItems: allResults.length,
    message: allResults.length > 0 ? null : 'No news items found across multiple pages.',
    lastPage: currentPage - 1
  };
};

const sirasascrapeSinhalaNewsfirst = async (limit = 10) => {
  try {
    const url = 'https://sinhala.newsfirst.lk/latest-news';

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });

    const $ = cheerio.load(response.data);
    let results = [];

    $('.border-right-local').each((index, element) => {
      if (index < limit) {
        const title = $('h1.top_stories_header', element).text().trim();
        const link = $('a', element).attr('href');
        const thumbnail = $('img', element).attr('src');
        const excerpt = $('p.top_stories_details', element).text().trim();

        results.push({
          title,
          link: link.startsWith('http') ? link : `https://sinhala.newsfirst.lk${link}`,
          thumbnail,
          excerpt
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

const sirasascrapeArticle = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000 // 30 seconds timeout
    });

    const $ = cheerio.load(response.data);

    // Scraping relevant data
    const title = $('h1.top_stories_header_news').text().trim();
    const articleImage = $('.padding img').first().attr('src');
    const content = $('.new_details').text().trim();
    const sourceLink = url;
    const publishedDate = $('.author_main').text().trim();

    return {
      status: 'success',
      data: {
        title,
        content,
        source: sourceLink,
        publishedDate,
        articleImage
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
  sirasascrapeSinhalaNewsfirst,
  sirasascrapeArticle,
  sirasalatestnewslist,
  fetchMultiplePages
};