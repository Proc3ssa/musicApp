// ui.js - Updated with volume control functionality

// Helper function (not exported directly to browser, but used by exported functions)
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const updateNowPlaying = (track) => {
  const artistElement = document.querySelector(".inner b");
  const titleElement = document.querySelector(".inner p");
  const discElement = document.querySelector(".disc");

  if (artistElement) artistElement.textContent = track.artist;
  if (titleElement) titleElement.textContent = track.title;
  if (discElement) discElement.style.backgroundImage = `url(${track.cover})`;
};

export const updateProgress = (current, duration) => {
  const progressBar = document.querySelector("progress");
  const start = document.querySelector(".times small:first-child");
  const end = document.querySelector(".times small:last-child");

  if (progressBar && !isNaN(duration) && duration > 0) {
    progressBar.max = duration;
    progressBar.value = current;
  }
  if (start) start.textContent = formatTime(current);
  if (end && !isNaN(duration)) end.textContent = formatTime(duration);
};

export const updateVolumeUI = (volume, isMuted) => {
  const volumeSlider = document.querySelector('.volume-slider');
  const volumeIcon = document.querySelector('.volume-icon i');

  if (volumeSlider) {
    volumeSlider.value = volume * 100;
  }

  if (volumeIcon) {
    if (isMuted || volume === 0) {
      volumeIcon.className = 'fa fa-volume-mute';
    } else if (volume < 0.5) {
      volumeIcon.className = 'fa fa-volume-down';
    } else {
      volumeIcon.className = 'fa fa-volume-up';
    }
  }
};

export const renderPlaylist = (playlistData, currentTrackIndex, onSongClick) => {
  const playlistContainer = document.querySelector('.playlist .list');
  if (!playlistContainer) return;

  playlistContainer.innerHTML = '';

  playlistData.forEach((track, index) => {
    const songElement = document.createElement('div');
    songElement.className = 'song';
    songElement.dataset.index = index;

    const mainPlayIconIsPause = document.querySelector(".controls .play i.fa-pause");
    const iconClass = (index === currentTrackIndex && mainPlayIconIsPause) ? 'fa-pause' : 'fa-play';


    if (index === currentTrackIndex) {
      songElement.classList.add('active');
    }

    songElement.innerHTML = `
      <div class="namePic">
        <b>${String(index + 1).padStart(2, '0')}</b>
        <img src="${track.cover}" alt="album cover" height="40px" width="40px">
        <i class="fa ${iconClass}"></i>
        <b>${track.title}</b>
      </div>
      <div class="artiste">
        <p class="ar">${track.artist}</p>
        <p class="duration">${track.duration}</p>
      </div>
    `;

    songElement.addEventListener('click', () => onSongClick(index, playlistData)); // Pass playlistData to the click handler
    playlistContainer.appendChild(songElement);
  });
  
  // The original code for playlist count had an issue:
  // const countElements = document.querySelectorAll('.artist'); 
  // This targeted elements within each song item.
  // Assuming you meant to update a general playlist info text:
  // This logic was previously in main.js and is better placed there
  // or passed in if ui.js needs to update it.
  return playlistData; // Return the playlist data that was rendered
};

export const highlightCurrentTrack = (index) => {
  document.querySelectorAll('.playlist .song').forEach(song => {
    song.classList.remove('active');
    const icon = song.querySelector('.namePic i');
    if (icon) icon.className = 'fa fa-play'; // Default to play icon
  });

  const currentSong = document.querySelector(`.playlist .song[data-index="${index}"]`);
  if (currentSong) {
    currentSong.classList.add('active');
    const icon = currentSong.querySelector('.namePic i');
    const mainPlayIcon = document.querySelector(".controls .play i"); // Check main play button
    if (icon && mainPlayIcon && mainPlayIcon.classList.contains('fa-pause')) {
        icon.className = 'fa fa-pause';
    } else if (icon) {
        icon.className = 'fa fa-play';
    }
  }
};

// This block allows Jest (a Node.js environment) to import these functions using require()
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateNowPlaying,
    updateProgress,
    renderPlaylist,
    highlightCurrentTrack,
    formatTime, // Also export formatTime for testing as it was in your original conditional export
    updateVolumeUI // Export updateVolumeUI
  };
}
