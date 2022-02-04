const container = document.getElementById("container");
const leaderboard = document.getElementById("leaderboard");
const background1 = document.getElementById("background1");
const background2 = document.getElementById("background2");
const background3 = document.getElementById("background3");
const background4 = document.getElementById("background4");
const background5 = document.getElementById("background5");
const statTab = document.getElementById("nav-statistics");

var activeLeaderboard = document.getElementById("leaderboard-placeholder");
var activeLeaderboardTab = document.getElementById("th-wins");
var activeScreen = document.getElementById("leaderboard-container");

var userAbortController = new AbortController();

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
function fillPieChart(pie, x, a, b, tab) {
	const total = x + a + b;
	let slice, fill, value = 0;
	let sliceList = [], fillList = [];
	const createSlice = () => {
		slice = document.createElement("div");
		slice.classList.add("pie-slice");
		fill = document.createElement("div");
		fill.classList.add("fill");
		slice.appendChild(fill);
		pie.appendChild(slice);
	};
	const animate = () => {
		const animateOptions = { easing: "ease", fill: "forwards", duration: 1500 };
		pie.animate([
			{ transform: "rotate(90deg)" },
			{ transform: "rotate(225deg)" }
		], animateOptions);
		for (var i = 0; i < pie.children.length; i++) {
			let child = pie.children[i];
			child.animate([
				{ transform: "rotate(0deg)" },
				{ transform: sliceList[i] }
			], animateOptions);
			child.firstElementChild.animate([
				{ transform: "rotate(0deg)" },
				{ transform: fillList[i] }
			], animateOptions);
		}
	};

	if (x / total > .5) {
		createSlice();
		slice.classList.add("x");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push("rotate(180deg)");

		createSlice();
		slice.classList.add("x");
		sliceList.push(`rotate(${value + (360 * x / total - 180)}deg)`);
		fillList.push("rotate(180deg)");
	} else {
		createSlice();
		slice.classList.add("x");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push(`rotate(${360 * x / total}deg)`);
	}

	value += 360 * x / total;

	if (a / total > .5) {
		createSlice();
		slice.classList.add("a");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push("rotate(180deg)");

		createSlice();
		slice.classList.add("a");
		sliceList.push(`rotate(${value + (360 * a / total - 180)}deg)`);
		fillList.push("rotate(180deg)");
	} else {
		createSlice();
		slice.classList.add("a");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push(`rotate(${360 * a / total}deg)`);
	}

	value += 360 * a / total;

	if (b / total > .5) {
		createSlice();
		slice.classList.add("b");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push("rotate(180deg)");

		createSlice();
		slice.classList.add("b");
		sliceList.push(`rotate(${value + (360 * b / total - 180)}deg)`);
		fillList.push("rotate(180deg)");
	} else {
		createSlice();
		slice.classList.add("b");
		sliceList.push(`rotate(${value}deg)`);
		fillList.push(`rotate(${360 * b / total}deg)`);
	}

	const label = document.createElement("div");
	label.classList.add("pie-label");
	label.innerHTML = x + a + b;
	pie.parentElement.insertBefore(label, null);

	if (tab) {
		let signal;
		if (tab.id === "nav-user") signal = userAbortController.signal;
		tab.addEventListener("click", () => {
			if (activeScreen.id !== `${tab.id.substring(4)}-container`) animate();
		}, { signal: signal });
	}

	animate();
}
function fillBarGraph(bar, x, a, b, tab) {
	const total = x + a + b;
	const max = Math.max(x, a, b);
	const list = [ `${100 * x / max}%`, `${100 * a / max}% `, `${100 * b / max}%` ];
	const animate = () => {
		const animateOptions = { easing: "ease", fill: "forwards", duration: 1500 };
		for (var i = 0; i < bar.children.length; i++) {
			let child = bar.children[i];
			child.animate([
				{ width: "0%" },
				{ width: list[i] }
			], animateOptions);
		}
	};

	const xBar = document.createElement("li");
	const aBar = document.createElement("li");
	const bBar = document.createElement("li");
	xBar.classList.add("x");
	aBar.classList.add("a");
	bBar.classList.add("b");
	bar.appendChild(xBar);
	bar.appendChild(aBar);
	bar.appendChild(bBar);

	xBar.innerHTML = `${x} <span>(${(total ? 100 * x / total : 0).toFixed(2)}%)</span>`;
	aBar.innerHTML = `${a} <span>(${(total ? 100 * a / total : 0).toFixed(2)}%)</span>`;
	bBar.innerHTML = `${b} <span>(${(total ? 100 * b / total : 0).toFixed(2)}%)</span>`;

	if (tab) {
		let signal;
		if (tab.id === "nav-user") signal = userAbortController.signal;
		tab.addEventListener("click", () => {
			if (activeScreen.id !== `${tab.id.substring(4)}-container`) animate();
		}, { signal: signal });
	}

	animate();
}
function searchUser(name) {
	const input = document.getElementById("search");
	input.classList.remove("not-found");

	let user = new User(null, name);
	let a = 0;
	let b = scores.name.length - 1;
	while (a <= b) {
		let i = Math.floor((a + b) / 2);
		let value = User.compareByName(user, scores.name[i]);
		if (value === 1) {
			a = i + 1;
		} else if (value === -1) {
			b = i - 1;
		} else {
			user = scores.name[i];
			break;
		}
	}
	
	if (user.id !== null) {
		document.getElementById("search-results").style.display = "initial";

		// Input
		input.blur();

		// Username
		const username = document.getElementById("search-name");
		username.style.color = user.getNameColor();
		username.innerText = user.username;

		// Badges
		const badgeContainer = document.getElementById("search-badges");
		badgeContainer.innerHTML = "";
		[ "gold", "silver", "bronze" ].forEach((x) => {
			let badges = document.createElement("span");
			badges.style.fontSize = "24px";
			badges.style.lineHeight = "24px";
			badges.style.color = `var(--${x})`;
			badges.style.textShadow = `0 0 10px var(--${x}), 0 0 5px #000f`;
			for (var i = 0; i < user.badges[x]; i++) badges.innerHTML += "★";
			badgeContainer.appendChild(badges);
		});
		badgeContainer.style.marginRight = user.badges.gold + user.badges.silver + user.badges.bronze ? "5px" : "0px";

		// Team
		const team = document.getElementById("search-team");
		team.innerHTML = "";
		switch (user.getTeam()) {
			case "x":
				team.innerHTML = "Team X";
				team.style.color = "var(--blue)";
				break;
			case "a":
				team.innerHTML = "Team A";
				team.style.color = "var(--green)";
				break;
			case "b":
				team.innerHTML = "Team B";
				team.style.color = "var(--red)";
				break;
		}

		// Stat table
		const rank = (list, comparator) => {
			const span = document.createElement("span");
			if (list[0].id === user.id) {
				span.innerHTML = "1st";
				span.style.color = "var(--gold)";
				span.style.textShadow = "0 0 10px var(--gold), 0 0 10px var(--gold), 0 0 10px var(--gold)";
				return span.outerHTML;
			}
			
			// Find rank
			let rank = 1;
			for (var i = 1; i < list.length; i++) {
				if (comparator(list[i], list[i - 1]) !== 0) rank = i + 1;
				if (list[i].id === user.id) {
					span.innerHTML = `${rank}${suffix(rank)}`;
					switch (rank) {
						case 1:
							span.style.color = "var(--gold)";
							span.style.textShadow = "0 0 10px var(--gold), 0 0 10px var(--gold), 0 0 10px var(--gold)";
							break;
						case 2:
							span.style.color = "var(--silver)";
							span.style.textShadow = "0 0 10px var(--silver), 0 0 10px var(--silver), 0 0 10px var(--silver)";
							break;
						case 3:
							span.style.color = "var(--bronze)";
							span.style.textShadow = "0 0 10px var(--bronze), 0 0 10px var(--bronze), 0 0 10px var(--bronze)";
							break;
					}
					return span.outerHTML;
				}
			}

			// Rank not found
			span.innerHTML = "-";
			return span.outerHTML;
		};
		const suffix = (rank) => {
			if (rank % 100 > 3 && rank % 100 < 21) return "th";
			let x = rank % 10;
			switch (x) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		};
		document.getElementById("user-score").innerHTML = user.score.toFixed(3);
		document.getElementById("user-wins").innerHTML = user.getTotalWins();
		document.getElementById("user-guesses").innerHTML = user.getTotalGuesses();
		document.getElementById("user-accuracy").innerHTML = `${(100 * user.getAccuracy()).toFixed(2)}%`;
		document.getElementById("user-accuracy").style.color = user.getAccuracyColor();
		document.getElementById("user-x").innerHTML = user.guesses.x;
		document.getElementById("user-a").innerHTML = user.guesses.a;
		document.getElementById("user-b").innerHTML = user.guesses.b;
		
		document.getElementById("user-score-rank").innerHTML = rank(scores.score, User.compareByScore);
		document.getElementById("user-wins-rank").innerHTML = rank(scores.wins, User.compareByWins);
		document.getElementById("user-guesses-rank").innerHTML = rank(scores.total, User.compareByTotal);
		document.getElementById("user-accuracy-rank").innerHTML = rank(scores.accuracy, User.compareByPercentage);
		document.getElementById("user-x-rank").innerHTML = rank(scores.x, User.compareByTotalX);
		document.getElementById("user-a-rank").innerHTML = rank(scores.a, User.compareByTotalA);
		document.getElementById("user-b-rank").innerHTML = rank(scores.b, User.compareByTotalB);

		// Charts
		userAbortController.abort();
		userAbortController = new AbortController();

		const userTab = document.getElementById("nav-user");
		[ "guesses", "wins" ].forEach((x) => {
			let pie = document.getElementById(`pie-user-${x}`);
			let bar = document.getElementById(`bar-user-${x}`);
			pie.innerHTML = ""; 
			bar.innerHTML = "";
			fillPieChart(pie, user[x].x, user[x].a, user[x].b, userTab);
			fillBarGraph(bar, user[x].x, user[x].a, user[x].b, userTab);
		});

		document.getElementById("search-results").style.display = "initial";		
	} else {
		// User not found
		input.classList.add("not-found");
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

// Search event listeners
document.getElementById("search-form").addEventListener("submit", (event) => {
	event.preventDefault();
	let input = document.getElementById("search").value;
	if (input !== "") searchUser(input);
});
document.getElementById("search").addEventListener("input", (event) => {
	event.target.classList.remove("found", "not-found");
});

// Fetch user data
var scores = {};
fetch("user.json").then(r => r.json()).then(data => {
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
		},
		members: {
			x: 0,
			a: 0,
			b: 0
		}
	}

	for (let [key, value] of Object.entries(data)) {
		let user = new User(key, value.username, value.guesses, value.wins);
		total.guesses.x += user.guesses.x;
		total.guesses.a += user.guesses.a;
		total.guesses.b += user.guesses.b;
		total.wins.x += user.wins.x;
		total.wins.a += user.wins.a;
		total.wins.b += user.wins.b;
		accuracy += user.getAccuracy();

		let team = user.getTeam();
		if (team) total.members[team]++;

		users.push(user);
	}

	// Stat panel
	document.getElementById("stat-guesses-total").innerHTML = total.guesses.x + total.guesses.a + total.guesses.b;
	document.getElementById("stat-guesses-x").innerHTML = total.guesses.x;
	document.getElementById("stat-guesses-a").innerHTML = total.guesses.a;
	document.getElementById("stat-guesses-b").innerHTML = total.guesses.b;

	document.getElementById("stat-wins-total").innerHTML = total.wins.x + total.wins.a + total.wins.b;
	document.getElementById("stat-wins-x").innerHTML = total.wins.x;
	document.getElementById("stat-wins-a").innerHTML = total.wins.a;
	document.getElementById("stat-wins-b").innerHTML = total.wins.b;

	document.getElementById("stat-unique-players").innerHTML = users.length;

	document.getElementById("stat-members-x").innerHTML = total.members.x;
	document.getElementById("stat-members-a").innerHTML = total.members.a;
	document.getElementById("stat-members-b").innerHTML = total.members.b;
	document.getElementById("stat-members-none").innerHTML = users.length - total.members.x - total.members.a - total.members.b;

	const getAccuracyColor = (accuracy) => {
		return `rgb(${Math.round(255 * Math.min((2 - 2 * accuracy), 1))},
		${Math.round(255 * Math.min((2 * accuracy), 1))}
		,0)`;
	};
	document.getElementById("stat-average-accuracy").innerHTML = `${(100 * accuracy / users.length).toFixed(2)}%`;
	document.getElementById("stat-average-accuracy").style.color = getAccuracyColor(accuracy / users.length);

	document.getElementById("stat-cumulative-accuracy").innerHTML = `${(100 * (total.wins.x + total.wins.a + total.wins.b) / (total.guesses.x + total.guesses.a + total.guesses.b)).toFixed(2)}%`;
	document.getElementById("stat-cumulative-accuracy").style.color = getAccuracyColor((total.wins.x + total.wins.a + total.wins.b) / (total.guesses.x + total.guesses.a + total.guesses.b));

	// Charts
	fillPieChart(document.getElementById("pie-total-guesses"), total.guesses.x, total.guesses.a, total.guesses.b, statTab);
	fillBarGraph(document.getElementById("bar-total-guesses"), total.guesses.x, total.guesses.a, total.guesses.b, statTab);
	fillPieChart(document.getElementById("pie-total-wins"), total.wins.x, total.wins.a, total.wins.b, statTab);
	fillBarGraph(document.getElementById("bar-total-wins"), total.wins.x, total.wins.a, total.wins.b, statTab);
	fillPieChart(document.getElementById("pie-total-members"), total.members.x, total.members.a, total.members.b, statTab);
	fillBarGraph(document.getElementById("bar-total-members"), total.members.x, total.members.a, total.members.b, statTab);

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
	scores.name = [...users].sort((a, b) => User.compareByName(a, b));
	scores.score = [...users].sort((a, b) => User.compareByScore(a, b) === 0 ? User.compareByName(a, b) : User.compareByScore(a, b));
	scores.wins = [...users].sort((a, b) => User.compareByWins(a, b) === 0 ? User.compareByName(a, b) : User.compareByWins(a, b));
	scores.total = [...users].sort((a, b) => User.compareByTotal(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotal(a, b));
	scores.accuracy = [...users].filter(x => x.getTotalGuesses() >= 10).sort((a, b) => User.compareByPercentage(a, b) === 0 ? User.compareByName(a, b) : User.compareByPercentage(a, b));
	scores.x = [...users].sort((a, b) => User.compareByTotalX(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalX(a, b));
	scores.a = [...users].sort((a, b) => User.compareByTotalA(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalA(a, b));
	scores.b = [...users].sort((a, b) => User.compareByTotalB(a, b) === 0 ? User.compareByName(a, b) : User.compareByTotalB(a, b));

	// Award badges
	awardBadges(scores.score, User.compareByScore);
	awardBadges(scores.wins, User.compareByWins);
	awardBadges(scores.total, User.compareByTotal);
	awardBadges(scores.accuracy, User.compareByPercentage);
	awardBadges(scores.x, User.compareByTotalX);
	awardBadges(scores.a, User.compareByTotalA);
	awardBadges(scores.b, User.compareByTotalB);

	// Create leaderboards
	toLeaderboard(scores.score, User.compareByScore, "leaderboard-score");
	toLeaderboard(scores.wins, User.compareByWins, "leaderboard-wins");
	toLeaderboard(scores.total, User.compareByTotal, "leaderboard-total");
	toLeaderboard(scores.accuracy, User.compareByPercentage, "leaderboard-accuracy");
	toLeaderboard(scores.x, User.compareByTotalX, "leaderboard-x");
	toLeaderboard(scores.a, User.compareByTotalA, "leaderboard-a");
	toLeaderboard(scores.b, User.compareByTotalB, "leaderboard-b");

	users.sort((a, b) => User.compareByName(a, b));
});
fetch("stat.json").then(r => r.json()).then(stat => {
	// Stat panel
	document.getElementById("stat-rounds-played-total").innerHTML = stat.total.x + stat.total.a + stat.total.b;
	document.getElementById("stat-rounds-played-x").innerHTML = stat.total.x;
	document.getElementById("stat-rounds-played-a").innerHTML = stat.total.a;
	document.getElementById("stat-rounds-played-b").innerHTML = stat.total.b;

	document.getElementById("stat-streak-x").innerHTML = stat.streak.x;
	document.getElementById("stat-streak-a").innerHTML = stat.streak.a;
	document.getElementById("stat-streak-b").innerHTML = stat.streak.b;

	for (var occurrence of stat.occurrences.splice(-50).reverse()) {
		let div = document.createElement("div");
		div.classList.add(occurrence);
		document.getElementById("stat-last-occurrences").appendChild(div);
	}

	document.getElementById("stat-most-guesses").innerHTML = stat.mostGuesses.value;
	document.getElementById("stat-most-guesses-date").innerHTML = `(${stat.mostGuesses.date})`;

	// Charts
	fillPieChart(document.getElementById("pie-total-occurrences"), stat.total.x, stat.total.a, stat.total.b, statTab);
	fillBarGraph(document.getElementById("bar-total-occurrences"), stat.total.x, stat.total.a, stat.total.b, statTab);
});
