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
import * as view from "./view.js";

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "violet",
  progressColor: "purple",
  backend: "MediaElement",
});

wavesurfer.load(model.tracklist[0].filepath);

//Initalise text fields - will connect to variables when done testing
clockField.textContent = "00:00";
modeField.textContent = "";

//Functions
// This function will develop further, switching screen style, possibly audio volume, and playlist?
const modeTheme = function (mode) {
  switch (model.state.mode) {
    case "working":
      model.state.screenStatus = "working";
      view.updateBackground("working");
      model.state.paused = false;
      break;
    case "resting":
      model.state.screenStatus = "resting";
      view.updateBackground("resting");
      model.state.paused = false;

      break;
    case "transition":
      model.state.screenStatus = "transition";
      view.updateBackground("transition");
      model.state.paused = false;
      break;
    default:
      model.state.screenStatus = "paused";
      view.updateBackground("paused");
      model.state.paused = true;
  }

  // BEGIN TIMER
  console.log(model.state.mode);
  console.log(`${model.state.mode} theme`);
  //WHEN TIMER = 0 , flip the other timer on
  // startTimer( mode === "work" ? "rest" : "work")
};

//Start Timer Function
function startCountdown(timeLimit, mode) {
  return new Promise((resolve) => {
    // Convert the time limit (in minutes) to milliseconds
    model.state.remainingTime = timeLimit * 60 * 1000;

    // Clear the old interval if exists, otherwise ghosts appear
    if (model.state.intervalId) {
      clearInterval(model.state.intervalId);
    }

    // Set up an interval to update the countdown every second
    // The setInterval() function runs a function every 1 second
    // We can then return back the remaining Time to show on screen

    modeTheme(model.state.mode);
    model.state.prePausedMode = model.state.screenStatus; // This is to resume following a pause
    view.updateDisplay(model.state.remainingTime, model.state.screenStatus);

    model.state.intervalId = setInterval(() => {
      // If Paused = true.. pause!
      if (model.state.paused) {
        return;
      } else {
        // Decrease the remaining time by 1 second (1000 milliseconds)
        model.state.remainingTime -= 1000;
      }
      view.updateDisplay(model.state.remainingTime, model.state.screenStatus);

      // If the countdown reaches zero, stop the timer
      if (model.state.remainingTime <= -1) {
        //temp, this will change to toggle, (if work, then rest, vice versa)
        clockField.textContent = "00:00";
        //modeField.textContent = "";
        clearInterval(model.state.intervalId); // Clear the interval

        //BUG: This starts a second early..
        //modeTransition(screenStatus);
        resolve();
      }
    }, 1000);
  });
}

//Loop Function
async function loopTimers() {
  model.state.shouldStop = false; // Clear stop flag when starting fresh

  while (!model.state.shouldStop) {
    modeTheme("working");
    await startCountdown(model.state.workTime, "working");
    if (model.state.shouldStop) break;
    modeTheme("transition");
    await startCountdown(model.state.transTime, "transition");
    if (model.state.shouldStop) break;
    modeTheme("resting");
    await startCountdown(model.state.restTime, "resting");
    if (model.state.shouldStop) break;
    modeTheme("transition");
    await startCountdown(model.state.transTime, "transition");
    if (model.state.shouldStop) break;
  }
}

//Pause Button Functionality
view.btnStartPause.addEventListener("click", async function () {
  if (!model.state.hasStartedLoop) {
    //startCountdown(workTime, "working"); // Countdown timer for 5 minutes
    model.state.hasStartedLoop = true; // for it has, begun!
    model.state.paused = false;
    model.state.screenStatus = "working";
    wavesurfer.play();
    btnStartPause.textContent = "Pause";
    btnReset.textContent = "Reset";
    loopTimers(); //Call the loop function
    return;
  }

  if (!model.state.paused) {
    model.state.prePausedMode = model.state.screenStatus;
    console.log("prePausedMode: ", model.state.prePausedMode);
    model.state.paused = true;
    wavesurfer.pause();
    console.log("Now pausing");
    view.btnStartPause.textContent = "Resume";
    modeTheme("paused");
    return;
  } else {
    model.state.paused = false;
    console.log("should be unpausing");
    wavesurfer.play();
    view.btnStartPause.textContent = "Pause";
    modeTheme(model.state.prePausedMode);
    //debug
    if (!model.state.prePausedMode)
      console.error(` no PrePausedMode being passed!`);
    return;
  }
});

view.btnReset.addEventListener("click", function () {
  console.log(`Resetting`);

  model.state.shouldStop = true; // Stop the loopTimer
  if (model.state.intervalId) clearInterval(model.state.intervalId); // Stop CountdownTimer.. why did I named it intervalId?
  model.state.intervalId = null;

  model.state.paused = false;
  model.state.hasStartedLoop = false;
  model.state.remainingTime = 0;

  view.resetDisplay();
  view.btnStartPause.textContent = "Start";
  view.btnReset.textContent = "  .  ";
});
