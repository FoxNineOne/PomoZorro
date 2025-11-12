"use strict";
import * as model from "./model.js";

const body = document.body;
let timerArea = document.getElementById("countdowntimer");
let clockField = document.getElementById("clockField");
let modeField = document.getElementById("modeField");
export let workTime = document.getElementById("workTime");
export let restTime = document.getElementById("restTime");
// On Screen Buttons
export const btnPlayPause = document.getElementById("btnStartPause");
export const btnReset = document.getElementById("btnReset");
export const btnNext = document.getElementById("btnNext");
export const btnPrev = document.getElementById("btnPrev");
export const btnSongSkip = document.getElementsByClassName(".songskip");
export const btnSkipMode = document.getElementById("SkipMode");
export const btnMute = document.getElementById("btnMute");

export const nowPlaying = document.getElementById("nowPlaying");

export function updateDisplay() {
  // Calculate the remaining minutes and seconds
  // Math.floor returns integers, always rounds down.
  let minutes = Math.floor(model.state.remainingTime / 60000); // 1 minute = 60,000 milliseconds
  let seconds = Math.floor((model.state.remainingTime % 60000) / 1000); // Get the remaining seconds
  // Display the remaining time in MM:SS format
  modeField.textContent = `${model.state.screenStatus.toUpperCase()}`;
  clockField.textContent = `   ${minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  // Update the countdown every second (1000 milliseconds)
}

export function updateBackground(mode) {
  const colours = {
    //working: "#4bb3fd",
    working: `linear-gradient(to bottom right, #ffe063ff, #f5d29eac, #ffe063 ,#f5d29eac)`,
    resting: `linear-gradient(to bottom left,  #c2aff0, #c2aff0, white, #c2aff0)`,
    transition: `linear-gradient(to top, white, #e2b6cf)`,
    paused: `linear-gradient( to bottom right,
    rgb(187, 237, 189),
    rgba(210, 247, 212, 1),
    #a3ddebff,
    rgb(187, 237, 189))`,
  };
  body.style.backgroundImage =
    colours[mode] || `linear-gradient(to top, #a3ddebff , #a7f5abff)`;
  if (mode === "paused") {
    btnStartPause.innerHTML =
      '<img src="src/img/btn_play.png" width="50" height="50"  align="center"/>';
  } else {
    btnStartPause.innerHTML =
      '<img src="src/img/btn_pause.png" width="50"  height="50"  align="center" />';

    btnReset.innerHTML =
      '<img src="src/img/btn_stop.png" width="50" height="50"  align="center"/>';
  }
}

export function resetDisplay() {
  clockField.textContent = "00:00";
  modeField.textContent = ">_<";
  updateBackground("paused");
}

export function updateButton(button) {}
