// player.js
let audio = new Audio();

export const setTrack = (track) => {
  audio.src = track.src;
  audio.load();
};

export const playAudio = () => audio.play();
export const pauseAudio = () => audio.pause();
export const onTimeUpdate = (callback) => {
  audio.ontimeupdate = () => callback(audio.currentTime, audio.duration);
};

export const isPlaying = () => !audio.paused;
export const getAudio = () => audio;
