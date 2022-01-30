/**
 * A Node.js program to add scores from a given file.
 * 
 * Used for adding scores manually, especially for guesses
 * made between April 19th, 2020 and June 16th, 2020.
 * 
 * All guesses made between April 19th, 2020 and June 16th, 2020 are
 * tracked 'accurately' in that guesses were tracked by hand;
 * guesses that wouldn't be found by the script,
 * such as "I think it will be A this time.", were counted.
 * 
 * @author fowwo
 */

import fs from "fs";
import fetch from "node-fetch";
const twitchInfo = JSON.parse(fs.readFileSync("info.json"));
var data = JSON.parse(fs.readFileSync("../data.json"));
var temp = {};

if (process.argv.length !== 3) {
	console.log("Missing file argument: node .\\manual.js <file>");
	process.exit(0);
}
var manual = fs.readFileSync(process.argv[2], "utf-8").split(/\r?\n/);

function mapUsersToID(users) {
	const url = "https://api.twitch.tv/helix/users?";
	const options = {
		method: 'GET',
		headers: {
			"client-id": twitchInfo.clientID,
			Authorization: twitchInfo.authorization
		}
	};

	var map = {};
	while (users.length > 0) {
		fetch(url + `login=${users.slice(0, 100).join("&login=")}`, options)
			.then(res => res.json())
			.then(data => {
				data = data.data;
				for (var i = 0; i < data.length; i++) {
					map[data[i].login] = {
						id: data[i].id,
						name: data[i].display_name
					}
				}
			});
		users = users.slice(100);
	}
	return map;

	/* Response example:
		{ data:
			[ { id: '32829865',
				login: 'fowwo_',
				display_name: 'fowwo_',
				type: '',
				broadcaster_type: '',
				description: 'Who you are in fewer than 300 characters',
				profile_image_url:
					'https://static-cdn.jtvnw.net/jtv_user_pictures/4495d61946217d33-profile_image-300x300.png',
				offline_image_url: '',
				view_count: 185 } ] }
	*/

}

// Get all necessary user ids
var users = [];
for (var i = 0; i < manual.length; i++) {
	// Get all usernames
	if (manual[i][0] == "\t" && manual[i][1] != "\t") {
		let user = manual[i].split(":")[0].trim();
		if (!users.includes(user)) users.push(user);
	}
}
var userMap = mapUsersToID(users);

setInterval(() => {
	if (Object.keys(userMap).length == users.length) {
		for (var i = 0; i < manual.length; i++) {
			if (manual[i][0] == "\t" && manual[i][1] == "\t") {
				var char = manual[i].trim()[0].toLowerCase();
		
				// Choose winning option
				if (char == 'x' || char == 'a' || char == 'b') {
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
					console.log('\x1b[92m' + char + '\x1b[93m was the winner!\x1b[0m');
					for (let [key, value] of Object.entries(temp)) {
						if (value == char) {
							data[key].wins[value]++;
							console.log('\x1b[93m' + data[key].username + ' \x1b[94m>>\x1b[92m ' + value + '\x1b[0m');
						} else {
							console.log('\x1b[93m' + data[key].username + ' \x1b[94m>>\x1b[91m ' + value + '\x1b[0m');
						}
						data[key].guesses[value]++;
					}
					temp = {};
				} else {
					console.log(char + " is not a valid winner.");
					process.exit(1);
				}
			} else if (manual[i][0] == "\t") {
				let split = manual[i].split(":");
				var user = split[0].trim().toLowerCase();
				var char = split[1].trim().toLowerCase();
				
				// Update user information if necessary
				if (data[userMap[user].id] == undefined) {
					data[userMap[user].id] = {
						username: userMap[user].name,
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
					data[userMap[user].id].username = split[0].trim();
				}

				// Make guess
				if (char == 'x' || char == 'a' || char == 'b') {
					temp[userMap[user].id] = char;
					console.log('\x1b[92m' + user + ' \x1b[94mguesses\x1b[93m ' + char + '\x1b[0m');
				} else {
					console.log(char + " is not a valid guess.");
					process.exit(1);
				}
			}
		
		}

		fs.writeFileSync("../data.json", JSON.stringify(data, null, 4) + "\n", (err) => {
			if (err) {
				console.log(time() + " \x1b[101mError writing score file: ", err + "\x1b[0m");
			}
		});
		process.exit(0);
	}
}, 50);
