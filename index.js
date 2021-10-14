const container = document.getElementById("container");
const background1 = document.getElementById("background1");
const background2 = document.getElementById("background2");
const background3 = document.getElementById("background3");
const background4 = document.getElementById("background4");
const background5 = document.getElementById("background5");

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

// Fill background with sequins
for (var i = 0; i < 150; i++) {
	background1.appendChild(generateRandomCircle());
	background2.appendChild(generateRandomCircle());
	background3.appendChild(generateRandomCircle());
	background4.appendChild(generateRandomCircle());
	background5.appendChild(generateRandomCircle());
}

// Background parallax
container.addEventListener("scroll", function(){
	background1.style.bottom = `${-20 * (1 - container.scrollTop / (container.scrollHeight - container.clientHeight))}%`;
	background2.style.bottom = `${-40 * (1 - container.scrollTop / (container.scrollHeight - container.clientHeight))}%`;
	background3.style.bottom = `${-60 * (1 - container.scrollTop / (container.scrollHeight - container.clientHeight))}%`;
	background4.style.bottom = `${-80 * (1 - container.scrollTop / (container.scrollHeight - container.clientHeight))}%`;
	background5.style.bottom = `${-100 * (1 - container.scrollTop / (container.scrollHeight - container.clientHeight))}%`;
});

// Dropdown functionality
let dropdownList = document.getElementsByClassName("dropdown");
for (var dropdown of dropdownList) {
	let head = dropdown.children.item(0);
	let tail = head.nextElementSibling;
	head.addEventListener("click", function() {
		tail.style.maxHeight = this.parentElement.classList.toggle("active") ? `${tail.scrollHeight}px` : null;
	});
}

// Dropdown resized height adjustment
window.addEventListener("resize", function(){
	for (var dropdown of dropdownList) {
		let tail = dropdown.children.item(1);
		if (tail.style.maxHeight) tail.style.maxHeight = `${tail.scrollHeight}px`;
	}
});

// Fetch user data
var scores = {};
var activeLeaderboard = document.getElementById("leaderboard-placeholder");
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
		let table = document.createElement("table");
		let tbody = document.createElement("tbody");
		let tr = document.createElement("tr");
		for (var a of ["#", "Name"]) {
			let th = document.createElement("th");
			th.innerHTML = a;
			tr.appendChild(th);
		}
		for (var a of ["Wins", "Total", "Accuracy", "X", "A", "B"]) {
			let th = document.createElement("th");
			th.innerHTML = a;
			th.classList.add("clickable");
			th.onclick = () => {
				activeLeaderboard.classList.remove("active");
				activeLeaderboard = document.getElementById(`leaderboard-${th.innerHTML.toLowerCase()}`);
				activeLeaderboard.classList.add("active");
			};
			tr.appendChild(th);
		}
		tbody.appendChild(tr);

		var rank = 1;
		for (var i = 0; i < list.length; i++) {
			if (i > 0 && comparator(list[i], list[i - 1]) !== 0) rank = i + 1;
			tbody.appendChild(list[i].toLeaderboardRow(rank));
		}

		table.id = id;
		table.classList.add("leaderboard");
		table.appendChild(tbody);
		container.appendChild(table);
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
