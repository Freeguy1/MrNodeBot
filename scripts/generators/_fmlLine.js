// Get a Line(s) from FML
// INPUT:
//   count - The amount of lines to return
// OUTPUT:
//   an array of strings containing FML lines
const endPoint = 'http://www.fmylife.com/random';
const _ = require('lodash');
const xray = require('x-ray')();
module.exports = count => new Promise((resolve, reject) => xray(endPoint, 'span.facebook', ['@data-text'])((err, results) => {
    console.dir(results);
    // Error In request
    if (err) return reject(err);
    // No Results
    if (!_.isArray(results) || _.isEmpty(results)) return reject(new Error('No FML Results are available'));
    // Under-case

    const normalized = _.map(results, r => r.trim());
    resolve(_.sampleSize(normalized, count || 1));
}));


// #content > div > div.col-sm-8 > div > article:nth-child(2) > div > div > div.panel-content > p > a
// #content > div > div.col-sm-8 > div > article:nth-child(2) > div > div > div.panel-content > p > a
