/*
The idea is.. you set the values on the page  to how long you wish to work, and how long to rest. 
So default, you'd work for 25 minutes, and rest for 5.

Need a function to begin a timer. 
From GO.. a timer will count down of how much time left to work (pulled from the workTime values).
The background changes blue , a sound fx plays (like a soft alarm)
Once this reaches 0, the background changes to green.
a new time will count down, from the restTime values
once this reaches 0, a soft alarm fx plays, and it repeats back to workTimer


Build a timer function 
take variables of if it's work or rest (then we can determine timelimits for each and screen status)
this can dictate which timer is shown on screen, and which values.
Simplifies writing timer code twice.

X need a function to start decreasing until reaches 0 

+ Create text values that show work limit, and relax limit, and have them updates back to variable
+ Get Start button to execute function
+ Implement a Pause mode
+ Pause mode kicks in from button
+ Reset mode  - sets status to Working, awaiting start button
  - BONUS have a checkbox to not reset custom times for work/relax

+ Have webpage background change colour dependant on mode
+ implement a music player.. that volumes is louder for work, quieter for relax or vice versa
  +  look at playlisting multiple audio
  + retrieve playlist onto screen. enable, disable ,re order songs
+ over arching pause /plau audio buttons on sitepage
    

// background goes from blue to red

/*
// Function to convert received timeLimit to milliseconds. MIGHT NOT NEED THIS
function convertToMilliseconds(minutes) {
  return minutes * 60 * 1000; // Convert minutes to milliseconds
}
*/

const body = document.body;

let currentTime = new Date().getTime(); // Milliseconds since Unix epoch
let screenStatus = "Paused";
let paused = false;
let prePausedMode;
let timerArea = document.getElementById("countdowntimer");
let clockField = document.getElementById("clockField");
let modeField = document.getElementById("modeField");
const btnPause = document.getElementById("btnPause");

//Vairables for the timer - now needed globally
let hasBegun = false; //needed  for initial deployment
let intervalId = null;
let remainingTime = 0;

//Initalise text fields
clockField.textContent = "00:00";
modeField.textContent = "";

//custom times that hopefully I'll retrieve from end user
let workTime = 0.1; // This will be set on the page
let restTime = 0.1; // This  will also be set on the page
let transTime = 0.05;

/*
COMING SOON - BUTTONS! 
// Start Button
let btnStart = document.createElement("button"); // Create textarea
document.body.append(btnStart);
btnStart.textContent = "Start";
// Pause Button
let btnPause = document.createElement("button"); // Create textarea
document.body.append(btnPause);
btnPause.textContent = "Pause";
// Reset Button
let btnReset = document.createElement("button"); // Create textarea
document.body.append(btnReset);
btnReset.textContent = "Reset";

*/

//Functions
// This function will develop further, switching screen style, possibly audio volume, and playlist?
const modeTheme = function (mode) {
  switch (mode) {
    case "working":
      screenStatus = "working";
      body.style.backgroundColor = "#4bb3fd";
      paused = false;
      break;
    case "resting":
      screenStatus = "resting";
      body.style.backgroundColor = "#c2aff0";
      paused = false;
      break;
    case "transition":
      screenStatus = "transition";
      body.style.backgroundColor = "#e2b6cf";
      paused = false;
      break;
    default:
      screenStatus = "paused";
      body.style.backgroundColor = "#b0c4b1";
      paused = true;
  }

  // BEGIN TIMER
  console.log(`${mode} theme`);
  //WHEN TIMER = 0 , flip the other timer on
  // startTimer( mode === "work" ? "rest" : "work")
};

//Start Timer Function
function startCountdown(timeLimit, mode) {
  return new Promise((resolve) => {
    // Convert the time limit (in minutes) to milliseconds
    remainingTime = timeLimit * 60 * 1000;

    // Clear the old interval if exists, otherwise ghosts appear
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Set up an interval to update the countdown every second
    // The setInterval() function runs a function every 1 second
    // We can then return back the remaining Time to show on screen
    prePausedMode = screenStatus; // This is to resume following a pause
    modeTheme(mode); // This will be used to change bg and colour themes later

    intervalId = setInterval(() => {
      // Calculate the remaining minutes and seconds
      // Math.floor returns integers, always rounds down.
      let minutes = Math.floor(remainingTime / 60000); // 1 minute = 60,000 milliseconds
      let seconds = Math.floor((remainingTime % 60000) / 1000); // Get the remaining seconds

      // Display the remaining time in MM:SS format
      modeField.textContent = `${screenStatus.toUpperCase()}`;
      clockField.textContent = `   ${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;

      // If Paused = true.. pause!
      if (paused) {
        return;
      } else {
        // Decrease the remaining time by 1 second (1000 milliseconds)
        remainingTime -= 1000;
      }

      // If the countdown reaches zero, stop the timer
      if (remainingTime <= -1) {
        //temp, this will change to toggle, (if work, then rest, vice versa)
        clockField.textContent = "00:00";
        //modeField.textContent = "";
        clearInterval(intervalId); // Clear the interval

        //BUG: This starts a second early..
        //modeTransition(screenStatus);

        resolve();
      }
    }, 1000);
    // Update the countdown every second (1000 milliseconds)
  });
}

//Loop Function
async function loopTimers() {
  while (true) {
    await startCountdown(workTime, "working"); //Work Phase
    await startCountdown(transTime, "transition"); //Transition Phase
    await startCountdown(restTime, "resting"); // Rest Phase
    await startCountdown(transTime, "transition"); //Transition Phase
  }
}

//Pause Button Functionality
btnPause.addEventListener("click", async function () {
  //console.log("button click has changed to", paused);

  if (hasBegun === false) {
    //startCountdown(workTime, "working"); // Countdown timer for 5 minutes
    hasBegun = true; // for it has, begun!
    btnPause.textContent = "Click to Pause";
    loopTimers(); //Call the loop function
    return;
  }

  if (paused === false) {
    prePausedMode = screenStatus;
    console.log("prePausedMode: ", prePausedMode);
    paused = true;
    btnPause.textContent = "Paused";
    modeTheme("paused");
  } else {
    paused = false;
    btnPause.textContent = "Click to Pause";
    modeTheme(prePausedMode);
  }
});
