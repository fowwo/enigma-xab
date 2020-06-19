/**
 * A Node.js program to display stats.
 * This unfinished code was used prior to the creation of the web page:
 * https://fowwo.github.io/enigma-xab/
 * 
 * @author fowwo
 */

const fs = require("fs");
const args = process.argv.slice(2);
var data = JSON.parse(fs.readFileSync("../data.json"));

Number.prototype.lead = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}
console.clear();

var list = [];
for (let [key, value] of Object.entries(data)) {
	if (key == 'stat') continue;
	list.push(value);
}

if (args[0] == "name") {
	list.sort((a, b) => sortByName(a, b));
} else if (args[0] == "wins") {
	list.sort((a, b) => sortByWins(a, b));
} else if (args[0] == "total") {
	list.sort((a, b) => sortByTotal(a, b));
} else if (args[0] == "ratio") {
	list.sort((a, b) => sortByRatio(a, b));
} else if (args[0] == "x" || args[0] == "a" || args[0] == "b") {
	list.sort((a, b) => sortByGuess(args[0], a, b));
}

console.log(" Name                      | Wins | Total | Ratio   |  X  |  A  |  B   ");
console.log("---------------------------|------|-------|---------|-----|-----|------");
for (var x of list) {
	let ratio = "-------";
	if (x.guesses.x + x.guesses.a + x.guesses.b > 0) ratio = ("      " + (100 * (x.wins.x + x.wins.a + x.wins.b) / (x.guesses.x + x.guesses.a + x.guesses.b)).toFixed(2)).slice(-6) + "%";
	console.log(` ${(x.username + "                         ").slice(0, 25)} | ${("    " + (x.wins.x + x.wins.a + x.wins.b)).slice(-4)} | ${("     " + (x.guesses.x + x.guesses.a + x.guesses.b)).slice(-5)} | ${ratio} | ${("   " + x.guesses.x).slice(-3)} | ${("   " + x.guesses.a).slice(-3)} | ${("   " + x.guesses.b).slice(-3)}`);
}

function sortByName(a, b) {
	return a.username < b.username ? -1 : 1;
}
function sortByWins(a, b) {
	var x = a.wins.x + a.wins.a + a.wins.b;
	var y = b.wins.x + b.wins.a + b.wins.b;
 	return x > y ? -1 : x === y ? sortByName(a, b) : 1;
}
function sortByTotal(a, b) {
	var x = a.guesses.x + a.guesses.a + a.guesses.b;
	var y = b.guesses.x + b.guesses.a + b.guesses.b;
	return x > y ? -1 : x === y ? sortByName(a, b) : 1;
}
function sortByRatio(a, b) {
	var x = 0;
	var y = 0;
	if (a.guesses.x + a.guesses.a + a.guesses.b > 0) x = (a.wins.x + a.wins.a + a.wins.b) / (a.guesses.x + a.guesses.a + a.guesses.b);
	if (b.guesses.x + b.guesses.a + b.guesses.b > 0) y = (b.wins.x + b.wins.a + b.wins.b) / (b.guesses.x + b.guesses.a + b.guesses.b);
	return x < y ? 1 : x === y ? sortByTotal(a, b) : -1;
}
function sortByGuess(guess, a, b) {
	return a.guesses[guess] > b.guesses[guess] ? -1 : a.guesses[guess] === b.guesses[guess] ? sortByName(a, b) : 1;
}
