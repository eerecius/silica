// resource variables
let sandCount = 0;
let sandCap = 1000;
let reedsCount = 0;
let reedsCap = 50;
let clayCount = 0;
let clayCap = 50;
let paperCount = 0;
let fabricCount = 0;
let fabricCap = 100;

// stats
let sandGathered = 0;
let reedsGathered = 0;
let clayGathered = 0;
let fabricGathered = 0;

// thought
let thoughts = [];
let lightPhrase;

// unlocks
let wanderUnlocked = false;
let logUnlocked = false;
let craftUnlocked = false;

// game loop/environmental
let tickSpeed = 200;
let timeRate = 0.02;
let time = 0;
let dayCount = 0;
let lightLevel = 0;
let sunPosX;
let sunPosY;

// map
let map = [
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
]
let locArray = [];
let mapCache;
let wanderTimer = 6; // set to one higher than desired

//etc
let fadeArray = [];

// functions
function fade(id) {
	let fadeDelay = 0;
	
	document.getElementById(id).style.opacity = 1;
	for (let i = 0; i < fadeArray.length; i++) {
		if (fadeArray[i][0] === id) {
			clearInterval(fadeArray[i][1]);
			fadeArray.splice(i, 1);
			break;
		}
	}
	let fadeInterval =  setInterval(function() {
		fadeDelay += 0.1;
		if (fadeDelay >= 3) {
			document.getElementById(id).style.opacity -= 0.1;
			if (document.getElementById(id).style.opacity <= 0) {
				document.getElementById(id).style.opacity = 0;
				clearInterval(fadeInterval);
				for (let i = 0; i < fadeArray.length; i++) {
					if (fadeArray[i][1] === fadeInterval) {
						fadeArray.splice(i, 1);
						break;
					}
				}
			}
		}
	}, 100);
	fadeArray.push([id, fadeInterval]);
}

function checkUnlocks() {
	if (sandCount > 50 && !wanderUnlocked){
		document.getElementById("wander-button").style.display = "inline";
		think("let's take a look around.");
		wanderUnlocked = true;
		
	}
	if (fabricCount > 0 && !logUnlocked) {
		document.getElementById("log").style.display = "grid";
		document.getElementsByClassName("locked-box")[0].style.display = "none";
		think("a tattered old book in the WRECK. . . well, they're not using it any more!");
		logUnlocked = true;
	}
	if (clayCount > 0 && !craftUnlocked) {
		document.getElementById("craft-nav").style.display = "inline";
		think("i could probably make something out of this.");
		craftUnlocked = true;
	}
}

function refreshMap(id = -1) {
	let mapString = "";
	for (let i = 0; i < 10; i++) {
		mapString = mapString.concat(map[i].join("") + "<br>");
	}
	if (id >= 0) {
		if (document.getElementById(id).classList.contains("wreck")) {
			document.getElementById(id).disabled = true;
			locArray.splice(id, 1);
		} else if (document.getElementById(id).classList.contains("mirage")) {
			for (let j = 0; j < locArray.length; j++) {
				if (locArray[j].length > 1) {
					if (locArray[j][0] === id) {
						locArray[j][1] += 1;
						if (locArray[j][1] === 10) {
							document.getElementById("scavenge-msg").innerHTML = "i shouldn't take any more!";
							fade("scavenge-msg");
							document.getElementById(id).disabled = true;
						}
					}
				}
			}
		}
	}
	return mapString;
}

function scavMirage(id) {
	scavenge("clay", 0.5);
	scavenge("reeds", 1);
	document.getElementById("scavenge-msg").innerHTML = "got clay and reeds from the mirage.";
	playAudio("assets/audio/water.mp3");
	fade("scavenge-msg");
	refreshMap(id);
}

function scavWreck(id) {
	scavenge("fabric", 3);
	document.getElementById("scavenge-msg").innerHTML = "found some fabric scraps in the wreck.";
	playAudio("assets/audio/fabric.mp3");
	fade("scavenge-msg");
	refreshMap(id);
}

