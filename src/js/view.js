"use strict";
import * as model from "./model.js";

const body = document.body;
let timerArea = document.getElementById("countdowntimer");
export let progressBarText =
  document.getElementsByClassName(".progressBarText");

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
export const btnSkipMode = document.getElementById("btnSkipMode");
export const btnMute = document.getElementById("btnMute");

export const nowPlaying = document.getElementById("nowPlaying");

export const timeBar = new ProgressBar.SemiCircle("#progressContainer", {
  strokeWidth: 3,
  color: "#00bcd4",
  trailColor: "#eee",
  duration: 140,
  text: {
    // Initial value for text.
    value: "",
    color: "white",
    // Class name for text element.
    className: "progressBarText",
  },
  style: {
    // Text color.
    // Default: same as stroke color (options.color)
    color: "rgba(105, 16, 16, 1)",
    position: "absolute",
    left: "50%",
    top: "50%",
    padding: 0,
    margin: 0,
    // You can specify styles which will be browser prefixed
    transform: {
      prefix: true,
      value: "translate(-50%, -50%)",
    },
  },
  svgStyle: {
    align: "center",
    // Important: make sure that your container has same
    // aspect ratio as the SVG canvas. See SVG canvas sizes above.
    width: "80%",
  },

  from: { color: "#eee" },
  to: { color: "#46bff6ff" },
  step: function (state, circle, attachment) {
    circle.path.setAttribute("stroke", state.color);
  },
});

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
  timeBar.text.textContent = `   ${minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  // The first instance returns NAN, ignore this then move on
  updateProgressBar(model.state.mode);
}

export function updateProgressBar(mode) {
  let progress = "";
  // console.log(document.querySelector("#progressContainer"));
  if (mode === "resting") {
    progress = model.state.elapsedTime / model.state.totalTime();
  }
  if (mode === "working" || mode === "transition") {
    progress = model.state.remainingTime / model.state.totalTime();
  }
  if (!isNaN(progress)) {
    // Update the countdown every second (1000 milliseconds)
    timeBar.animate(progress);
  }
}

export function updateBackground(mode) {
  const colours = {
    working: `linear-gradient(to bottom right, #ffe063ff, #f5d29eac, #ffe063 ,#f5d29eac)`,
    resting: `linear-gradient(to bottom left,  #c2aff0, #c2aff0, #ffee91ff, #c2aff0)`,
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
