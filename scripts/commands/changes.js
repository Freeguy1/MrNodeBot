'use strict';

const scriptInfo = {
    name: 'changes',
    desc: 'Allow users to see git changes from IRC',
    createdBy: 'Dave Richer'
};

const gitlog = require('gitlog');
const helpers = require('../../helpers');

/**
  Review the local git change log ( Last 5 commits )
  Commands: changes
**/
module.exports = app => {
    const changes = (to, from, text, message) => {
        gitlog(app.Config.gitLog, function(error, commits) {

            // Exit on error
            if (error) {
                app.say(to, 'Something has gone wrong retrieving the change log');
                return;
            }

            app.say(to, `I have messaged you the change log ${from}, you can view the last commit at ${app.Config.project.repository.url}/commit/${commits[0].abbrevHash}`);

            app.say(from, helpers.TitleLine(
                `${app._ircClient.nick} Change log, last ${app._ircClient.nick} changes:`
            ));

            app.say(from, helpers.RedSlashes(
                'Hash / Author / Subject / Date'
            ));

            // List the commits
            commits.forEach(commit => {
                app.say(from, helpers.RedSlashes(
                    `${commit.abbrevHash} / ${commit.authorName} / ${commit.subject} / ${commit.authorDateRel}`));
            });

            // Last commit link
            if (commits && commits[0]) {
                app.say(from, `Last Commit: ${app.Config.project.repository.url}/commit/${commits[0].abbrevHash}`);
            }
        });
    };

    app.Commands.set('changes', {
        desc: 'Review the bots change log',
        access: app.Config.accessLevels.guest,
        call: changes
    });

    // Return the script info
    return scriptInfo;
};
