/*
// Function to convert received timeLimit to milliseconds. MIGHT NOT NEED THIS
function convertToMilliseconds(minutes) {
  return minutes * 60 * 1000; // Convert minutes to milliseconds
}
*/

"use strict";
import * as model from "./model.js";
import * as view from "./view.js";

//const progressLine = new ProgressBar.Line("#progressContainer");

const wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "white",
  progressColor: "lightgray",
  backend: "MediaElement",
});

// Music stuff

let playlist = [];

const renderPlaylist = function (playlist) {
  const container = document.getElementById("playlistContainer");
  container.innerHTML = "";

  playlist.forEach((track, index) => {
    const row = document.createElement("div");
    row.classList.add("playlist-item");
    row.draggable = true;
    row.dataset.index = index;
    row.textContent = `${index + 1} ${track.songName}`;
    container.appendChild(row);
  });
};

async function loadTrack(index = model.state.currTrackIndex) {
  const track = playlist[index];
  if (!track) return;
  await wavesurfer.load(track.filepath);
  view.nowPlaying.textContent = `${track.songName} by ${track.artist}`;
  if (!model.state.paused) {
    wavesurfer.play();
  }
}

wavesurfer.on("finish", async function () {
  if (model.state.currTrackIndex < playlist.length - 1) {
    model.state.currTrackIndex++;
  } else {
    model.state.currTrackIndex = 0;
  }
  await loadTrack(model.state.currTrackIndex);
  wavesurfer.play();
});

function changeTrack(direction = 1) {
  // 1 will skip  -1 for previous
  let newIndex = direction + model.state.currTrackIndex;

  // if result is less than 0 (start of playlist), go to end of playlist
  if (newIndex < 0) {
    wavesurfer.waveColor = "red";
    newIndex = playlist.length - 1;
  } // if reach end of playlist, go to start
  else if (newIndex >= playlist.length) {
    wavesurfer.waveColor = "green";
    newIndex = 0;
  }
  //  success
  wavesurfer.waveColor = "blue";
  model.state.currTrackIndex = newIndex;
  loadTrack();
}

//Functions
// This function will develop further, switching screen style, possibly audio volume, and playlist?
const modeTheme = function (modeTheme) {
  model.state.mode = modeTheme;

  if (model.state.mode === "paused") {
    wavesurfer.pause();
    model.state.paused = true;
    model.state.prePausedMode = model.state.screenStatus;
  } else {
    model.state.paused = false;
    model.state.prePausedMode = null;
    wavesurfer.play();
  }

  view.updateBackground(model.state.mode);
  model.state.screenStatus = model.state.mode;
  view.updateDisplay(model.state.remainingTime, model.state.screenStatus);
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

    // variables for time chimes!
    let lowTimePlayed = false;
    let timeOutPlayed = false;

    wavesurfer.setVolume(model.state.volumeLevel);

    model.state.intervalId = setInterval(() => {
      // If Paused = true.. pause!
      if (model.state.paused) {
        return;
      } else {
        // Decrease the remaining time by 1 second (1000 milliseconds)
        model.state.remainingTime -= 1000;
        model.state.elapsedTime += 1000;

        // 5-second warning chime
        if (!lowTimePlayed && model.state.remainingTime <= 10000) {
          lowTimePlayed = true;
          model.state.sndTimeLow.play();
        }
      }
      view.updateDisplay(model.state.remainingTime, model.state.screenStatus);

      // If the countdown reaches zero, stop the timer
      if (model.state.remainingTime < 0 || model.state.shouldSkip) {
        timeOutPlayed = true;
        model.state.sndTimeOut.play();
        clockField.textContent = "00:00";
        view.timeBar.text.textContent = "00:00";

        model.state.elapsedTime = 0;
        model.state.shouldSkip = 0;
        clearInterval(model.state.intervalId); // Clear the interval
        resolve();
      }
    }, 1000);
  });
}

//Loop The Modes Function
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
view.btnPlayPause.addEventListener("click", async function () {
  if (!model.state.isRunning) {
    model.state.isRunning = true; // for it has, begun!
    modeTheme("working");
    loopTimers(); //Call the loop function
    return;
  }

  if (!model.state.paused) {
    modeTheme("paused");
  } else {
    // Resume Music (Short circuiting! if no PrePaused mode, assume return to "working")
    modeTheme(model.state.prePausedMode || "working");
  }
});

view.btnReset.addEventListener("click", function () {
  console.log(`Resetting`);

  model.state.shouldStop = true; // Stop the loopTimer
  if (model.state.intervalId) clearInterval(model.state.intervalId); // Stop CountdownTimer.. why did I named it intervalId?
  model.state.intervalId = null;
  model.state.paused = false;
  model.state.isRunning = false;
  model.state.remainingTime = 0;

  view.resetDisplay();
  view.btnPlayPause.innerHTML =
    '<img src="src/img/btn_play.png" width="50" height="50" align="center" />';
  view.btnReset.innerHTML =
    '<img src="src/img/btn_stop.png" width="50" height="50" align="center" />';

  model.state.elapsedTime = 0;
  wavesurfer.stop();
});

view.btnNext.addEventListener("click", function () {
  changeTrack(1);
});
view.btnPrev.addEventListener("click", function () {
  changeTrack(-1);
});

view.btnSkipMode.addEventListener("click", function () {
  model.state.shouldSkip = true;
});

view.btnMute.addEventListener("click", function (e) {
  // state.mute toggle | if muted , unmute, vice versa
  model.state.isMuted = !model.state.isMuted;
  model.state.isMuted ? wavesurfer.setMuted(true) : wavesurfer.setMuted(false);
  (e.target.class = "btnMute" && model.state.isMuted)
    ? (btnMute.innerHTML = `<img
          src="src/img/btn_mute.png"
          width="50"
          height="50"
          align="center"
          class="btnMute"
        />`)
    : (btnMute.innerHTML = `<img
          src="src/img/btn_unmute.png"
          width="50"
          height="50"
          align="center"
          class="btnMute"
        />`);
});

// !! there's a way I can possibly merge these two event listeners into one..
// Look at JS course.. Pagination buttons did something similar.
view.workTime.addEventListener("change", function (e) {
  model.state.workTime = Number(e.target.value);
  if (model.state.prePausedMode === "working") {
    model.state.remainingTime =
      model.state.workTime * 60 * 1000 - model.state.elapsedTime;
  }
  model.state.mode !== "paused" ? modeTheme("paused") : "";
  view.updateDisplay(model.state.remainingTime, model.state.screenStatus);
});

view.restTime.addEventListener("change", function (e) {
  model.state.restTime = Number(e.target.value);
  if (model.state.prePausedMode === "resting") {
    model.state.remainingTime =
      model.state.restTime * 60 * 1000 - model.state.elapsedTime;
  }
  model.state.mode !== "paused" ? modeTheme("paused") : "";
  view.updateDisplay(model.state.remainingTime, model.state.screenStatus);
});

const init = function () {
  playlist = model.tracklist.filter((track) => track.enabled === true);
  renderPlaylist(playlist);
  clockField.textContent = "00:00";
  modeField.textContent = "press play to begin";
  loadTrack(model.state.currTrackIndex);
  view.timeBar.set(1);
};

init();
