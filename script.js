let currentTime = new Date().getTime(); // Milliseconds since Unix epoch
let workTime = 25; // This will be set on the page
let restTime = 5; // This  will also be set on the page
let screenStatus = "Paused";
let paused = false;

// need a function to start decreasing until reaches 0 and the mustc stops..
// background goes from blue to red

// reset timer function

// Function to convert received timeLimit to milliseconds.
function convertToMilliseconds(minutes) {
  return minutes * 60 * 1000; // Convert minutes to milliseconds
}

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
    take variables of if it's work or rest
    this can dictate which timer is shown on screen, and which values.
    Simplifies writing timer code twice.


 */

const startTimer = function (mode) {
  const timeLimit = mode === "work" ? workTime : restTime;

  switch (mode) {
    case "work":
      screenStatus = "Working";
      break;
    case "rest":
      screenStatus = "Resting";
      break;
    default:
      screenStatus = "Paused";
  }
  console.log(screenStatus);

  // BEGIN TIMER
  console.log(`${mode} ` + timeLimit);
  //WHEN TIMER = 0 , flip the other timer on
  // startTimer( mode === "work" ? "rest" : "work")
};

startTimer("work");
startTimer("rest");

function startCountdown(timeLimit, mode) {
  // Convert the time limit (in minutes) to milliseconds
  let remainingTime = timeLimit * 60 * 1000;

  // Set up an interval to update the countdown every second
  // The setInterval() function runs a function every 1 second
  // We can then return back the remaining Time to show on screen
  const intervalId = setInterval(() => {
    // Calculate the remaining minutes and seconds
    // Math.floor returns integers, always rounds down.

    let minutes = Math.floor(remainingTime / 60000); // 1 minute = 60,000 milliseconds
    let seconds = Math.floor((remainingTime % 60000) / 1000); // Get the remaining seconds

    // Display the remaining time in MM:SS format
    console.log(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);

    // Decrease the remaining time by 1 second (1000 milliseconds)
    remainingTime -= 1000;

    // If Paused = true.. pause!
    if (paused) {
      return;
    }

    // If the countdown reaches zero, stop the timer
    if (remainingTime <= 0) {
      clearInterval(intervalId); // Clear the interval
      console.log("Time's up!");
    }
  }, 1000); // Update the countdown every second (1000 milliseconds)
}

// Example usage: Start a countdown for 5 minutes
startCountdown(5, "work"); // Countdown timer for 5 minutes
