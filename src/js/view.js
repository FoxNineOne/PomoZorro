"use strict";
import * as model from "./model.js";

const body = document.body;
let timerArea = document.getElementById("countdowntimer");
let clockField = document.getElementById("clockField");
let modeField = document.getElementById("modeField");

// On Screen Buttons
export const btnStartPause = document.getElementById("btnStartPause");
export const btnReset = document.getElementById("btnReset");

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
    working: "#4bb3fd",
    resting: "#c2aff0",
    transition: "#e2b6cf",
    paused: "#b0c4b1",
  };
  body.style.backgroundColor = colours[mode] || "#b0c4b1";
  if (mode === "paused") {
    btnStartPause.textContent = `▶️`;
  } else {
    btnStartPause.textContent = `⏸️`;
    btnReset.textContent = `⏹️`;
  }
}

export function resetDisplay() {
  clockField.textContent = "00:00";
  modeField.textContent = ">_<";
  updateBackground("paused");
}
