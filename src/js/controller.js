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
"use strict";
import * as config from "./config.js";
import * as model from "./model.js";

const body = document.body;

let currentTime = new Date().getTime(); // Milliseconds since Unix epoch
let screenStatus = "paused";
let paused = false;
let prePausedMode;
let timerArea = document.getElementById("countdowntimer");
let clockField = document.getElementById("clockField");
let modeField = document.getElementById("modeField");

// Pause Button
const btnStartPause = document.getElementById("btnStartPause");
// Reset Button
const btnReset = document.getElementById("btnReset");

//Variables for the timer - now needed globally
let hasStartedLoop = false; //needed  for initial deployment
let intervalId = null;
let remainingTime = 0;

let shouldStop = false; // Needed for reset button. tells the loop to stop

//Initalise text fields - will connect to variables when done testing
clockField.textContent = "00:00";
modeField.textContent = "";

//Functions
// This function will develop further, switching screen style, possibly audio volume, and playlist?
const modeTheme = function (mode) {
  switch (model.state.mode) {
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
  console.log(mode);
  console.log(model.state.mode);
  console.log(`${model.state.mode} theme`);
  //WHEN TIMER = 0 , flip the other timer on
  // startTimer( mode === "work" ? "rest" : "work")
};

//Start Timer Function
function startCountdown(timeLimit, mode) {
  return new Promise((resolve) => {
    // let hasStarted = false;

    // Convert the time limit (in minutes) to milliseconds
    remainingTime = timeLimit * 60 * 1000;

    // Clear the old interval if exists, otherwise ghosts appear
    if (intervalId) {
      clearInterval(intervalId);
    }

    // Set up an interval to update the countdown every second
    // The setInterval() function runs a function every 1 second
    // We can then return back the remaining Time to show on screen

    modeTheme(model.state.mode);
    prePausedMode = screenStatus; // This is to resume following a pause

    updateDisplay();

    intervalId = setInterval(() => {
      // If Paused = true.. pause!
      if (paused) {
        return;
      } else {
        // Decrease the remaining time by 1 second (1000 milliseconds)

        remainingTime -= 1000;
      }
      updateDisplay();

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

    function updateDisplay() {
      //moving these to a function has fixed the mode change before timer start bug

      // Calculate the remaining minutes and seconds
      // Math.floor returns integers, always rounds down.
      let minutes = Math.floor(remainingTime / 60000); // 1 minute = 60,000 milliseconds
      let seconds = Math.floor((remainingTime % 60000) / 1000); // Get the remaining seconds

      // Display the remaining time in MM:SS format
      modeField.textContent = `${screenStatus.toUpperCase()}`;
      clockField.textContent = `   ${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;

      // Update the countdown every second (1000 milliseconds)
    }
  });
}

//Loop Function
async function loopTimers() {
  shouldStop = false; // Clear stop flag when starting fresh

  while (!shouldStop) {
    modeTheme("working");
    await startCountdown(model.state.workTime, "working");
    if (shouldStop) break;
    modeTheme("transition");
    await startCountdown(model.state.transTime, "transition");
    if (shouldStop) break;
    modeTheme("resting");
    await startCountdown(model.state.restTime, "resting");
    if (shouldStop) break;
    modeTheme("transition");
    await startCountdown(model.state.transTime, "transition");
    if (shouldStop) break;
  }
}

//Pause Button Functionality
btnStartPause.addEventListener("click", async function () {
  //console.log("button click has changed to", paused);

  if (!hasStartedLoop) {
    //startCountdown(workTime, "working"); // Countdown timer for 5 minutes
    hasStartedLoop = true; // for it has, begun!
    paused = false;
    screenStatus = "working";
    wavesurfer.play();
    btnStartPause.textContent = "Pause";
    btnReset.textContent = "Reset";
    loopTimers(); //Call the loop function
    return;
  }

  if (!paused) {
    prePausedMode = screenStatus;
    console.log("prePausedMode: ", prePausedMode);
    paused = true;
    wavesurfer.pause();
    console.log("Now pausing");
    btnStartPause.textContent = "Resume";
    modeTheme("paused");
    return;
  } else {
    paused = false;
    console.log("should be unpausing");
    wavesurfer.play();
    btnStartPause.textContent = "Pause";
    modeTheme(prePausedMode);
    return;
  }
});

btnReset.addEventListener("click", function () {
  console.log(`Resetting`);

  shouldStop = true; // Stop the loopTimer
  if (intervalId) clearInterval(intervalId); // Stop CountdownTimer.. why did I named it intervalId?
  intervalId = null;

  paused = false;
  hasStartedLoop = false;
  remainingTime = 0;

  clockField.textContent = "00:00";
  modeField.textContent = ">_<";
  body.style.backgroundColor = "#b0c4b1";
  btnStartPause.textContent = "Start";
  btnReset.textContent = "  .  ";
});

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "violet",
  progressColor: "purple",
  backend: "MediaElement",
});

wavesurfer.load(model.tracklist[0].filepath);
