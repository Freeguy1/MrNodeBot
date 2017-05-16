'use strict';
const _ = require('lodash');
const logger = require('../../lib/logger');

module.exports = async (results) => {
    try {
        const short = require('../lib/_getShortService')(results.uri.domain());
        let shortUrl = await short(results.url);
        Object.assign(results, {shortUrl: shortUrl});
        return results;
    } catch (err) {
        logger.warn('Error in URL Shortner function', {
            message: err.message || '',
            stack: err.stack || ''
        });
        return results;
    }
};
