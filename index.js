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
