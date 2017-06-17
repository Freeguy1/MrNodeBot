'use strict';

const scriptInfo = {
    name: 'Sentiment Line',
    desc: 'Get a random sentiment',
    createdBy: 'IronY'
};

const _ = require('lodash');
const Models = require('bookshelf-model-loader');
const logger = require('../../lib/logger');
const typo = require('../lib/_ircTypography');

module.exports = async (app) => {
    // Database not available
    if (!Models.Upvote) return scriptInfo;

    // random-sentiment command
    app.Commands.set('random-sentiment', {
        desc: 'Get a random sentiment',
        access: app.Config.accessLevels.identified,
        call: async (to, from, text, message) => {


            const result = await Models.Upvote.query(
                qb => qb.select('candidate', 'voter','text','result','channel').where('channel', to).orderByRaw('rand()').limit(1)
            ).fetch();

            if(!result) {
                app.say(to,`It seems there is no sentiments for ${to}, ${from}`);
                return;
            }

            const disposition = result.attributes.result === 1 ? '{likes|adores}' : '{dislikes|hates}';
            let output = `${result.attributes.voter} ${disposition} ${result.attributes.candidate}`;
            if(result.attributes.text) output = `${output} ${result.attributes.text}`;
            app.say(to, output);
        }
    });

};