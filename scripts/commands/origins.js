const scriptInfo = {
    name: 'origins',
    desc: 'Show the Bots current up-time and other statistics',
    createdBy: 'IronY',
};
const helpers = require('../../helpers');

// Provide users with a brief origins story
// Commands: origins
module.exports = (app) => {
    app.Commands.set('origins', {
        desc: 'My origin story',
        access: app.Config.accessLevels.guest,
        call: (to, from, text, message) => {
            // Grab current up-time in hours
            const procUptime = process.uptime() / 60 / 60;

            // Get procText For it
            const procText = () => {
                if (procUptime < 1) return 'of an hour';
                if (procUptime === 1) return 'hour';
                if (procUptime > 1) return 'hours';
            };

            // Build String
            const additionalAdmins = app.Admins.length > 1 ?
                ` but I also listen to ${app.Admins.length - 1} ${helpers.Plural('other', app.Admins.length)}.` : '.';
            const ignoreList = app.Ignore.length ?
                `I also ignore ${app.Ignore.length} ${helpers.Plural('moron', app.Ignore.length)}, but that is a different story.` : '';
            const uptimeText = `${procUptime.toFixed(2)} ${procText()}`;

            // Final output
            const out = `I am ${app._ircClient.nick}, I am currently running at version ${app.Config.project.version}. ` +
                `${app.Config.owner.nick} is my master${additionalAdmins} ` +
                `${ignoreList} My body is ${process.arch}, but my mind is ${process.platform}. This iteration of myself has been alive for ${uptimeText}. ` +
                'I am open source and if you know JavaScript and NodeJS you should totally help make me better. ' +
                `You can learn all about me at ${app.Config.project.repository.url}, or, better yet, contact me directly at ${app.Config.project.author} `;

            // Say
            app.say(from, out);
            if (to !== from) app.say(to, `I have private messaged you my origin story, ${from}`);
        },
    });

    return scriptInfo;
};
