const express = require('express');
const axios = require('axios');
const  youtubeSearcher  = require('../utils/ytsearch');
const checkApiKey = require('../middleware/checkApiKey');
const fetchAPOD = require('../utils/apod');
const { fetchRandomCocktail } = require('../utils/cocktail');
const getLocationInfo  = require('../utils/location');
const  fetchThreadData = require('../utils/threads');
const  fetchTikTokData  = require('../utils/tiktok');
const  fetchSportyNews  = require('../utils/sport');
const  fetchDeraNews  = require('../utils/derananews');
const  fetchIOSNews  = require('../utils/iosnews');
const  fetchApkDetails  = require('../utils/apk'); // Importing the APK info utility
const  fetchDeliriusData = require('../utils/hirunews'); // Hiru News Utility
const yts = require('yt-search');
const ytdl = require('ytdl-core');

const router = express.Router();

//==========================================================================
router.get('/alert', checkApiKey, async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: 'error', message: 'Text parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.popcat.xyz/alert?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: {
        image: `data:${response.headers['content-type']};base64,${base64Image}`
      }
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
router.get('/spotify', checkApiKey, async (req, res) => {
  const { q, limit } = req.query;

  // Validate query parameter
  if (!q) {
    return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
  }

  // Set default limit if not provided
  const resultsLimit = limit ? parseInt(limit, 10) : 20;

  try {
    const response = await axios.get(`https://deliriusapi-official.vercel.app/search/spotify?q=${encodeURIComponent(q)}&limit=${resultsLimit}`);

    // Remove the "creator" field if it exists in the response
    if (response.data.creator) {
      delete response.data.creator;
    }

    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/tiktoksearch', checkApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`https://deliriusapi-official.vercel.app/search/tiktoksearch?query=${encodeURIComponent(query)}`);

    // Remove the "creator" field if it exists
    if (response.data.creator) {
      delete response.data.creator;
    }

    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data // The "creator" field is now removed
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/lyrics', checkApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(`https://deliriusapi-official.vercel.app/search/lyrics?url=${encodeURIComponent(url)}&parse=false`);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/genius', checkApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`https://deliriusapi-official.vercel.app/search/genius?q=${encodeURIComponent(query)}`);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/encode', checkApiKey, async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: 'error', message: 'Text parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.popcat.xyz/encode?text=${encodeURIComponent(text)}`);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=======================================================

const generateAndUploadQRCode = require('../utils/qr'); // Import the QR code generator function

router.get('/generate-qrcode', async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: 'error', message: 'Text parameter is required' });
  }

  try {
    const result = await generateAndUploadQRCode(text);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data, // QR code as a data URL
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=======================================================
const { scrapeCineSubzMovieInfo } = require('../utils/cineScrape'); // Import the scraper function

// API route for scraping movie information from CineSubz
router.get('/scrape-cinesubz', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL parameter is required' });
  }

  try {
    const result = await scrapeCineSubzMovieInfo(url);
    return res.json({
      status: 'success',
      author: 'Vishwa Mihiranga',
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
router.get('/cinesearch', async (req, res) => {
  const { q } = req.query;
  const apiKey = '6467ad0b29';
  const baseUrl = 'https://prabath-md-api.up.railway.app/api/cinesearch';

  if (!q) {
    return res.status(400).json({ status: 'error', message: 'Query parameter "q" is required' });
  }

  try {
    // Make request to the external API
    const apiResponse = await axios.get(`${baseUrl}?q=${q}&apikey=${apiKey}`);
    const { data } = apiResponse;

    // Remove the "Created_by" field from the response
    if (data && data.Created_by) {
      delete data.Created_by;
    }

    // Send the modified response back
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=======================================================
const generateCanvasImage = require('../utils/attp');
router.get('/attp', async (req, res) => {
  const { text, color } = req.query;

  if (!text || !color) {
    return res.status(400).json({ status: 'error', message: 'Text and color parameters are required' });
  }

  try {
    const result = await generateCanvasImage(text, color);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data, // Assuming it contains the URL of the canvas image
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//======================================================

//=====================================================
const fetchZipcodeInfo = require('../utils/zipcode');
router.get('/zipcode', checkApiKey, async (req, res) => {
  const { zip } = req.query;

  if (!zip) {
    return res.status(400).json({ status: 'error', message: 'ZIP code parameter is required' });
  }

  try {
    const result = await fetchZipcodeInfo(zip, '0f94a5f0-6ea4-11ef-81da-579be4fb031c'); // Your Zipcodebase API key
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//===================================================

//=====================================================
const fetchIPInfo = require('../utils/ipinfo');
router.get('/iplookup', checkApiKey, async (req, res) => {
  const { ip } = req.query;

  if (!ip) {
    return res.status(400).json({ status: 'error', message: 'IP address parameter is required' });
  }

  try {
    const result = await fetchIPInfo(ip); // Call the fetchIPInfo function
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=====================================================
const fetchNationalityPrediction = require('../utils/nationalize'); // Adjust the path as necessary

router.get('/nationality', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ status: 'error', message: 'Name parameter is required' });
  }

  try {
    const result = await fetchNationalityPrediction(name);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data, // Nationality prediction details
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//=====================================================

const fetchGenderPrediction = require('../utils/gender'); // Adjust the path as necessary

router.get('/gender', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ status: 'error', message: 'Name parameter is required' });
  }

  try {
    const result = await fetchGenderPrediction(name);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result.data, // Gender prediction details
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=====================================================
const { performDNSLookup } = require('../utils/dns');
router.get('/dnslookup', checkApiKey, async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ status: 'error', message: 'Domain parameter is required' });
  }

  try {
    const result = await performDNSLookup(domain); // Call the performDNSLookup function
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//======================================================
const { checkPasswordStrength } = require('../utils/checkpw');
router.get('/checkpass', checkApiKey, async (req, res) => {
  const { password } = req.query;

  if (!password) {
    return res.status(400).json({ status: 'error', message: 'Password parameter is required' });
  }

  try {
    const result = checkPasswordStrength(password); // Call the checkPasswordStrength function
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: result
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
router.get('/decode', checkApiKey, async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ status: 'error', message: 'Text parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.popcat.xyz/decode?text=${encodeURIComponent(text)}`);
    return res.json({
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: response.data
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// YouTube Search Route
router.get('/youtube', checkApiKey, async (req, res) => {
  const { q, apikey } = req.query;

  if (!q || !apikey) {
    return res.status(400).json({ status: 'error', message: 'Search query and apikey parameters are required' });
  }

  try {
    const searchResults = await yts(q);
    const videos = await Promise.all(searchResults.videos.slice(0, 10).map(async (video) => {
      const info = await ytdl.getInfo(video.url);
      const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
      const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });

      return {
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail,
        duration: {
          seconds: video.seconds,
          formatted: video.timestamp
        },
        ago: video.ago,
        views: video.views,
        author: {
          name: video.author.name,
          url: video.author.url
        },
        description: video.description,
        audioDlUrl: audioFormat.url,
        videoDlUrl: videoFormat.url
      };
    }));

    return res.json({
      status: 'success',
      Author: 'Claude',
      data: videos
    });
  } catch (error) {
    console.error("Error in YouTube search:", error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
router.get('/youtube/search', checkApiKey, async (req, res) => {
  const { q, apikey } = req.query;

  if (!q || !apikey) {
    return res.status(400).json({ status: 'error', message: 'Search query and apikey parameters are required' });
  }

  try {
    const searchResults = await youtubeSearcher(q, apikey);
    return res.json(searchResults);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

const { scrapeAndroidWadakarayo, scrapeArticle } = require('../utils/android');

// Route for Android වැඩකාරයෝ scraping
router.get('/androidwadakarayo', async (req, res) => {
  const { limit } = req.query;
  try {
    const results = await scrapeAndroidWadakarayo(limit ? parseInt(limit) : 10);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/article-info', async (req, res) => {
  const { url } = req.query; // Get the article URL from query parameters
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL parameter is required.' });
  }

  try {
    const results = await scrapeArticle(url);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=======================================================

const { sscrapeSearchResults, sscrapeMovieInfo,scrapeDownloadLink } = require('../utils/sinhalasub');

router.get('/sdownload-link', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL query parameter is required' });
  }
  try {
    const downloadLinkInfo = await scrapeDownloadLink(url);
    return res.json(downloadLinkInfo);
  } catch (error) {
    console.error('Error in /sdownload-link route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
// Route for movie search
router.get('/smovie-search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }
  try {
    const searchResults = await sscrapeSearchResults(query);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /movie-search route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for getting movie details
router.get('/smovie-details', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Movie URL parameter is required' });
  }
  try {
    const movieDetails = await sscrapeMovieInfo(url);
    return res.json(movieDetails);
  } catch (error) {
    console.error('Error in /movie-details route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//===================================================

const { sirasascrapeSinhalaNewsfirst, sirasascrapeArticle,sirasalatestnewslist,fetchMultiplePages } = require('../utils/sirasanews');

router.get('/sirasa-latest-list-news', async (req, res) => {
  const { limit = 10, page = 1, multipage = false } = req.query;

  try {
    let searchResults;

    if (multipage === 'true') {
      // Fetch multiple pages
      searchResults = await fetchMultiplePages(parseInt(limit), parseInt(page));
    } else {
      // Fetch single page
      searchResults = await sirasalatestnewslist(parseInt(limit), parseInt(page));
    }

    // Handle different status responses
    switch (searchResults.status) {
      case 'success':
        return res.json({
          status: 'success',
          data: searchResults.data,
          totalItems: searchResults.data.length,
          currentPage: searchResults.currentPage,
          hasNextPage: searchResults.hasNextPage
        });
      case 'warning':
        return res.status(404).json({
          status: 'warning',
          message: searchResults.message,
          data: [],
          totalItems: 0
        });
      case 'error':
        return res.status(500).json({
          status: 'error',
          message: searchResults.message,
          details: searchResults.details
        });
      default:
        return res.status(500).json({
          status: 'error',
          message: 'An unexpected error occurred',
          data: [],
          totalItems: 0
        });
    }
  } catch (error) {
    console.error('Error in /sirasa-latest-news route:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error.message,
      data: [],
      totalItems: 0
    });
  }
});

// Route for latest news
router.get('/sirasa-latest-news', async (req, res) => {
  const { limit } = req.query;
  try {
    const searchResults = await sirasascrapeSinhalaNewsfirst(limit);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /latest-news route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for getting article details
router.get('/sirasa-article-details', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Article URL parameter is required' });
  }
  try {
    const articleDetails = await sirasascrapeArticle(url);
    return res.json(articleDetails);
  } catch (error) {
    console.error('Error in /article-details route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});


//=====================================================

const { pscrapeSearchResults, pscrapeMovieInfo } = require('../utils/pirate');

// Route for movie search
router.get('/movie-search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }
  try {
    const searchResults = await pscrapeSearchResults(query);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /movie-search route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for getting movie details
router.get('/movie-details', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Movie URL parameter is required' });
  }
  try {
    const movieDetails = await pscrapeMovieInfo(url);
    return res.json(movieDetails);
  } catch (error) {
    console.error('Error in /movie-details route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//=====================================================


//======================================================
const { scrapeBaiscopeSearchResults, scrapeBaiscopeMovieInfo } = require('../utils/baiscope-scraper');

// Route for movie search
router.get('/baiscope-search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }
  try {
    const searchResults = await scrapeBaiscopeSearchResults(query);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /baiscope-search route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for getting movie details
router.get('/baiscope-movie-details', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ status: 'error', message: 'Movie URL parameter is required' });
  }
  try {
    const movieDetails = await scrapeBaiscopeMovieInfo(url);
    return res.json(movieDetails);
  } catch (error) {
    console.error('Error in /baiscope-movie-details route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//=======================================================
const { searchNpmPackages, getPackageDetails} = require('../utils/npm');


// Route for npm package search
router.get('/npm-search', async (req, res) => {
  const { query, limit } = req.query;
  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }
  try {
    const searchResults = await searchNpmPackages(query, limit);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /npm-search route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for fetching npm package details
router.get('/npm-package-info', async (req, res) => {
  const { packageName } = req.query;
  if (!packageName) {
    return res.status(400).json({ status: 'error', message: 'Package name query parameter is required' });
  }
  try {
    const packageInfo = await getPackageDetails(packageName);
    return res.json(packageInfo);
  } catch (error) {
    console.error('Error in /npm-package-info route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//=======================================================
const { searchGitHubRepos, getRepoDetails, getUserDetails } = require('../utils/github');

// Example usage in an Express route
router.get('/github-user-info', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ status: 'error', message: 'Username query parameter is required' });
  }
  try {
    const userInfo = await getUserDetails(username);
    return res.json(userInfo);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for GitHub repository search
router.get('/github-search', async (req, res) => {
  const { query, limit, sort, order } = req.query;
  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }
  try {
    const searchResults = await searchGitHubRepos(query, limit, sort, order);
    return res.json(searchResults);
  } catch (error) {
    console.error('Error in /github-search route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for fetching GitHub repository details
router.get('/github-repo-info', async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) {
    return res.status(400).json({ status: 'error', message: 'Both owner and repo query parameters are required' });
  }
  try {
    const repoInfo = await getRepoDetails(owner, repo);
    return res.json(repoInfo);
  } catch (error) {
    console.error('Error in /github-repo-info route:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//==========================================================================
const { scrapeSearchResults ,scrapeVideoInfo } = require('../utils/ginisisila'); 
// Route for Ginisisila scraping
router.get('/ginisisila', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }

  try {
    const searchResults = await scrapeSearchResults(search);
    return res.json(searchResults);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/ginisisila-video-info', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL query parameter is required' });
  }

  try {
    const videoInfo = await scrapeVideoInfo(url);
    return res.json(videoInfo);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//==========================================================================
const  fetchGameDetails  = require('../utils/steam'); 
router.get('/steam', checkApiKey, async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }

  try {
    const ga = await fetchGameDetails(search);
    return res.json(ga);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
const  fetchMovies  = require('../utils/ytsmx'); 
router.get('/ytsmx', checkApiKey, async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ status: 'error', message: 'Search query parameter is required' });
  }

  try {
    const movies = await fetchMovies(search); // Call fetchMovies with the search query
    return res.json({ status: 'success', data: movies }); // Wrap response in a status object for consistency
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
const Bing = require('../utils/bingSearch');
router.get('/bing', checkApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
  }

  try {
    const bingResults = await Bing(query); // Call Bing with the query parameter
    return res.json({ status: 'success', data: bingResults }); // Wrap response in a status object for consistency
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// APK Info Route
router.get('/apk', checkApiKey, async (req, res) => {
  const { apkName } = req.query;

  if (!apkName) {
    return res.status(400).json({ status: 'error', message: 'APK name parameter is required' });
  }

  try {
    const apkInfo = await fetchApkDetails(apkName);
    return res.json(apkInfo);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// NASA Astronomy Picture of the Day (APOD) Route
router.get('/apod', checkApiKey, async (req, res) => {
  const { apikey } = req.query;

  if (!apikey) {
    return res.status(400).json({ status: 'error', message: 'API key parameter is required' });
  }

  try {
    const apodData = await fetchAPOD(apikey); // Call fetchAPOD with the provided API key
    return res.json(apodData); // Send back the APOD data
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
//==========================================================================
// Random Cocktail Route
router.get('/cocktailrandom', checkApiKey, async (req, res) => {
  try {
    const cocktailData = await fetchRandomCocktail(); // Call the function
    return res.json(cocktailData);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// Location Info Route
router.get('/location/:ipAddress', checkApiKey, async (req, res) => {
  const { ipAddress } = req.params;

  try {
    const locationData = await getLocationInfo(ipAddress);
    return res.json(locationData);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// Thread Data Route
router.get('/thread', checkApiKey, async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'URL parameter is required' });
  }

  try {
    const threadData = await fetchThreadData(url);
    return res.json(threadData);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// TikTok Data Route
router.get('/tiktok', checkApiKey, async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ status: 'error', message: 'Username parameter is required' });
  }

  try {
    const tiktokData = await fetchTikTokData(username);
    return res.json(tiktokData);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
const fetchCurrentMatches = require('../utils/cric'); 
router.get('/cric', checkApiKey, async (req, res) => {
  try {
    const currentMatches = await fetchCurrentMatches();
    return res.json(currentMatches); // Respond with the current matches
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message }); // Error handling
  }
});

//==========================================================================
// Hiru News Route
router.get('/chatgpt', checkApiKey, async (req, res) => {
  try {
    const newsData = await fetchDeliriusData();
    return res.json(newsData);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// Sports News Route
router.get('/sportynews', checkApiKey, async (req, res) => {
  try {
    const sportyNews = await fetchSportyNews();
    return res.json(sportyNews);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
// iOS News Route
router.get('/iosnews', checkApiKey, async (req, res) => {
  try {
    const iosNews = await fetchIOSNews();
    return res.json(iosNews);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
const { fetchHiruNews } = require('../utils/hiru');
// Route to fetch main news
router.get('/hirunew', checkApiKey, async (req, res) => {
  try {
    const mainNews = await fetchHiruNews(); // Call the function
    return res.json(mainNews);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

const { fetchEsanaNews } = require('../utils/esana');
router.get('/esana', checkApiKey, async (req, res) => {
  try {
    const esanaNews = await fetchEsanaNews(); // Call the function
    return res.json(esanaNews);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

//==========================================================================
const fetchISSLocation = require('../utils/iss');
router.get('/iss', checkApiKey, async (req, res) => {
  try {
    const issLocation = await fetchISSLocation();
    return res.json(issLocation);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});


// Export the router
module.exports = router;