function wander() {
	let locId = 0;
	locArray = [];
	playAudio("assets/audio/wander.mp3");
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
    		if (Math.random() < 0.075) {
				map[i].splice(j, 1, ".");
			}
			if (Math.random() < 0.075) {
				map[i].splice(j, 1, "·");
			}
			if (Math.random() < 0.003 && logUnlocked) {
				locArray.push([locId, 0]);
				map[i].splice(j, 1, "<button id='" + locId + "' class=\"map-mats mirage\" onClick = \"scavMirage(" + locId + ")\">m</button>");
				locId += 1;
			} else if (Math.random() < 0.007) {
				locArray.push(locId);
				map[i].splice(j, 1, "<button id='" + locId + "' class=\"map-mats wreck\" onClick = \"scavWreck(" + locId + ")\">w</button>");
				locId += 1;
			}
		}
	}
	document.getElementById("map-container").style.display = "block";
	document.getElementById("map").innerHTML = refreshMap();
	mapCache = map;
	map = [
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	[" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
	]
	
	document.getElementById("wander-button").disabled = true;
	let wanderTimerCache = wanderTimer;
	function timer() {
		wanderTimer--;
		document.getElementById("wander-timer").innerHTML = "(" + wanderTimer + "s)";
		if (wanderTimer === 0) {
			document.getElementById("wander-timer").innerHTML = "(go)";
			document.getElementById("wander-button").disabled = false;
			wanderTimer = wanderTimerCache;
			clearInterval(timerTimer);
		}
	}
	document.getElementById("wander-timer").innerHTML = "(" + wanderTimer + "s)";
	let timerTimer = setInterval(timer, 1000);
	timer()
}

function sleep() {
	time = 0;
	dayCount += 1;
	playAudio("assets/audio/sleep.mp3");
}

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
    if (Math.random() < lightLevel) {
        if ((sandCount + gained) >= sandCap) {
        sandCount += (sandCap - sandCount);
        document.getElementById("gather-msg").innerHTML = "my pockets are full!";
		} else 
			sandCount += gained;
			sandGathered += gained;
			document.getElementById("gather-msg").innerHTML = "picked up a grain of sand.";
			playAudio("assets/audio/pickup.mp3");
	} else {
        document.getElementById("gather-msg").innerHTML = "dropped the grain of sand.";
		playAudio("assets/audio/failed pickup.mp3");
    }
	if (document.getElementById("pockets").style.display !== "inline") {
		document.getElementById("pockets").style.display = "block";
	};
	fade("gather-msg");
}

function scavenge(material, gained) {
	gained *= lightLevel;
	if (material === "clay") {
		if ((clayCount + gained) > clayCap) {
			gained = (clayCap - clayCount);
			document.getElementById("clay-gained").innerHTML = "full!";
		}
		document.getElementById("clay-gained").innerHTML = " +" + gained.toFixed(2);
		clayCount += gained;
		clayGathered += gained;
		fade("clay-gained");
	} else if (material === "reeds") {
		if ((reedsCount + gained) > reedsCap) {
			gained = (reedsCap - reedsCount);
			document.getElementById("reeds-gained").innerHTML = "full!";
		}
		document.getElementById("reeds-gained").innerHTML = " +" + gained.toFixed(2);
		reedsCount += gained;
		reedsGathered += gained;
		fade("reeds-gained");
	} else if (material === "fabric") {
		if ((fabricCount + gained) > fabricCap) {
			gained = (fabricCap - fabricCount);
			document.getElementById("fabric-gained").innerHTML = "full!";
		}
		document.getElementById("fabric-gained").innerHTML = " +" + gained.toFixed(2);
		fabricCount += gained;
		fabricGathered += gained;
		fade("fabric-gained");
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
    }
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
  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " shown";
} 

