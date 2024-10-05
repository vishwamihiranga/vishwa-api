const axios = require('axios');

/**
 * Searches for GitHub repositories based on a query.
 * @param {string} query - The search query.
 * @param {number} limit - The maximum number of repositories to fetch (default: 10).
 * @param {string} sort - The sorting criteria (default: 'stars').
 * @param {string} order - The order of results (default: 'desc').
 * @returns {Promise<Object>} - The search results or an error message.
 */
const searchGitHubRepos = async (query, limit = 10, sort = 'stars', order = 'desc') => {
  try {
    const url = 'https://api.github.com/search/repositories';

    const response = await axios.get(url, {
      params: {
        q: query,
        sort: sort,
        order: order,
        per_page: limit
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Repository-Search-API'
      },
      timeout: 10000 // 10 seconds timeout
    });

    const results = response.data.items.map(repo => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
        url: repo.owner.html_url
      },
      createdAt: repo.created_at,
      updatedAt: repo.updated_at
    }));

    if (results.length === 0) {
      return {
        status: 'warning',
        message: 'No repositories found matching the search criteria.',
        data: []
      };
    }

    return {
      status: 'success',
      data: results
    };

  } catch (error) {
    console.error('GitHub API search error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'An error occurred while searching GitHub repositories.',
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
 * Fetches detailed information about a specific GitHub repository.
 * @param {string} owner - The repository owner's username.
 * @param {string} repo - The repository name.
 * @returns {Promise<Object>} - Detailed repository information or an error message.
 */
const getRepoDetails = async (owner, repo) => {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Repository-Search-API'
      },
      timeout: 10000 // 10 seconds timeout
    });

    const repoData = response.data;

    return {
      status: 'success',
      data: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        language: repoData.language,
        owner: {
          login: repoData.owner.login,
          avatarUrl: repoData.owner.avatar_url,
          url: repoData.owner.html_url
        },
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        homepage: repoData.homepage,
        size: repoData.size,
        defaultBranch: repoData.default_branch,
        openIssues: repoData.open_issues_count,
        hasIssues: repoData.has_issues,
        hasProjects: repoData.has_projects,
        hasWiki: repoData.has_wiki,
        hasPages: repoData.has_pages,
        license: repoData.license ? {
          name: repoData.license.name,
          url: repoData.license.url
        } : null
      }
    };

  } catch (error) {
    console.error('GitHub API repo details error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'An error occurred while fetching repository details.',
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
 * Fetches detailed information about a GitHub user.
 * @param {string} username - The GitHub username.
 * @returns {Promise<Object>} - Detailed user information or an error message.
 */
const getUserDetails = async (username) => {
  try {
    const url = `https://api.github.com/users/${username}`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-User-Details-API'
      },
      timeout: 10000 // 10 seconds timeout
    });

    const userData = response.data;

    return {
      status: 'success',
      data: {
        login: userData.login,
        id: userData.id,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url,
        name: userData.name,
        company: userData.company,
        blog: userData.blog,
        location: userData.location,
        email: userData.email,
        bio: userData.bio,
        twitterUsername: userData.twitter_username,
        publicRepos: userData.public_repos,
        publicGists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      }
    };

  } catch (error) {
    console.error('GitHub API user details error:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'An error occurred while fetching user details.',
      details: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

module.exports = {
  searchGitHubRepos,
  getRepoDetails,
  getUserDetails
};
