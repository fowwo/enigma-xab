const container = document.getElementById("container");
const leaderboard = document.getElementById("leaderboard");
const background1 = document.getElementById("background1");
const background2 = document.getElementById("background2");
const background3 = document.getElementById("background3");
const background4 = document.getElementById("background4");
const background5 = document.getElementById("background5");

var activeLeaderboard = document.getElementById("leaderboard-placeholder");
var activeLeaderboardTab = document.getElementById("th-wins");
var activeScreen = document.getElementById("leaderboard-container");

function generateCircle(x, y, r, color = "black") {
	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("r", r);
	circle.setAttribute("fill", color);
	return circle;
}
function generateRandomCircle() {
	let x = Math.random();
	let y = Math.sqrt(Math.random());
	let r = randomRange(0.0025, 0.015);
	let i = Math.random();
	let color = i < 0.425 ? "#7715ce" : i < 0.85 ? "#6213ca" : i < 0.925 ? "#fff" : "#1914b8";
	return generateCircle(x, y, r, color);
}
function randomRange(a, b) {
	return (b - a) * Math.random() + a;
}
function viewLeaderboard(event) {
	activeLeaderboard.classList.remove("active");
	activeLeaderboardTab.classList.remove("active");

	activeLeaderboard = document.getElementById(`leaderboard-${event.target.id.substring(3)}`);
	activeLeaderboardTab = event.target;

	activeLeaderboard.classList.add("active");
	activeLeaderboardTab.classList.add("active");

	leaderboard.scrollTop = 0;
}
function switchTab(event) {
	let e = document.getElementById(`${event.target.id.substring(4)}-container`);
	if (e && e !== activeScreen) {
		activeScreen.style.opacity = 0;
		activeScreen.style.top = "110px";
		e.style.top = "70px";
		setTimeout(() => {
			activeScreen.style.display = "none";
			e.style.display = "initial";
			setTimeout(() => {
				e.style.opacity = 1;
				e.style.top = "90px";
				activeScreen = e;
			}, 50); // Allows for the screen to fade in
		}, 150);
	}
}

// Fill background with sequins
for (var i = 0; i < 150; i++) {
	background1.appendChild(generateRandomCircle());
	background2.appendChild(generateRandomCircle());
	background3.appendChild(generateRandomCircle());
	background4.appendChild(generateRandomCircle());
	background5.appendChild(generateRandomCircle());
}

// Background parallax
leaderboard.addEventListener("scroll", function(){
	background1.style.bottom = `${-20 * (1 - leaderboard.scrollTop / (leaderboard.scrollHeight - leaderboard.clientHeight))}%`;
	background2.style.bottom = `${-40 * (1 - leaderboard.scrollTop / (leaderboard.scrollHeight - leaderboard.clientHeight))}%`;
	background3.style.bottom = `${-60 * (1 - leaderboard.scrollTop / (leaderboard.scrollHeight - leaderboard.clientHeight))}%`;
	background4.style.bottom = `${-80 * (1 - leaderboard.scrollTop / (leaderboard.scrollHeight - leaderboard.clientHeight))}%`;
	background5.style.bottom = `${-100 * (1 - leaderboard.scrollTop / (leaderboard.scrollHeight - leaderboard.clientHeight))}%`;
});

// Fetch user data
var scores = {};
fetch("data.json").then(r => r.json()).then(data => {
	let users = [];
	var accuracy = 0;
	var total = {
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
	const stat = data.stat;
	delete data.stat;

	for (let [key, value] of Object.entries(data)) {
		users.push(new User(key, value.username, value.guesses, value.wins));
		total.guesses.x += value.guesses.x;
		total.guesses.a += value.guesses.a;
		total.guesses.b += value.guesses.b;
		total.wins.x += value.wins.x;
		total.wins.a += value.wins.a;
		total.wins.b += value.wins.b;
		accuracy += (value.wins.x + value.wins.a + value.wins.b) / (value.guesses.x + value.guesses.a + value.guesses.b);
	}

	function awardBadges(list, comparator) {
		if (list.length != 0) list[0].badges.gold++;
		let rank = 1;
		for (var i = 1; i < list.length; i++) {
			let user = list[i];
			if (comparator(list[i], list[i - 1]) !== 0) {
				rank = i + 1;
			}
			switch (rank) {
				case 1:
					user.badges.gold++;
					break;
				case 2:
					user.badges.silver++;
					break;
				case 3:
					user.badges.bronze++;
					break;
				default:
					return;
			}
		}
	}
	
	function toLeaderboard(list, comparator, id) {
		let tbody = document.createElement("tbody");
		tbody.id = id;
		var rank = 1;
		for (var i = 0; i < list.length; i++) {
			if (i > 0 && comparator(list[i], list[i - 1]) !== 0) rank = i + 1;
			tbody.appendChild(list[i].toLeaderboardRow(rank));
		}
		leaderboard.appendChild(tbody);
	}

	// Sort users
	scores.wins = [...users].sort((a, b) => User.compareByWins(a, b) === 0 ? User.compareByName(a, b) : User.compareByWins(a, b));
	scores.total = [...users].sort((a, b) => User.compareByTotal(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotal(a, b));
	scores.accuracy = [...users].filter(x => x.getTotalGuesses() >= 10).sort((a, b) => User.compareByPercentage(a, b) === 0 ? User.compareByName(a, b) : User.compareByPercentage(a, b));
	scores.x = [...users].sort((a, b) => User.compareByTotalX(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalX(a, b));
	scores.a = [...users].sort((a, b) => User.compareByTotalA(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalA(a, b));
	scores.b = [...users].sort((a, b) => User.compareByTotalB(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalB(a, b));

	// Award badges
	awardBadges(scores.wins, User.compareByWins);
	awardBadges(scores.total, User.compareByTotal);
	awardBadges(scores.accuracy, User.compareByPercentage);
	awardBadges(scores.x, User.compareByTotalX);
	awardBadges(scores.a, User.compareByTotalA);
	awardBadges(scores.b, User.compareByTotalB);

	// Create leaderboards
	toLeaderboard(scores.wins, User.compareByWins, "leaderboard-wins");
	toLeaderboard(scores.total, User.compareByTotal, "leaderboard-total");
	toLeaderboard(scores.accuracy, User.compareByPercentage, "leaderboard-accuracy");
	toLeaderboard(scores.x, User.compareByTotalX, "leaderboard-x");
	toLeaderboard(scores.a, User.compareByTotalA, "leaderboard-a");
	toLeaderboard(scores.b, User.compareByTotalB, "leaderboard-b");

	users.sort((a, b) => User.compareByName(a, b));
});
