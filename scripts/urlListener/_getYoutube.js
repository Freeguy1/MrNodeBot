'use strict';

const _ = require('lodash');
const gen = require('../generators/_youTubeVideoData');
const apiKey = require('../../config').apiKeys.google;
const logger = require('../../lib/logger');

module.exports = (key, list, index, seekTime, results) => new Promise(resolve => {
    // No Key provided, return the results
    if (
        (!_.isString(key) || _.isEmpty(key)) &&
        (!_.isString(list) || _.isEmpty(list))
    ) return resolve(results);

    // Normalize Helper
    const numberOrZero = number => !isNaN(number) ? number : 0;

    return gen(apiKey, key, list)
        .then(result => {
            // We have no data, default back to the original title grabber
            if (!result) return resolve(results);
            // Initialize youtube results
            results.youTube = {};

            // Current Video Index
            if (!isNaN(index)) results.youTube.index = index;
            // Video Seek Time
            if (!isNaN(seekTime)) results.youTube.seekTime = seekTime;

            // We have Video Results
            if (!_.isEmpty(result.videoResults)) {
                // Hold on to the first element, which should be our selection since we are searching by key
                const videoResults = result.videoResults[0];

                results.youTube.video = {
                    key: key,
                    videoTitle: videoResults.snippet.title || '',
                    viewCount: numberOrZero(videoResults.statistics.viewCount),
                    likeCount: numberOrZero(videoResults.statistics.likeCount),
                    dislikeCount: numberOrZero(videoResults.statistics.dislikeCount),
                    commentCount: numberOrZero(videoResults.statistics.commentCount),
                    channelTitle: videoResults.snippet.channelTitle || '',
                    restrictions: _.isObject(videoResults.contentDetails.regionRestriction),
                    embeddable: _.isObject(videoResults.status) && videoResults.status.embeddable
                };
            }

            // We have Playlist Results
            if (!_.isEmpty(result.playlistResults)) {
                // Hold on to the first playlist, the result should be expected as we are searching by key
                const playlistResults = result.playlistResults[0];

                results.youTube.playlist = {
                    key: list,
                    videoCount: numberOrZero(playlistResults.contentDetails.itemCount),
                    playlistTitle: playlistResults.snippet.title || '',
                };

            }

            // Return results
            resolve(results);
        })
        .catch(err => {
            logger.warn('Error in YouTube link function', {
                err: err.stack,
            });
            resolve(results);
        });

});
