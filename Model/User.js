class User {

	constructor(id, username, guesses = { x: 0, a: 0, b: 0 }, wins = { x: 0, a: 0, b: 0 }) {
		this.id = id;
		this.username = username;
		this.guesses = guesses;
		this.wins = wins;
		this.score = this.getTotalWins() * this.getAccuracy();
		this.badges = { gold: 0, silver: 0, bronze: 0 };
	}

	getTotalGuesses() {
		return this.guesses.x + this.guesses.a + this.guesses.b;
	}
	getTotalWins() {
		return this.wins.x + this.wins.a + this.wins.b;
	}
	getAccuracy() {
		return this.getTotalWins() / this.getTotalGuesses();
	}
	getNameColor() {
		let max = Math.max(this.guesses.x, this.guesses.a, this.guesses.b);
		return `rgb(${Math.round(155 * this.guesses.b / max) + 100},
		${Math.round(155 * this.guesses.a / max) + 100},
		${Math.round(155 * this.guesses.x / max) + 100})`;
	}
	getTeam() {
		const f = (x, y) => { return x ** 1.5 + y ** 1.5 < 0.4 ** 1.5; };
		const total = this.getTotalGuesses();
		if (f(this.guesses.a / total, this.guesses.b / total)) return "x";
		if (f(this.guesses.x / total, this.guesses.b / total)) return "a";
		if (f(this.guesses.x / total, this.guesses.a / total)) return "b";
		return null;
	}
	getAccuracyColor(min = 0, max = 1) {
		let accuracy = this.getAccuracy();
		return `rgb(${Math.round(255 * Math.min(2 * (max - accuracy) / (max - min), 1))},
		${Math.round(255 * Math.min(2 * (accuracy - min) / (max - min), 1))}
		,0)`;
	}

	toLeaderboardRow(rank) {
		let row = document.createElement("tr");
		let cell = document.createElement("td");
		cell.innerHTML = rank;
		switch (rank) {
			case 1:
				cell.style.color = "var(--gold)";
				cell.style.textShadow = "0 0 10px var(--gold), 0 0 10px var(--gold), 0 0 10px var(--gold)";
				row.style.backgroundColor = "var(--background-gold)";
				break;
			case 2:
				cell.style.color = "var(--silver)";
				cell.style.textShadow = "0 0 10px var(--silver), 0 0 10px var(--silver), 0 0 10px var(--silver)";
				row.style.backgroundColor = "var(--background-silver)";
				break;
			case 3:
				cell.style.color = "var(--bronze)";
				cell.style.textShadow = "0 0 10px var(--bronze), 0 0 10px var(--bronze), 0 0 10px var(--bronze)";
				row.style.backgroundColor = "var(--background-bronze)";
				break;
		}
		cell.style.textAlign = "center";
		row.appendChild(cell);

		cell = document.createElement("td");
		let badges = document.createElement("span");
		for (var i = 0; i < this.badges.gold; i++) {
			let badge = document.createElement("span");
			badge.innerHTML = "★";
			badge.classList.add("badge");
			badge.style.color = "var(--gold)";
			badge.style.textShadow = "0 0 10px var(--gold), 0 0 5px #000f";
			badge.style.zIndex = 18 - i;
			badges.appendChild(badge);
		}
		for (var i = 0; i < this.badges.silver; i++) {
			let badge = document.createElement("span");
			badge.innerHTML = "★";
			badge.classList.add("badge");
			badge.style.color = "var(--silver)";
			badge.style.textShadow = "0 0 10px var(--silver), 0 0 5px #000f";
			badge.style.zIndex = 12 - i;
			badges.appendChild(badge);
		}
		for (var i = 0; i < this.badges.bronze; i++) {
			let badge = document.createElement("span");
			badge.innerHTML = "★";
			badge.classList.add("badge");
			badge.style.color = "var(--bronze)";
			badge.style.textShadow = "0 0 10px var(--bronze), 0 0 5px #000f";
			badge.style.zIndex = 6 - i;
			badges.appendChild(badge);
		}
		if (badges.childElementCount !== 0) {
			badges.classList.add("badges");
			cell.appendChild(badges);
		}
		cell.innerHTML += this.username;
		cell.style.color = this.getNameColor();
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = this.score.toFixed(3);
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = this.getTotalWins();
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = this.getTotalGuesses();
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = (100 * this.getAccuracy()).toFixed(2) + "%";
		cell.style.color = this.getAccuracyColor();
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = this.guesses.x;
		row.appendChild(cell);
		
		cell = document.createElement("td");
		cell.innerHTML = this.guesses.a;
		row.appendChild(cell);

		cell = document.createElement("td");
		cell.innerHTML = this.guesses.b;
		row.appendChild(cell);

		return row;
	}

	/**
	 * Compares users by percentage correct.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByPercentage(a, b) {
		let x = 0;
		let y = 0;
		if (a.guesses.x + a.guesses.a + a.guesses.b > 0) x = (a.wins.x + a.wins.a + a.wins.b) / (a.guesses.x + a.guesses.a + a.guesses.b);
		if (b.guesses.x + b.guesses.a + b.guesses.b > 0) y = (b.wins.x + b.wins.a + b.wins.b) / (b.guesses.x + b.guesses.a + b.guesses.b);
		return x < y ? 1 : x === y ? User.compareByTotal(a, b) : -1;
	}

	/**
	 * Compares users by username.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByName(a, b) {
		return a.username.toLowerCase() < b.username.toLowerCase() ? -1 : a.username.toLowerCase() === b.username.toLowerCase() ? 0 : 1;
	}

	/**
	 * Compares users by number of wins.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByWins(a, b) {
		let x = a.wins.x + a.wins.a + a.wins.b;
		let y = b.wins.x + b.wins.a + b.wins.b;
		return x > y ? -1 : x === y ? 0 : 1;
	}

	/**
	 * Compares users by total number of guesses.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByTotal(a, b) {
		let x = a.guesses.x + a.guesses.a + a.guesses.b;
		let y = b.guesses.x + b.guesses.a + b.guesses.b;
		return x > y ? -1 : x === y ? 0 : 1;
	}

	/**
	 * Compares users by total number of 'X' guesses.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByTotalX(a, b) {
		return a.guesses.x > b.guesses.x ? -1 : a.guesses.x === b.guesses.x ? 0 : 1;
	}

	/**
	 * Compares users by total number of 'A' guesses.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByTotalA(a, b) {
		return a.guesses.a > b.guesses.a ? -1 : a.guesses.a === b.guesses.a ? 0 : 1;
	}

	/**
	 * Compares users by total number of 'B' guesses.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByTotalB(a, b) {
		return a.guesses.b > b.guesses.b ? -1 : a.guesses.b === b.guesses.b ? 0 : 1;
	}

	/**
	 * Compares users by score.
	 * 
	 * @param a The user being compared from.
	 * @param b The user being compared to.
	 * @returns -1, 0, or 1.
	 */
	static compareByScore(a, b) {
		return a.score > b.score ? -1 : a.score === b.score ? 0 : 1;
	}

}
