/**
 * A Node.js chat bot used to collect guesses for "X, A, or B."
 * 
 * @author fowwo
 */

const tmi = require("tmi.js"); // Logger is muted - Directory: node_modules/tmi.js/lib/logger.js
const fs = require("fs");

const username = "AnEternalEnigma";
const twitchInfo = JSON.parse(fs.readFileSync("info.json"));
var data = JSON.parse(fs.readFileSync("../data.json"));
var pause = false;
var temp = {};

Number.prototype.lead = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
function fowwo(user) {
	if (user["user-id"] === "32829865") {
		return true;
	}
	return false;
}
function time() {
	var date = new Date();
	return "\x1b[90m" + date.getHours().lead(2) + ":" + date.getMinutes().lead(2) + "\x1b[0m";
}
function update() {
	fs.writeFile("data.json", JSON.stringify(data, null, 4) + "\n", (err) => {
		if (err) {
			console.log(time() + " \x1b[101mError writing score file: ", err + "\x1b[0m");
		}
	});
}

var client = new tmi.client({
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: twitchInfo.botUsername,
		password: twitchInfo.botOAuth
	},
	channels: []
});
client.connect();
console.clear();
console.log(time() + ' \x1b[93m... \x1b[94mWaiting to connect\x1b[0m');
client.on("connected", (address, port) => {
	console.clear();
	console.log(time() + ' \x1b[92m ✔  \x1b[92mConnected successfully\x1b[0m');
	client.join(username);
	console.log(time() + ' \x1b[92m ✔  \x1b[92mJoined \x1b[94m' + username + '\x1b[0m');
});
client.on("chat", (channel, user, message, self) => {
	if (!pause) {
		channel = channel.slice(1); // Remove the # in front of channel name
		if (self) { return; } // The bot will not respond to its own messages
	
		// Update user information if necessary
		if (data[user["user-id"]] == undefined) {
			data[user["user-id"]] = {
				username: user["display-name"],
				guesses: {
					x: 0,
					a: 0,
					b: 0
				},
				wins: {
					x: 0,
					a: 0,
					b: 0
				}
			}
		} else {
			data[user["user-id"]].username = user["display-name"];
		}
	
		// Choose winning option or make guess
		var char = message[0].toLowerCase();
		if (char == 'x' || char == 'a' || char == 'b') {
			if (message.length == 1 || message[1] == " ") {
				temp[user["user-id"]] = char;
				console.log(time() + ' \x1b[92m' + user.username + ' \x1b[94mguesses\x1b[93m ' + char + '\x1b[0m');
			} else if (fowwo(user) && message.length >= 2 && message[1] == "!") {
				data.stat[char]++;
				if (data.stat.prev == char) {
					data.stat.streak++;
					if (data.stat["max" + char] < data.stat.streak) {
						data.stat["max" + char] = data.stat.streak;
					}
				} else {
					data.stat.prev = char;
					data.stat.streak = 1;
				}
				console.log(time() + ' \x1b[92m' + char + '\x1b[93m was the winner!\x1b[0m');
				for (let [key, value] of Object.entries(temp)) {
					if (value == char) {
						data[key].wins[value]++;
						console.log(time() + ' \x1b[93m' + data[key].username + ' \x1b[94m>>\x1b[92m ' + value + '\x1b[0m');
					} else {
						console.log(time() + ' \x1b[93m' + data[key].username + ' \x1b[94m>>\x1b[91m ' + value + '\x1b[0m');
					}
					data[key].guesses[value]++;
				}
				temp = {};
				update();
				pause = true;
				console.log(time() + ' \x1b[94mPausing for \x1b[93m3:00\x1b[0m');
				setTimeout(() => {
					pause = false;
					console.log(time() + ' \x1b[92mResuming...\x1b[0m');
				}, 3 * 60 * 1000);
			}
		}
	}
});