function changeSkyColor() {
    if (time < 9) {
        sunPosX = (100 * time) / 9;
    } else {
        sunPosX = ((-100 * time) / 9) + 200;
    };
    sunPosY = -70 * Math.sin((Math.PI * time) / 9) + 100;
    document.getElementById("day").style = "background: radial-gradient(circle at " + sunPosX + "% " + sunPosY + "%, #fee2c6, #679980, #679980, #679980); opacity: " + lightLevel + ";";
    document.getElementById("night").style.opacity = 1 - lightLevel;
}

function getLightLevel() {
    lightLevel = ((Math.sin((Math.PI * Math.cos(((Math.PI * time) / 9) - (Math.PI / 2)) / 2)) + 1) / 2) + 0.05;
    if (lightLevel > 1) {
        lightLevel = 1;
    };
    
    if (lightLevel < 0.1) {
        lightPhrase = "pitch dark"
    } else if (lightLevel < 0.25) {
        lightPhrase = "dark out"
    } else if (lightLevel < 0.5) {
        lightPhrase = "dim skies"
    } else if (lightLevel < 0.75 && (time > 13.5 || time < 4.5)) {
        lightPhrase = "dawn"
    } else if (lightLevel < 0.75 && (time < 13.5 || time > 4.5)) {
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
    thoughts.unshift(thought)
	document.getElementById("thought-array").innerHTML = "<li id='new-thought'>" + thoughts.join("</li><br><br><li>") + "</li>";
	document.getElementById("new-thought").style.fontWeight = "bold";
	setTimeout(function(){ document.getElementById("new-thought").style.fontWeight = "normal" }, 3000);
	playAudio("assets/audio/thought.mp3");
}

function doThoughtProg() {
    if (dayCount === 0) {
        if (time === 0) {
			think("ugh. . . where am i?");
		} else if (time === 0.5) {
            think("a desert. . . and a SANDGLASS?");
        } else if (time === 1) {
            think('<p style = "text-align: center;"><br>SILICA<br></p>');
			document.getElementById("gather-button").style.display = "block";
        };
    }
	if (thoughts.length > 15) {
        thoughts.splice(15);
    };
}

function playAudio(sound) {
  new Audio(sound).play();
}

function devMode() {
		document.getElementById("wander-button").style.display = "inline";
		wanderUnlocked = true;
		
		document.getElementById("log").style.display = "grid";
		document.getElementsByClassName("locked-box")[0].style.display = "none";
		logUnlocked = true;

		document.getElementById("craft-nav").style.display = "inline";
		craftUnlocked = true;
		
		document.getElementById("gather-button").style.display = "block";
		
		dayCount = 999;
		wanderTimer = 1;
		
		think("DEV MODE ENABLED")
}

// game loop
//devMode()
//document.getElementById("site-title").innerHTML = "SILICA . day " + dayCount;
function gameLoop() {
    setTimeout(gameLoop, tickSpeed);
	
    //basic updates
    changeSkyColor();
    getLightLevel();
    capResources();
	checkUnlocks();
	
    //thought array shit
    doThoughtProg();
    
    //time shit
    time += timeRate;
    time = parseFloat(time.toFixed(2));
    if (time >= 18) {
        dayCount += 1;
        time = 0;
        document.getElementById("site-title").innerHTML = "SILICA . day " + dayCount;
    };
	if (time > 10 && time < 17) {
		document.getElementById("sleep").style.display = "block";
	} else {
		document.getElementById("sleep").style.display = "none";
	}
    
    //passing variables to page
    document.getElementById("sand-count").innerHTML = numToDots(sandCount);
    document.getElementById("days").innerHTML = dayCount;
	document.getElementById("reeds").innerHTML = reedsCount.toFixed(2);
	document.getElementById("clay").innerHTML = clayCount.toFixed(2);
	document.getElementById("fabric").innerHTML = fabricCount.toFixed(2);
};

gameLoop()