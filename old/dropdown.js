let dropdown = document.getElementsByClassName("dropdown");
for (var i = 0; i < dropdown.length; i++) {
	dropdown[i].addEventListener("click", function() {
		this.classList.toggle("dropdown-active");
		let content = this.nextElementSibling;
		let parent = this.parentElement;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
			while (parent.classList.contains("dropdown-content")) {
				parent.style.maxHeight = `${parent.scrollHeight - content.scrollHeight}px`;
				parent = parent.parentElement;
			}
		} else {
			content.style.maxHeight = `${content.scrollHeight}px`;
			while (parent.classList.contains("dropdown-content")) {
				parent.style.maxHeight = `${parent.scrollHeight + content.scrollHeight}px`;
				parent = parent.parentElement;
			}
		} 
	});
}
let description = document.getElementById("description");
description.classList.add("dropdown-active");
description.nextElementSibling.style.maxHeight = `${description.nextElementSibling.scrollHeight}px`;
