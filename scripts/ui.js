// ui.js - Updated with volume control functionality
export const updateNowPlaying = (track) => {
  document.querySelector(".inner b").textContent = track.artist;
  document.querySelector(".inner p").textContent = track.title;
  document.querySelector(".disc").style.backgroundImage = `url(${track.cover})`;
};

export const updateProgress = (current, duration) => {
  const progressBar = document.querySelector("progress");
  const start = document.querySelector(".times small:first-child");
  const end = document.querySelector(".times small:last-child");

  if (progressBar && !isNaN(duration)) {
    progressBar.max = duration;
    progressBar.value = current;
    start.textContent = formatTime(current);
    end.textContent = formatTime(duration);
  }
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

export const renderPlaylist = (playlist, currentTrackIndex, onSongClick) => {
  const playlistContainer = document.querySelector('.playlist .list');
  playlistContainer.innerHTML = ''; // Clear existing content
  
  playlist.forEach((track, index) => {
    const songElement = document.createElement('div');
    songElement.className = 'song';
    songElement.dataset.index = index;
    
    // Add 'active' class if this is the current track
    if (index === currentTrackIndex) {
      songElement.classList.add('active');
    }
    
    songElement.innerHTML = `
      <div class="namePic">
        <b>${String(index + 1).padStart(2, '0')}</b>
        <img src="${track.cover}" alt="album cover" height="40px" width="40px">
        <i class="fa ${index === currentTrackIndex ? 'fa-pause' : 'fa-play'}"></i>
        <b>${track.title}</b>
      </div>
      <div class="artiste">
        <p class="ar">${track.artist}</p>
        <p class="duration">${track.duration}</p>
      </div>
    `;
    
    // Add click event
    songElement.addEventListener('click', () => onSongClick(index));
    
    playlistContainer.appendChild(songElement);
  });
  
  // Update playlist count
  const countElements = document.querySelectorAll('.artist');
  countElements.forEach(el => {
    el.textContent = `${playlist.artist}`;
  });
};

export const highlightCurrentTrack = (index) => {
  // Remove active class from all songs
  document.querySelectorAll('.playlist .song').forEach(song => {
    song.classList.remove('active');
    song.querySelector('.namePic i').className = 'fa fa-play';
  });
  
  // Add active class to current song
  const currentSong = document.querySelector(`.playlist .song[data-index="${index}"]`);
  if (currentSong) {
    currentSong.classList.add('active');
    currentSong.querySelector('.namePic i').className = 'fa fa-pause';
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

// Export for Jest testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateNowPlaying,
    updateProgress,
    updateVolumeUI,
    renderPlaylist,
    highlightCurrentTrack,
    formatTime: formatTime // Also export the helper function for testing
  };
}