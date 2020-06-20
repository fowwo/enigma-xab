/**
 * Sorts and displays scores from the data file.
 * 
 * @author fowwo
 */

var scores = [];
fetch("data.json")
	.then(r => r.json())
	.then(data => {
		for (let [key, value] of Object.entries(data)) {
			if (key == 'stat') continue;
			scores.push(value);
		}
	});

/**
 * Sorts scores and displays them in the table.
 * 
 * @param {Array} list An array of scores.
 * @param {String} type The method in which the array should be sorted.
 * @param {Boolean} reverse Whether or not the order should be reversed; defaults to false.
 * @param {Boolean} filter Whether or not people will less than 10 guesses should be filtered out; defaults to false.
 */
function sort(list, type, reverse = false, filter = false) {

	if (filter) list = list.filter((a) => { return a.guesses.x + a.guesses.a + a.guesses.b >= 10; });

	var comparator;
	if (type == "percentage") {
		comparator = compareByPercentage;
	} else if (type == "wins") {
		comparator = compareByWins;
	} else if (type == "total") {
		comparator = compareByTotal;
	} else if (type == "x" || type == "a" || type == "b") {
		comparator = compareByGuess;
	} else {
		comparator = compareByName;
	}
	list.sort((a, b) => (comparator(a, b, type) === 0 ? compareByName(a, b) : comparator(a, b, type)) * (reverse ? -1 : 1));

	const table = document.getElementById("leaderboard");

	for (var i = table.rows.length; i > 1; i--) {
		table.deleteRow(-1);
	}

	var row;
	var cell;

	var rank = 1;
	for (var i = 0; i < list.length; i++) {
		let a = list[i];
		let totalWins = a.wins.x + a.wins.a + a.wins.b;
		let totalGuesses = a.guesses.x + a.guesses.a + a.guesses.b;

		row = document.createElement("tr");

		cell = document.createElement("td");
		if (i > 0 && comparator(list[i], list[i - 1], type) !== 0) {
			rank = i + 1;
		}
		cell.innerHTML = rank;
		if (rank === 1) {
			cell.style = "text-align: center; color: #fc0; text-shadow: 0 0 10px #fc0, 0 0 10px #fc0, 0 0 10px #fc0;";
			row.style = "background-color: #fc04;";
		} else if (rank === 2) {
			cell.style = "text-align: center; color: #ddd; text-shadow: 0 0 10px #ddd, 0 0 10px #ddd, 0 0 10px #ddd;";
			row.style = "background-color: #ddd3;";
		} else if (rank === 3) {
			cell.style = "text-align: center; color: #d70; text-shadow: 0 0 10px #d70, 0 0 10px #d70, 0 0 10px #d70;";
			row.style = "background-color: #d702;";
		} else {
			cell.style = "text-align: center;";
		}
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = a.username;
		let maxGuess = Math.max(a.guesses.x, a.guesses.a, a.guesses.b);
		cell.style = `text-align: left; color: rgb(${Math.round(155 * a.guesses.b / maxGuess) + 100}, ${Math.round(155 * a.guesses.a / maxGuess) + 100}, ${Math.round(155 * a.guesses.x / maxGuess) + 100})`
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = totalWins;
		cell.style = "text-align: center;";
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = totalGuesses;
		cell.style = "text-align: center;";
		row.appendChild(cell);

		cell = document.createElement("td");
		if (totalGuesses === 0) {
			cell.innerHTML = "------";
			cell.style = "text-align: center;color: #cdf5;";
		} else {
			if (comparator == compareByPercentage) {
				let max = Math.max((list[0].wins.x + list[0].wins.a + list[0].wins.b) / (list[0].guesses.x + list[0].guesses.a + list[0].guesses.b), (list[list.length - 1].wins.x + list[list.length - 1].wins.a + list[list.length - 1].wins.b) / (list[list.length - 1].guesses.x + list[list.length - 1].guesses.a + list[list.length - 1].guesses.b));
				let min = Math.min((list[0].wins.x + list[0].wins.a + list[0].wins.b) / (list[0].guesses.x + list[0].guesses.a + list[0].guesses.b), (list[list.length - 1].wins.x + list[list.length - 1].wins.a + list[list.length - 1].wins.b) / (list[list.length - 1].guesses.x + list[list.length - 1].guesses.a + list[list.length - 1].guesses.b));
				let rgb = `rgb(${Math.round(255 * Math.min((2 * max - 2 * totalWins / totalGuesses) / (max - min), 1))},${Math.round(255 * Math.min((2 * totalWins / totalGuesses - 2 * min) / (max - min), 1))},0)`;
				cell.style = `text-align: center;color: ${rgb};text-shadow: 0 0 10px ${rgb};`;
			} else {
				let rgb = `rgb(${Math.round(255 * Math.min((2 - 2 * totalWins / totalGuesses), 1))},${Math.round(255 * Math.min((2 * totalWins / totalGuesses), 1))},0)`;
				cell.style = `text-align: center;color: ${rgb};text-shadow: 0 0 10px ${rgb};`;
			}
			cell.innerHTML = (100 * totalWins / totalGuesses).toFixed(2) + "%";
		}
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = a.guesses.x
		cell.style = "text-align: center; color: var(--light-blue);";
		row.appendChild(cell);
		
		cell = document.createElement("td");
		cell.innerHTML = a.guesses.a
		cell.style = "text-align: center; color: var(--light-green);";
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = a.guesses.b
		cell.style = "text-align: center; color: var(--light-red);";
		row.appendChild(cell);

		table.appendChild(row);
	}

	table.appendChild(row);

}

/**
 * Compares scores by percentage correct.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByPercentage(a, b) {
	let x = 0;
	let y = 0;
	if (a.guesses.x + a.guesses.a + a.guesses.b > 0) x = (a.wins.x + a.wins.a + a.wins.b) / (a.guesses.x + a.guesses.a + a.guesses.b);
	if (b.guesses.x + b.guesses.a + b.guesses.b > 0) y = (b.wins.x + b.wins.a + b.wins.b) / (b.guesses.x + b.guesses.a + b.guesses.b);
	return x < y ? 1 : x === y ? compareByTotal(a, b) : -1;
}

/**
 * Compares scores by username.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByName(a, b) {
	return a.username < b.username ? -1 : a.username === b.username ? 0 : 1;
}

/**
 * Compares scores by number of wins.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByWins(a, b) {
	var x = a.wins.x + a.wins.a + a.wins.b;
	var y = b.wins.x + b.wins.a + b.wins.b;
 	return x > y ? -1 : x === y ? 0 : 1;
}

/**
 * Compares scores by total number of guesses.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByTotal(a, b) {
	var x = a.guesses.x + a.guesses.a + a.guesses.b;
	var y = b.guesses.x + b.guesses.a + b.guesses.b;
	return x > y ? -1 : x === y ? 0 : 1;
}

/**
 * Compares scores by total number of a certain guess.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @param guess The guess to compare by (x, a, or b).
 * @returns -1, 0, or 1.
 */
function compareByGuess(a, b, guess) {
	return a.guesses[guess] > b.guesses[guess] ? -1 : a.guesses[guess] === b.guesses[guess] ? 0 : 1;
}
