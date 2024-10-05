const axios = require('axios'); // Use require for CommonJS

/**
 * Fetches a random cocktail from the Cocktail DB API.
 * @returns {Promise<Object>} - The random cocktail data or an error message.
 */
const fetchRandomCocktail = async () => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');

    if (response.data && response.data.drinks) {
      return {
        status: 'success',
        Author: 'Vishwa Mihiranga',
        cocktail: response.data.drinks[0] // Return the first cocktail
      };
    } else {
      throw new Error('No cocktail found in the response.');
    }
  } catch (error) {
    throw new Error(`Error fetching random cocktail: ${error.message}`);
  }
};

// Export the fetchRandomCocktail function
module.exports = {
  fetchRandomCocktail,
};
