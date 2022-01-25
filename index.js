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
		tab.addEventListener("click", () => {
			if (activeScreen.id !== "statistics-container") {
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
			}
		});
	}
}
function fillBarGraph(bar, x, a, b, tab) {
	const total = x + a + b;
	const max = Math.max(x, a, b);

	const xBar = document.createElement("li");
	const aBar = document.createElement("li");
	const bBar = document.createElement("li");
	xBar.classList.add("x");
	aBar.classList.add("a");
	bBar.classList.add("b");
	bar.appendChild(xBar);
	bar.appendChild(aBar);
	bar.appendChild(bBar);

	xBar.innerHTML = `${x} <span>(${(100 * x / total).toFixed(2)}%)</span>`;
	aBar.innerHTML = `${a} <span>(${(100 * a / total).toFixed(2)}%)</span>`;
	bBar.innerHTML = `${b} <span>(${(100 * b / total).toFixed(2)}%)</span>`;

	if (tab) {
		const list = [ `${100 * x / max}%`, `${100 * a / max}% `, `${100 * b / max}%` ];
		tab.addEventListener("click", () => {
			if (activeScreen.id !== "statistics-container") {
				const animateOptions = { easing: "ease", fill: "forwards", duration: 1500 };
				for (var i = 0; i < bar.children.length; i++) {
					let child = bar.children[i];
					child.animate([
						{ width: "0%" },
						{ width: list[i] }
					], animateOptions);
				}
			}
		});
	}
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
		},
		members: {
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

		if (value.guesses.x > value.guesses.a && value.guesses.x > value.guesses.b) total.members.x++;
		else if (value.guesses.a > value.guesses.x && value.guesses.a > value.guesses.b) total.members.a++;
		else if (value.guesses.b > value.guesses.a && value.guesses.b > value.guesses.x) total.members.b++;
	}

	fillPieChart(document.getElementById("pie-total-occurrences"), stat.x, stat.a, stat.b, statTab);
	fillBarGraph(document.getElementById("bar-total-occurrences"), stat.x, stat.a, stat.b, statTab);
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
