// variables
let sandCount = 0;
let reedCount = 0;
let clayCount = 0;
let paperCount = 0;

let tickSpeed = 200;
let gameTimeRate = 0.02;
let gameTime = 0;
let dayCount = 0;
let lightLevel = 0
let sunPosX;
let sunPosY;

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
  return "⁙".repeat((number - (number % 5)) / 5) + extraDots;
}

function gather(gained) {
    sandCount += gained;
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

function changeSkyColor() {
	if (gameTime < 9) {
		sunPosX = (100 * gameTime) / 9;
	} else {
		sunPosX = ((-100 * gameTime) / 9) + 200;
	};
	sunPosY = -70 * Math.sin((Math.PI * gameTime) / 9) + 100;
	document.getElementById("day").style = "background: radial-gradient(circle at " + sunPosX + "% " + sunPosY + "%, #fee2c6, #679980, #679980, #679980); opacity: " + lightLevel + ";";
	document.getElementById("night").style.opacity = 1 - lightLevel;
}

function getLightLevel() {
	let lightPhrase;

	lightLevel = ((Math.sin((Math.PI * Math.cos(((Math.PI * gameTime) / 9) - (Math.PI / 2)) / 2)) + 1) / 2) + 0.05;
	if (lightLevel > 1) {
		lightLevel = 1;
	};
	if (lightLevel <= 0.06) {
		lightPhrase = "i can't see a thing!";
	} else if (lightLevel < 0.33 && gameTime > 13.5) {
		lightPhrase = "the sun should rise soon.";
	} else if (lightLevel < 0.75 && lightLevel >= 0.33) {
		lightPhrase = "shhhh, watch. . .";
	} else if (lightLevel < 0.9 && gameTime < 4.5) {
		lightPhrase = "it's getting hot already. . .";
	} else if (lightLevel < 1 && gameTime < 4.5) {
		lightPhrase = "sure is bright out here!";
	} else if (lightLevel === 1) {
		lightPhrase = "i can see for miles. . .";
	} else if (lightLevel < 1 && lightLevel >= 0.9 && gameTime > 4.5) {
		lightPhrase = "the shadows are getting long.";
	} else if (lightLevel < 0.9 && lightLevel >= 0.5 && gameTime > 4.5) {
		lightPhrase = "goodbye, sun. . .";
	} else {
		lightPhrase = "it's still warm out. . .";
	}
	;
	document.getElementById("lightPhrase").innerHTML = lightPhrase;
}

// dev functions
function ffw(time) {
	gameTimeRate = time;
}

function timeSet(time) {
	gameTime = time;
}

function giveSand(amt) {
	sandCount += amt;
}

// game loop
window.setInterval(function() {
	changeSkyColor();
	getLightLevel();
	gameTime += gameTimeRate;
	if (gameTime >= 18) {
		dayCount += 1;
		gameTime = 0;
		document.getElementById("siteTitle").innerHTML = "SILICA . day " + dayCount;
	};
	document.getElementById("sandCountDisplay").innerHTML = numToDots(sandCount);
	document.getElementById("gameTimeDisplay").innerHTML = gameTime.toFixed(2);
	document.getElementById("dayCount").innerHTML = dayCount;
	document.getElementById("lightLevel").innerHTML = (lightLevel * 100).toFixed(0);
}, tickSpeed);