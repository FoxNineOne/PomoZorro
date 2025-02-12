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

let currentTime = new Date().getTime(); // Milliseconds since Unix epoch
let workTime = 25; // This will be set on the page
let restTime = 5; // This  will also be set on the page
let screenStatus = "Paused";
let paused = false;

//Time Field
let textArea = document.createElement("textarea"); // Create textarea
document.body.append(textArea); // Add it to the page
// Mode Field
let modeField = document.createElement("textarea"); // Create textarea
document.body.append(modeField); // Add it to the page
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

const modeTheme = function (mode) {
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
  console.log(`${mode} theme`);
  //WHEN TIMER = 0 , flip the other timer on
  // startTimer( mode === "work" ? "rest" : "work")
};

function startCountdown(timeLimit, mode) {
  // This will be used to change bg and colour themes later

  modeTheme(mode);

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
    modeField.value = `${screenStatus.toUpperCase()}`;
    textArea.value = `   ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    // console.log(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`);

    // Decrease the remaining time by 1 second (1000 milliseconds)
    remainingTime -= 1000;

    // If Paused = true.. pause!
    if (paused) {
      return;
    }

    // If the countdown reaches zero, stop the timer
    if (remainingTime <= 0) {
      clearInterval(intervalId); // Clear the interval
      textArea.value = "Time's up!";
      console.log("Time's up!");
    }
  }, 1000); // Update the countdown every second (1000 milliseconds)
}

// Example usage: Start a countdown for 5 minutes
startCountdown(5, "work"); // Countdown timer for 5 minutes
