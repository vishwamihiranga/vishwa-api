// utils.js
const dns = require('dns');

/**
 * Performs a DNS lookup on a given domain.
 * @param {string} domain - The domain to lookup.
 * @returns {Promise<Object>} - The result of the DNS lookup or an error message.
 */
const performDNSLookup = async (domain) => {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address) => {
      if (err) {
        return reject({
          status: 'error',
          message: `DNS Lookup failed: ${err.message}`,
        });
      }
      resolve({
        status: 'success',
        data: {
          domain,
          address,
        },
      });
    });
  });
};

// Export the function
module.exports = {
  performDNSLookup,
};
