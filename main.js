import { playlist } from './playlist.js';
import { setTrack, playAudio, pauseAudio, onTimeUpdate, getAudio, isPlaying } from './player.js';
import { updateNowPlaying, updateProgress, renderPlaylist, highlightCurrentTrack } from './ui.js';

let currentTrackIndex = 0;
let isPlayingState = false;

const playBtn = document.querySelector(".controls .play");
const prevBtn = document.querySelector(".controls button:nth-child(1)");
const nextBtn = document.querySelector(".controls button:nth-child(3)");
const disk = document.querySelector(".disc"); 

const loadAndPlayTrack = () => {
  const track = playlist[currentTrackIndex];
  setTrack(track);
  updateNowPlaying(track);
  highlightCurrentTrack(currentTrackIndex);
  
  playAudio().then(() => {
    isPlayingState = true;
    playBtn.innerHTML = '<i class="fa fa-pause"></i>';
    disk.classList.remove("rotate");
  }).catch(err => {
    console.error("Playback error:", err);
  });
};

// Handle playlist item click
const handlePlaylistItemClick = (index) => {
  if (index === currentTrackIndex && isPlayingState) {
    // If clicking on currently playing track, pause it
    pauseAudio();
    isPlayingState = false;
    playBtn.innerHTML = '<i class="fa fa-play"></i>';
    disk.classList.add("rotate");
  } else {
    // Otherwise, play the selected track
    currentTrackIndex = index;
    loadAndPlayTrack();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Render the playlist initially
  renderPlaylist(playlist, currentTrackIndex, handlePlaylistItemClick);
  
  playBtn.addEventListener("click", () => {
    if (isPlayingState) {
      pauseAudio();
      isPlayingState = false;
      playBtn.innerHTML = '<i class="fa fa-play"></i>';
      disk.classList.add("rotate");
      highlightCurrentTrack(currentTrackIndex); // Update the UI
    } else {
      playAudio().then(() => {
        isPlayingState = true;
        playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        disk.classList.remove("rotate");
        highlightCurrentTrack(currentTrackIndex); // Update the UI
      }).catch(err => {
        console.error("Playback error:", err);
      });
    }
  });

  nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack();
  });

  prevBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack();
  });

  onTimeUpdate(updateProgress);

  // Auto-play next track when current ends
  getAudio().onended = () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack();
  };

  // Update player info
  document.querySelector('.playlist p').textContent = `${playlist.length} items on the playlist`;

  // Initial load
  loadAndPlayTrack();
});