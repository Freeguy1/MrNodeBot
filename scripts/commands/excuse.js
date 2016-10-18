'use strict';
const scriptInfo = {
    name: 'excuse',
    file: 'excuse.js',
    desc: 'Provider Bastard Operator from hell excuses',
    createdBy: 'Dave Richer'
};

const excuse = require('../../helpers').Excuse;
const _ = require('lodash');

module.exports = app => {
    // Random BOFH Excuse
    app.Commands.set('excuse', {
        desc: '[Channel?] Send a BOFH excuse',
        access: app.Config.accessLevels.identified,
        call: (to, from, text, message) => {
            let chan = _.first(text.split(' '));
            app.say(chan || to, excuse());
        }
    });

    // Return the script info
    return scriptInfo;
};