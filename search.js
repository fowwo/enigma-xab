/**
 * Handles username searches and displays results.
 * 
 * @author fowwo
 */

document.getElementById('search-input').addEventListener('input', (event) => {
	event.target.style.backgroundColor = "#0000";
});
document.getElementById('search-form').addEventListener('submit', (event) => {
	event.preventDefault();
	let input = document.getElementById('search-input');
	if (input.value != "") search(input.value);
});

 /**
  * Searches for a given username.
  * 
  * @param {String} username
  */
function search(username) {
	for (var score of scores) {
		if (score.username.toLowerCase() == username.toLowerCase()) {
			let totalWins = score.wins.x + score.wins.a + score.wins.b;
			let totalGuesses = score.guesses.x + score.guesses.a + score.guesses.b;
			let maxGuess = Math.max(score.guesses.x, score.guesses.a, score.guesses.b);
			document.getElementById("search-result-name").innerHTML = score.username;
			document.getElementById("search-result-name").style.color = `rgb(${Math.round(155 * score.guesses.b / maxGuess) + 100}, ${Math.round(155 * score.guesses.a / maxGuess) + 100}, ${Math.round(155 * score.guesses.x / maxGuess) + 100})`;
			document.getElementById("search-result-wins").innerHTML = totalWins;
			document.getElementById("search-result-guesses").innerHTML = totalGuesses;
			let a = document.getElementById("search-result-accuracy");
			let rgb = `rgb(${Math.round(255 * Math.min((2 - 2 * totalWins / totalGuesses), 1))},${Math.round(255 * Math.min((2 * totalWins / totalGuesses), 1))},0)`;
			a.innerHTML = (100 * totalWins / totalGuesses).toFixed(2) + "%";
			a.style.color = rgb;
			a.style.textShadow = `0 0 10px ${rgb}`;
			document.getElementById("search-result-guesses-x").innerHTML = score.guesses.x;
			document.getElementById("search-result-guesses-a").innerHTML = score.guesses.a;
			document.getElementById("search-result-guesses-b").innerHTML = score.guesses.b;
			document.getElementById("search-results").style.opacity = "100%";
			document.getElementById("search-input").style.backgroundColor = "#0f05";
			return;
		}
		document.getElementById("search-input").style.backgroundColor = "#f005";
	}
}
