/**
 * A Node.js program to replace usernames with user IDs
 * in guess text files.
 * 
 * This allows the raw text files to be used later
 * without errors from username changes.
 * 
 * @author fowwo
 */

if (process.argv.length !== 3) {
	console.log("Missing file argument: node .\\batchToID.js <file>");
	process.exit(0);
}

const fs = require("fs");
const twitchInfo = JSON.parse(fs.readFileSync("info.json"));
const manual = fs.readFileSync(process.argv[2], "utf-8").split(/\r?\n/);

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

let last = -1;
let streak = 0;
setInterval(() => {
	if (Object.keys(userMap).length === users.length || streak === 10) {
		let txt = "";
		for (var i = 0; i < manual.length - 1; i++) {
			if (manual[i][0] == "\t" && manual[i][1] != "\t") {
				let split = manual[i].trim().split(":");
				let user = userMap[split[0].toLowerCase()];
				if (user !== undefined) {
					txt += `\t${user.id}:${split[1]}`
				} else {
					txt += `*   ${split[0]}:${split[1]} (name changed)`
				}
			} else {
				txt += manual[i];
			}
			txt += "\n";
		}
		let diff = users.length - Object.keys(userMap).length;
		console.log(`Done! (${diff} name change${diff === 1 ? "" : "s"})`);
		fs.writeFileSync("./data/out.txt", txt, (err) => {
			if (err) {
				console.log(time() + " \x1b[101mError writing score file: ", err + "\x1b[0m");
			}
		});
		process.exit(0);
	} else {
		var bar = "----------";
		if (Object.keys(userMap).length === last) {
			streak++;
		} else {
			last = Object.keys(userMap).length;
			streak = 0;
		}
		for (var i = 0; i < streak; i++) {
			bar = bar.substring(0, i) + "#" + bar.substring(i + 1);
		}
		console.log(`${Object.keys(userMap).length} / ${users.length} [${bar}]`);
	}
}, 500);
