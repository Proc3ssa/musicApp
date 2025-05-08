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

// Volume control functions
export const setVolume = (level) => {
  const volumeLevel = Math.max(0, Math.min(1, level));
  audio.volume = volumeLevel;
  return volumeLevel;
};

export const getVolume = () => audio.volume;

export const muteAudio = () => {
  audio.muted = true;
  return audio.muted;
};

export const unmuteAudio = () => {
  audio.muted = false;
  return audio.muted;
};

export const toggleMute = () => {
  audio.muted = !audio.muted;
  return audio.muted;
};

export const isPlaying = () => !audio.paused;
export const getAudio = () => audio;

//import these functions using require()
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setTrack,
    playAudio,
    pauseAudio,
    onTimeUpdate,
    setVolume,
    getVolume,
    muteAudio,
    unmuteAudio,
    toggleMute,
    isPlaying,
    getAudio
  };
}