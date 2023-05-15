const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const config = require('./config.json');
const { readdirSync } = require('fs');

const intents = Object.values(GatewayIntentBits);
const partials = Object.values(Partials);

const client = new Client({
	intents,
	partials,
	allowedMentions: { parse: ['users', 'roles'] },
	presence: {
		activities: [{ name: 'discord.gg/stumbledev', type: ActivityType.Watching }],
		status: 'idle',
	},
});

client.commands = new Collection();
client.embed = require('./utils/embed.js');
client.config = config;

readdirSync('./src/events').forEach(async (file) => {
	const event = require(`./events/${file}`);
	event(client);
});

readdirSync('./src/commands').forEach((category) => {
	readdirSync(`./src/commands/${category}`).forEach(async (file) => {
		const command = require(`./commands/${category}/${file}`);
		client.commands.set(command.data.name, command);
	});
});

client.login(config.bot.token);
