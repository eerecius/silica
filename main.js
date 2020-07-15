// variables
let sandCount = 0;
let reedCount = 0;
let clayCount = 0;

let paperCount = 0;


// functions
function numToDots(number) {
  let extraDots = "";
  switch (number % 5) {
    case 4:
      extraDots = "⁘";
      break;
    case 3:
      extraDots = "⁖";
      break;
    case 2:
      extraDots = "‥";
      break;
    case 1:
      extraDots = "․";
      break;
  }
  document.getElementById("sandCountDisplay").innerHTML = "⁙".repeat((number - (number % 5)) / 5) + extraDots;
}

function gather(gained) {
    sandCount += gained;
    numToDots(sandCount);
}

function tabSwitch(evt, tab) { /* FANK YEW W3SCHOOLS I WUD B NO WHERE WIFFOUT YEW */
	// Declare all variables
	let i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("mainTabContent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
 }

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("navigation");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" shown", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " shown";
} 