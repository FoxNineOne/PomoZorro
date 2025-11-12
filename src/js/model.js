export const state = {
  //custom times that hopefully I'll retrieve from end user
  workTime: 25, // This will be set on the page
  restTime: 5, // This  will also be set on the page
  transTime: 0.1, //transition period time
  elapsedTime: 0,
  remainingTime: 0,
  paused: true,
  prePausedMode: null,
  isRunning: false,
  shouldStop: false,
  intervalId: null,

  currentTime: new Date().getTime(),
  screenStatus: "paused",
  mode: "working",

  currTrackIndex: 0,
  isMuted: false,
  volumeLevel: 100,
};

export const tracklist = [
  {
    songName: "In'utsuna",
    artist: "Zorro Sombre",
    filepath: "/src/tracks/ZorroSonburu.mp3",
    enabled: true,
  },
  {
    songName: "Sleepy Mondays",
    artist: "Zorro Sombre",
    filepath: "/src/tracks/SleepyMondays.mp3",
    enabled: true,
  },
  {
    songName: "Just a Minute",
    artist: "Zorro Sombre",
    filepath: "/src/tracks/GiveMeJustAMinute.mp3",
    enabled: true,
  },
  {
    songName: "One Gun",
    artist: "Jiji Fox",
    filepath: "/src/tracks/OneGun.mp3",
    enabled: true,
  },
  {
    songName: "Night Walk",
    artist: "Jiji Fox",
    filepath: "/src/tracks/NightWalk.mp3",
    enabled: true,
  },
  {
    songName: "Soft Soul",
    artist: "Jiji Fox",
    filepath: "/src/tracks/SoftSundaySoul.mp3",
    enabled: true,
  },
];
