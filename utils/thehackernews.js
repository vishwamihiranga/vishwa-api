const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

async function scrapeTheHackerNewsList(url = 'https://thehackernews.com/') {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const articles = [];

    $('.body-post').each((i, element) => {
      const $element = $(element);
      const imgSrc = $element.find('.home-img-src').attr('src');

      let imageUrl = null;
      let directImageUrl = null;

      if (imgSrc) {
        if (imgSrc.startsWith('data:image/svg+xml;base64,')) {
          // Handle data URI
          imageUrl = imgSrc;
          directImageUrl = imgSrc;
        } else {
          // Handle external URL
          imageUrl = imgSrc.replace('/w500/', '/s728-rw-e365/');
          directImageUrl = imgSrc.replace('/w500/', '/s0/');
        }
      }

      const article = {
        title: $element.find('.home-title').text().trim(),
        link: $element.find('.story-link').attr('href'),
        image: imageUrl,
        directImageLink: directImageUrl,
        date: $element.find('.h-datetime').text().trim(),
        author: $element.find('.h-datetime').next('.author').text().trim(),
        tags: $element.find('.h-tags').text().trim(),
        snippet: $element.find('.home-desc').text().trim()
      };

      articles.push(article);
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping article list: ${error}`);
    throw new Error(`Failed to fetch or parse the page: ${error.message}`);
  }
}
// Updated scrape TheHackerNews article function
async function scrapeTheHackerNewsArticle(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const article = {
      title: $('.story-title a').text().trim(),
      link: url,
      image: {
        src: $('.separator img').attr('src'),
        link: $('.separator a').attr('href'),
        alt: $('.separator img').attr('alt'),
        title: $('.separator img').attr('title')
      },
      content: $('.articlebody').text().trim(),
      date: $('.postmeta .author').first().text().trim(),
      author: $('.postmeta .author').last().text().trim(),
      tags: $('.p-tags').text().trim()
    };

    return article;
  } catch (error) {
    console.error(`Error scraping article: ${error}`);
    throw new Error(`Failed to fetch or parse the article: ${error.message}`);
  }
}
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.google.com/'
        }
      });
      return response.data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
}

async function scrapeWABetaInfoList(url = 'https://wabetainfo.com/') {
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);
    const articles = [];

    $('.card-wrapper').each((i, element) => {
      const $element = $(element);
      const article = {
        title: $element.find('.entry-title a').text().trim(),
        link: $element.find('.entry-title a').attr('href'),
        date: $element.find('.entry-date time').attr('datetime'),
        categories: $element.find('.entry-categories a').map((_, el) => $(el).text().trim()).get(),
        excerpt: $element.find('.entry-excerpt').text().trim(),
      };
      articles.push(article);
    });

    return articles;
  } catch (error) {
    console.error(`Error scraping WABetaInfo list: ${error}`);
    throw new Error(`Failed to fetch or parse the WABetaInfo page: ${error.message}`);
  }
}

async function scrapeWABetaInfoArticle(url) {
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Remove the unwanted elements before extracting the content
    $('.corners, .channel_card, .entry-content .wp-block-advertisement, .entry-content .adsbygoogle').remove();

    // Scraping the article content
    const article = {
      title: $('h1.entry-title').text().trim(),
      date: $('.entry-date time').attr('datetime'),
      categories: $('.entry-categories a').map((_, el) => $(el).text().trim()).get(),
      content: cleanContent($('.kenta-article-content').text().trim()),
      image: {
        src: $('#main-image').attr('src') || 'N/A',
        alt: $('#main-image').attr('alt') || 'No description',
        width: $('#main-image').attr('width') || 'N/A',
        height: $('#main-image').attr('height') || 'N/A',
      },
    };

    // Handling additional image inside a <p> tag if present
    const additionalImageElement = $('p img').first(); // Ensures it's the first image in a <p> tag
    const additionalImage = {
      src: additionalImageElement.attr('src') || 'N/A',
      alt: additionalImageElement.attr('alt') || 'No description',
      width: additionalImageElement.attr('width') || 'N/A',
      height: additionalImageElement.attr('height') || 'N/A',
    };

    // Attach additional image to article if it exists
    if (additionalImage.src !== 'N/A') {
      article.additionalImage = additionalImage;
    }

    return article;
  } catch (error) {
    console.error(`Error scraping WABetaInfo article: ${error}`);
    throw new Error(`Failed to fetch or parse the WABetaInfo article: ${error.message}`);
  }
}

// Helper function to clean up content (remove extra newlines, ads, etc.)
function cleanContent(content) {
  // Remove excessive line breaks and advertisements
  return content
    .replace(/ADVERTISEMENT/g, '') // Remove 'ADVERTISEMENT' text
    .replace(/\n\s*\n/g, '\n') // Remove multiple newlines
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim(); // Trim any extra spaces/newlines at the start and end
}

module.exports = {
  scrapeTheHackerNewsList,
  scrapeTheHackerNewsArticle,
  scrapeWABetaInfoList,
  scrapeWABetaInfoArticle
};
