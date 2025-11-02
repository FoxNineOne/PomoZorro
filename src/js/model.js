export const state = {
  //custom times that hopefully I'll retrieve from end user
  workTime: 0.1, // This will be set on the page
  restTime: 0.1, // This  will also be set on the page
  transTime: 0.05, //transition period time
  remainingTime: 0,
  paused: false,
  prePausedMode: null,
  hasStartedLoop: false,
  shouldStop: false,
  intervalId: null,

  currentTime: new Date().getTime(),
  screenStatus: "paused",
  mode: "working",
};

export const tracklist = [
  {
    songName: "Zorro Sonburu",
    artist: "Zorro Sombre",
    filepath: "/tracks/ZorroSonburu.mp3",
  },
];
