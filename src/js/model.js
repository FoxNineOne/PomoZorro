export const state = {
  //custom times that hopefully I'll retrieve from end user
  workTime: 0.1, // This will be set on the page
  restTime: 0.1, // This  will also be set on the page
  transTime: 0.05, //transition period time
  mode: "working",
  timer: null,
};

export const tracklist = [
  {
    songName: "Zorro Sonburu",
    artist: "Zorro Sombre",
    filepath: "/tracks/ZorroSonburu.mp3",
  },
];
