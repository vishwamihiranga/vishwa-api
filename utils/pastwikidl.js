const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes textbook information from a pastpapers.wiki download page
 * @param {string} url - The URL of the download page
 * @returns {Promise<Object>} - The textbook information or an error message
 */
const scrapePastPapersWikiDL = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
    });

    const $ = cheerio.load(response.data);

    const textbookInfo = {
      title: $('h1.jeg_post_title').text().trim(),
      subtitle: $('h3').text().trim(),
      image: {
        src: $('.thumbnail-container img').attr('src'),
        alt: $('.thumbnail-container img').attr('alt'),
      },
      date: $('.jeg_meta_date a').text().trim(),
      categories: $('.jeg_meta_category a').map((_, el) => $(el).text().trim()).get(),
      comments: $('.jeg_meta_comment a').text().trim(),
      downloadButton: {
        text: $('span:contains("Download School Textbook")').text().trim(),
        icon: $('span:contains("Download School Textbook") i').attr('class'),
      },
      content: $('.content-inner p').map((_, el) => $(el).text().trim()).get(),
      downloadLinks: $('.content-inner a[href$=".pdf"]').map((_, el) => ({
        text: $(el).text().trim(),
        href: $(el).attr('href'),
      })).get(),
    };

    return {
      status: 'success',
      data: textbookInfo,
    };
  } catch (error) {
    console.error('Scraping error:', error);

    return {
      status: 'error',
      message: 'Error occurred while scraping the download page.',
      details: error.message,
    };
  }
};

module.exports = { scrapePastPapersWikiDL };
