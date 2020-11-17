/**
 * A Node.js program to read guesses from HTML
 * and print them in the console.
 * 
 * This allows the copying of guesses without
 * having to manually copy one-at-a-time.
 * 
 * @author fowwo
 */

if (process.argv.length !== 3) {
	console.log("Missing file argument: node .\\htmlToText.js <file>");
	process.exit(0);
}

const fs = require("fs");
const parse = require("node-html-parser").parse;

let list = parse(fs.readFileSync(process.argv[2])).childNodes[0].childNodes;
for (var li of list) {
	try {
		let div = li.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
		let username = div.childNodes[1].childNodes[0].innerText;
		let message = div.childNodes[2].childNodes[1].childNodes[0].innerText;
		console.log(`${username}:${message}`);
	} catch (e) {
		// Not a user message.
	}
}
