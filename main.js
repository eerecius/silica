// resource variables
let sandCount = 0;
let sandCap = 1000;
let reedCount = 0;
let reedCap = 50;
let clayCount = 0;
let clayCap = 50
let paperCount = 0;

// thought
let thoughtArray = ["ugh . . . where am i?"];
let thoughtProg = 0;
let thoughtProgCache = -1;

// unlocks

// game loop/environmental
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
      extraDots = ".";
      break;
  }
  return "⁙".repeat((number - (number % 5)) / 5) + extraDots;
}

function gather(gained) {
    if (sandCount === sandCap - 1) {
		sandCount += gained;
		document.getElementById("gather-msg").innerHTML = "my pockets are full!"
	} else if (Math.random() < lightLevel) {
		sandCount += gained;
		document.getElementById("gather-msg").innerHTML = "i picked up a grain of sand."
	} else {
		document.getElementById("gather-msg").innerHTML = "i dropped the grain of sand."
	}
}

function capResources() {
	if (sandCount > sandCap) {
		sandCount = sandCap;
	};
	if (sandCount === sandCap) {
		document.getElementById("gather-button").disabled = true;
	} else {
		document.getElementById("gather-button").disabled = false;
	};
	if (reedCount > reedCap) {
		reedCount = reedCap;
	};
	if (clayCount > clayCap) {
		clayCount = clayCap;
	};
}

function tabSwitch(evt, tab) { /* FANK YEW W3SCHOOLS I WUD B NO WHERE WIFFOUT YEW */
	// Declare all variables
	let i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tab-content");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
 }

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("navigation");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" shown", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab).style.display = "grid";
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
	
	if (lightLevel < 0.1) {
		lightPhrase = "pitch dark"
	} else if (lightLevel < 0.25) {
		lightPhrase = "dark out"
	} else if (lightLevel < 0.5) {
		lightPhrase = "dim skies"
	} else if (lightLevel < 0.75 && (gameTime > 13.5 || gameTime < 4.5)) {
		lightPhrase = "dawn"
	} else if (lightLevel < 0.75 && (gameTime < 13.5 || gameTime > 4.5)) {
		lightPhrase = "dusk"
	} else if (lightLevel < 0.9) {
		lightPhrase = "light out"
	} else if (lightLevel < 1) {
		lightPhrase = "bright"
	} else if (lightLevel === 1) {
		lightPhrase = "blinding"
	};
	document.getElementById("light-phrase").innerHTML = lightPhrase;
}

function think(thought) {
	thoughtArray.unshift(thought)
}

function doThoughtProg() {
	// generic
	if (gameTime === 9) {
		think("it's getting dark.");
	};
	// plot specific
	if (dayCount === 0) {
		if (gameTime === 0.5) {
			think("a desert. . . and a SANDGLASS?");
		} else if (gameTime === 1) {
			think('<p style = "text-align: center;">SILICA</p>');
		};
	}
}

// game loop
function gameLoop() {
	setTimeout(gameLoop, tickSpeed);
	//basic updates
	changeSkyColor();
	getLightLevel();
	capResources();
	
	//thought array shit
	doThoughtProg();
	if (thoughtArray.length > 15) {
		thoughtArray.splice(15);
	};
	
	//gametime shit
	gameTime += gameTimeRate;
	gameTime = parseFloat(gameTime.toFixed(2));
	if (gameTime >= 18) {
		dayCount += 1;
		gameTime = 0;
		document.getElementById("site-title").innerHTML = "SILICA . day " + dayCount;
	};
	
	//passing variables to page
	document.getElementById("sand-count").innerHTML = numToDots(sandCount);
	document.getElementById("days").innerHTML = dayCount;
	document.getElementById("thought-array").innerHTML = "<li>" + thoughtArray.join("</li><br><li>") + "</li>";
};

setTimeout(gameLoop, tickSpeed);

console.log(document.documentElement.clientWidth);
console.log(document.documentElement.clientHeight);