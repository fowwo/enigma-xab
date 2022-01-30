/**
 * A Node.js program to recalculate all stats.
 * 
 * @author fowwo
 */

import fs from "fs";
const idFile = fs.readFileSync("./data/id.txt", "utf-8").split(/\r?\n/);
const nameFile = fs.readFileSync("./data/name.txt", "utf-8").split(/\r?\n/);

let data = {};
let stat = {
	total: { x: 0, a: 0, b: 0 },
	streak: { x: 0, a: 0, b: 0 }
};

// Filter
for (var i = 0; i < idFile.length; i++) {
	if (idFile[i][0] !== '\t') {
		idFile.splice(i, 1);
		nameFile.splice(i, 1);
		i--;
	}
}

// Recalculate
let round = {};
let streak = 0;
let previous = "";
for (var i in idFile) {
	const line = idFile[i];
	if (line[1] === '\t') {
		const char = line.trim()[0].toLowerCase();

		// Choose winning option
		if (char === 'x' || char === 'a' || char === 'b') {
			stat.total[char]++;
			if (previous === char) {
				streak++;
				if (stat.streak[char] < streak) stat.streak[char] = streak;
			} else {
				previous = char;
				streak = 1;
			}
			for (let [key, value] of Object.entries(round)) {
				if (value === char) data[key].wins[value]++;
				data[key].guesses[value]++;
			}
			round = {};
		} else {
			console.log(char + " is not a valid winner.");
			process.exit(1);
		}
	} else {
		const split = line.split(':');
		const id = split[0].trim();
		const name = nameFile[i].split(':')[0].trim()
		const char = split[1].trim().toLowerCase();

		if (!data[id]) {
			data[id] = {
				username: name,
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
			};
		} else {
			data[id].username = name;
		}

		// Make guess
		if (char === 'x' || char === 'a' || char === 'b') {
			round[id] = char;
		} else {
			console.log(`${char} is not a valid guess.`);
			process.exit(1);
		}
	}
}

// Save
fs.writeFileSync("../user.json", JSON.stringify(data, null, '\t') + '\n', (err) => {
	if (err) console.log("\x1b[101mError writing user file: ", err + "\x1b[0m");
});
fs.writeFileSync("../stat.json", JSON.stringify(stat, null, '\t') + '\n', (err) => {
	if (err) console.log("\x1b[101mError writing stat file: ", err + "\x1b[0m");
});
