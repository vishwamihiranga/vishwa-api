const axios = require('axios');

/**
 * Fetches movie details from the YTS API using the Delirius API.
 * @param {string} search - The movie search query.
 * @returns {Promise<Object[]>} - An array of movie details.
 */
async function fetchMovies(search) {
  const searchUrl = `https://deliriusapi-official.vercel.app/search/movieyts?search=${encodeURIComponent(search)}`;

  try {
    const { data } = await axios.get(searchUrl);

    // Check if the data contains movies and is in the expected format
    if (data && Array.isArray(data.movies)) {
      return data.movies.map(movie => ({
        Author: 'Vishwa Mihiranga',
        id: movie.id,
        title: movie.title || 'No title available',
        year: movie.year || 'N/A',
        rating: movie.rating || 'N/A',
        genres: movie.genres || [],
        summary: movie.summary || 'No summary available',
        url: movie.url || 'No URL available',
        smallCoverImage: movie.small_cover_image || 'No image available',
        mediumCoverImage: movie.medium_cover_image || 'No image available',
        largeCoverImage: movie.large_cover_image || 'No image available',
        trailer: movie.yt_trailer_code ? `https://www.youtube.com/watch?v=${movie.yt_trailer_code}` : 'No trailer available',
        torrents: movie.torrents || [] // Include torrents if available
      })).filter(movie => movie.title && movie.url);
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return [];
  }
}

module.exports = fetchMovies; // Correctly exporting the function
