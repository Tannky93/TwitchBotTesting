require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-z0-9]+)(?:\w+)?(.*)?/);

const commands = {
    website: {
        response: 'https://www.twitch.tv/tannky93'
    },
    hello: {
        response: (user) => `Hello ${user},  Great to see you!`
    }
}

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: [ 'tannky93' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
    const isNotBOT = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;
	
    if(self) return;

    const [raw,command,argument] = message.match(regexpCommand);

    const { response } = commands[command] || {};

    if (typeof response === 'function'){
        
        client.say(channel,response(tags.username));

    }else if (typeof response === 'string'){
        client.say(channel,response);
    }

	//if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		//client.say(channel, `@${tags.username}, heya!`);
	//}
});


