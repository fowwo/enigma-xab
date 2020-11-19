/**
 * Sorts and displays scores from the data file.
 * 
 * @author fowwo
 */

var scores = {};
fetch("data.json")
	.then(r => r.json())
	.then(data => {
		let users = [];
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
			users.push(new User(key, value.username, value.guesses, value.wins));
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

		// Sort scores
		scores.name = [...users].sort((a, b) => User.compareByName(a, b));
		scores.wins = [...users].sort((a, b) => User.compareByWins(a, b) === 0 ? User.compareByName(a, b) : User.compareByWins(a, b));
		scores.total = [...users].sort((a, b) => User.compareByTotal(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotal(a, b));
		scores.accuracy = [...users].sort((a, b) => User.compareByPercentage(a, b) === 0 ? User.compareByName(a, b) : User.compareByPercentage(a, b)).filter(x => x.getTotalGuesses() >= 10);
		scores.x = [...users].sort((a, b) => User.compareByTotalX(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalX(a, b));
		scores.a = [...users].sort((a, b) => User.compareByTotalA(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalA(a, b));
		scores.b = [...users].sort((a, b) => User.compareByTotalB(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalB(a, b));
	});

/**
 * Displays scores on the leaderboard.
 * 
 * @param {Array} list An array of scores.
 * @param comparator The comparator used on the list.
 */
function displayScores(list, comparator) {

	const table = document.getElementById("leaderboard");
	for (var i = table.rows.length; i > 1; i--) {
		table.deleteRow(-1);
	}

	var rank = 1;
	for (var i = 0; i < list.length; i++) {
		let user = list[i];
		if (i > 0 && comparator(list[i], list[i - 1]) !== 0) {
			rank = i + 1;
		}
		table.appendChild(user.toLeaderboardRow(rank));
	}

}
