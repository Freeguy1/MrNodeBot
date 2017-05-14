'use strict';

const rp = require('request-promise-native');
const logger = require('../../lib/logger');

const endPoint = 'https://freegeoip.net/json/';
// Return GEO IP Data in the following format
//     {
//     ip: '',
//     country_code: '',
//     country_name: '',
//     region_code: '',
//     region_name: '',
//     city: '',
//     zip_code: '',
//     time_zone: '',
//     latitude: 0,
//     longitude: 0,
//     metro_code: 0
//   }
//
// If the host is invalid, and the request fails, a empty object will be returned

module.exports = async(host) => {
  let results = Object.assign({});
  
  if (!host)
    throw new Error('No host was provided.');

  try {
    const request = await rp({
      uri: `${endPoint}${host}`,
      json: true
    });

    Object.assign(results, request);
  }
  // Catch Errors
  catch (err) {
    logger.error('Error in the _ipLocationData generator', {
      message: err.message || '',
      stack: err.stack || ''
    });
  }
  // Return results
  finally {
    return results;
  }
};
