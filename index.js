/**
 * Sorts and displays scores from the data file.
 * 
 * @author fowwo
 */

var scores = [];
fetch("data.json")
	.then(r => r.json())
	.then(data => {
		var guesses = {
			x: 0,
			a: 0,
			b: 0
		}
		var wins = {
			x: 0,
			a: 0,
			b: 0
		}
		var userCount = Object.entries(data).length - 1;
		var accuracy = 0;
		for (let [key, value] of Object.entries(data)) {
			if (key == 'stat') continue;
			scores.push(value);
			guesses.x += value.guesses.x;
			guesses.a += value.guesses.a;
			guesses.b += value.guesses.b;
			wins.x += value.wins.x;
			wins.a += value.wins.a;
			wins.b += value.wins.b;
			accuracy += (value.wins.x + value.wins.a + value.wins.b) / (value.guesses.x + value.guesses.a + value.guesses.b);
		}
		document.getElementById("rounds-played").innerHTML = data.stat.x + data.stat.a + data.stat.b;
		document.getElementById("total-guesses").innerHTML = guesses.x + guesses.a + guesses.b;
		document.getElementById("x-guesses").innerHTML = guesses.x;
		document.getElementById("a-guesses").innerHTML = guesses.a;
		document.getElementById("b-guesses").innerHTML = guesses.b;
		document.getElementById("total-wins").innerHTML = wins.x + wins.a + wins.b;
		document.getElementById("x-streak").innerHTML = data.stat.maxx;
		document.getElementById("a-streak").innerHTML = data.stat.maxa;
		document.getElementById("b-streak").innerHTML = data.stat.maxb;
		document.getElementById("unique-users").innerHTML = userCount;
		let rgb = `rgb(${Math.round(255 * Math.min((2 - 2 * accuracy / userCount), 1))},${Math.round(255 * Math.min((2 * accuracy / userCount), 1))},0)`;
		document.getElementById("average-accuracy").style = `color: ${rgb}; text-shadow: 0 0 10px ${rgb};`;
		document.getElementById("average-accuracy").innerHTML = (100 * accuracy / userCount).toFixed(2) + "%";
		rgb = `rgb(${Math.round(255 * Math.min((2 - 2 * (wins.x + wins.a + wins.b) / (guesses.x + guesses.a + guesses.b)), 1))},${Math.round(255 * Math.min((2 * (wins.x + wins.a + wins.b) / (guesses.x + guesses.a + guesses.b)), 1))},0)`;
		document.getElementById("cumulative-accuracy").style = `color: ${rgb}; text-shadow: 0 0 10px ${rgb};`;
		document.getElementById("cumulative-accuracy").innerHTML = (100 * (wins.x + wins.a + wins.b) / (guesses.x + guesses.a + guesses.b)).toFixed(2) + "%";
	});

/**
 * Sorts scores and displays them in the table.
 * 
 * @param {Array} list An array of scores.
 * @param {String} type The method in which the array should be sorted.
 * @param {Boolean} reverse Whether or not the order should be reversed; defaults to false.
 * @param {Boolean} filter Whether or not people will less than 10 guesses should be filtered out; defaults to false.
 */
function sort(list, comparator, reverse = false, filter = false) {

	if (filter) list = list.filter((a) => { return a.guesses.x + a.guesses.a + a.guesses.b >= 10; });

	list.sort((a, b) => (comparator(a, b) === 0 ? compareByName(a, b) : comparator(a, b)) * (reverse ? -1 : 1));

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
		if (i > 0 && comparator(list[i], list[i - 1]) !== 0) {
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
		cell.classList.add("name-cell");
		let maxGuess = Math.max(a.guesses.x, a.guesses.a, a.guesses.b);
		cell.style.color = `rgb(${Math.round(155 * a.guesses.b / maxGuess) + 100}, ${Math.round(155 * a.guesses.a / maxGuess) + 100}, ${Math.round(155 * a.guesses.x / maxGuess) + 100})`;
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
			let rgb = `rgb(${Math.round(255 * Math.min((2 - 2 * totalWins / totalGuesses), 1))},${Math.round(255 * Math.min((2 * totalWins / totalGuesses), 1))},0)`;
			cell.style = `text-align: center;color: ${rgb};text-shadow: 0 0 10px ${rgb};`;
			cell.innerHTML = (100 * totalWins / totalGuesses).toFixed(2) + "%";
		}
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = a.guesses.x;
		cell.style = "text-align: center; color: var(--light-blue);";
		row.appendChild(cell);
		
		cell = document.createElement("td");
		cell.innerHTML = a.guesses.a;
		cell.style = "text-align: center; color: var(--light-green);";
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = a.guesses.b;
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
 * Compares scores by total number of 'X' guesses.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByTotalX(a, b) {
	return a.guesses.x > b.guesses.x ? -1 : a.guesses.x === b.guesses.x ? 0 : 1;
}

/**
 * Compares scores by total number of 'A' guesses.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByTotalA(a, b) {
	return a.guesses.a > b.guesses.a ? -1 : a.guesses.a === b.guesses.a ? 0 : 1;
}

/**
 * Compares scores by total number of 'B' guesses.
 * 
 * @param a The score being compared from.
 * @param b The score being compared to.
 * @returns -1, 0, or 1.
 */
function compareByTotalB(a, b) {
	return a.guesses.b > b.guesses.b ? -1 : a.guesses.b === b.guesses.b ? 0 : 1;
}
