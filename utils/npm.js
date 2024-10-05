const axios = require('axios');

/**
 * Searches for npm packages based on a query.
 * @param {string} query - The search query.
 * @param {number} limit - The maximum number of packages to fetch (default: 10).
 * @returns {Promise<Object>} - The search results or an error message.
 */
const searchNpmPackages = async (query, limit = 10) => {
  try {
    const url = `https://registry.npmjs.org/-/v1/search`;

    const response = await axios.get(url, {
      params: {
        text: query,
        size: limit
      },
      timeout: 10000 // 10 seconds timeout
    });

    const results = response.data.objects.map(pkg => ({
      name: pkg.package.name,
      version: pkg.package.version,
      description: pkg.package.description,
      author: pkg.package.author ? pkg.package.author.name : 'Unknown',
      publisher: pkg.package.publisher ? pkg.package.publisher.username : 'Unknown',
      date: pkg.package.date,
      links: pkg.package.links,
      score: pkg.score
    }));

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: results
    };

  } catch (error) {
    console.error('npm API search error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'An error occurred while searching npm packages.',
      details: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

/**
 * Fetches detailed information about a specific npm package.
 * @param {string} packageName - The name of the npm package.
 * @returns {Promise<Object>} - Detailed package information or an error message.
 */
const getPackageDetails = async (packageName) => {
  try {
    const url = `https://registry.npmjs.org/${packageName}`;

    const response = await axios.get(url, {
      timeout: 10000 // 10 seconds timeout
    });

    const pkgData = response.data;
    const latestVersion = pkgData['dist-tags'].latest;
    const latestVersionData = pkgData.versions[latestVersion];

    return {
      status: 'success',
      Author: 'Vishwa Mihiranga',
      data: {
        name: pkgData.name,
        version: latestVersion,
        description: pkgData.description,
        author: latestVersionData.author ? latestVersionData.author.name : 'Unknown',
        maintainers: pkgData.maintainers,
        homepage: latestVersionData.homepage,
        repository: latestVersionData.repository,
        license: latestVersionData.license,
        keywords: latestVersionData.keywords,
        dependencies: latestVersionData.dependencies,
        devDependencies: latestVersionData.devDependencies,
        downloadCount: 'N/A', // npm doesn't provide this directly in package metadata
        lastPublished: pkgData.time[latestVersion],
        readme: pkgData.readme
      }
    };

  } catch (error) {
    console.error('npm API package details error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'An error occurred while fetching package details.',
      details: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

/**
 * Fetches information about an npm user.
 * @param {string} username - The npm username.
 * @returns {Promise<Object>} - User information or an error message.
 */
module.exports = {
  searchNpmPackages,
  getPackageDetails
};
