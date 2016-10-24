'use strict';

const _ = require('lodash');
// If we have a debug flag set, load in the node-irc lib sitting beside the MrNodeBot folder
const config = require('../config');
const irc = config.ircClientDebug ? require('../../node-irc') : require('irc');

// Create the client, disable the autoconnect feature if for some reason it gets passed in
config.irc.autoConnect = false
const client = new irc.Client(config.irc.server, config.irc.nick, config.irc);

// Check to see if client is currently on a channel
client.isInChannel = function(channel, nick) {
    // Bail if we have no channel
    if (!channel) return false;
    // Normalize chanel
    channel = channel.toLowerCase();
    // Make sure we have a nick, and normalize
    nick = nick && _.isString(nick) ? nick.toLowerCase() : this.nick.toLowerCase();
    // Lower case the keys
    let chans = _(this.chans).mapKeys((v, k) => k.toLowerCase()).value();
    // Check if key exists
    if (!chans.hasOwnProperty(channel)) return false;
    // Lowercase the user, and check if user exists
    return (_(chans[channel]['users']).mapKeys((value, key) => key.toLowerCase()).value()).hasOwnProperty(nick);
};

// Check if the channel is topic locked
client.isTopicLocked = function(channel) {
    return (!this.isInChannel(channel) || !this.chans[channel].hasOwnProperty('mode')) ? false : this.chans[channel]['mode'].indexOf('t') > -1;
};

// Create the Bot object
module.exports = client;