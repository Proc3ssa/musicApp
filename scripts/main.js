import { playlist } from './playlist.js';
import {
    setTrack, playAudio, pauseAudio, onTimeUpdate, getAudio,
    setVolume, getVolume, toggleMute
} from './player.js';
import {
    updateNowPlaying, updateProgress, renderPlaylist, highlightCurrentTrack, updateVolumeUI
} from './ui.js';

let currentTrackIndex = 0;
let isPlayingState = false;
let isMuted = false;
let currentVolume = 1.0;

// It's good practice to declare these here and assign in DOMContentLoaded
// To avoid errors if script runs before DOM is ready
let playBtn, prevBtn, nextBtn, disk, volumeBtn, volumeSlider;

const initializeDOMElements = () => {
    playBtn = document.querySelector(".controls .play");
    prevBtn = document.querySelector(".controls button:nth-child(1)");
    nextBtn = document.querySelector(".controls button:nth-child(3)");
    disk = document.querySelector(".disc");
    volumeBtn = document.querySelector(".volume-icon");
    volumeSlider = document.querySelector(".volume-slider");
};

const actualLoadAndPlayTrack = (trackIndexToLoad) => {
    currentTrackIndex = trackIndexToLoad;
    const track = playlist[currentTrackIndex];
    if (!track) {
        console.error("Track not found at index:", currentTrackIndex);
        return;
    }

    setTrack(track);
    updateNowPlaying(track);
    highlightCurrentTrack(currentTrackIndex); // Initial highlight

    playAudio().then(() => {
        isPlayingState = true;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        if (disk) disk.classList.remove("rotate");
        highlightCurrentTrack(currentTrackIndex); // Re-highlight to update icon in playlist
    }).catch(err => {
        console.error("Playback error:", err);
        isPlayingState = false; // Ensure state is correct on error
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
        highlightCurrentTrack(currentTrackIndex); // Re-highlight to update icon in playlist
    });
};

const handlePlaylistItemClick = (index) => {
    if (index === currentTrackIndex && isPlayingState) {
        pauseAudio();
        isPlayingState = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
    } else {
        actualLoadAndPlayTrack(index);
    }
    highlightCurrentTrack(index); // Ensure correct item is highlighted with correct icon
};

const handlePlayPause = () => {
    if (isPlayingState) {
        pauseAudio();
        isPlayingState = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
    } else {
        // If no track is technically "loaded" in the audio element but one is selected,
        // actualLoadAndPlayTrack should be called. Otherwise, just play.
        // For simplicity, we assume a track is always cued up if playlist is not empty.
        playAudio().then(() => {
            isPlayingState = true;
            if (playBtn) playBtn.innerHTML = '<i class="fa fa-pause"></i>';
            if (disk) disk.classList.remove("rotate");
        }).catch(err => {
            console.error("Playback error (handlePlayPause):", err);
            isPlayingState = false;
            if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
            if (disk) disk.classList.add("rotate");
        });
    }
    highlightCurrentTrack(currentTrackIndex);
};

const handleNextTrack = () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    actualLoadAndPlayTrack(currentTrackIndex);
};

const handlePrevTrack = () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length + playlist.length) % playlist.length; // Ensure positive index
    actualLoadAndPlayTrack(currentTrackIndex);
};

const handleVolumeChange = (event) => { // event.target.value
    const value = parseFloat(event.target.value);
    currentVolume = value / 100;
    setVolume(currentVolume);
    isMuted = currentVolume === 0;
    updateVolumeUI(currentVolume, isMuted);
};

const handleMuteToggle = () => {
    const currentlyMuted = getAudio().muted; // Check actual audio muted state
    toggleMute(); // This will flip the state in player.js
    isMuted = getAudio().muted; // Get new state

    if (!isMuted && getVolume() === 0) { // If unmuted and volume was 0
        currentVolume = 0.5; // Set to a default volume
        setVolume(currentVolume);
    } else {
        currentVolume = getVolume(); // Reflect current volume
    }
    updateVolumeUI(currentVolume, isMuted);
};


document.addEventListener("DOMContentLoaded", () => {
    initializeDOMElements(); // Find elements once DOM is loaded

    if (!playlist || playlist.length === 0) {
        console.error("Playlist is empty. Cannot initialize player.");
        const playlistInfoEl = document.querySelector('.playlist p');
        if (playlistInfoEl) playlistInfoEl.textContent = "Playlist is empty.";
        return;
    }

    renderPlaylist(playlist, currentTrackIndex, handlePlaylistItemClick);

    // Add event listeners to slide divs
    const slideElements = document.querySelectorAll('.slide');
    slideElements.forEach(slide => {
        slide.addEventListener('click', () => {
            // Extract artist name from class list (excluding 'slide')
            const artistClass = Array.from(slide.classList).find(className => className !== 'slide');
            if (artistClass) {
                // Filter the playlist by artist
                const filteredPlaylist = playlist.filter(track => track.artist === artistClass);
                renderPlaylist(filteredPlaylist, 0, handlePlaylistItemClick); // Render filtered playlist, start at index 0
                // Optionally, update the playlist count text
                const playlistInfoElement = document.querySelector('.playlist p');
                if (playlistInfoElement) {
                    playlistInfoElement.textContent = `${filteredPlaylist.length} items by ${artistClass}`;
                }
            }
        });
    });

    if (playBtn) playBtn.addEventListener("click", handlePlayPause);
    if (nextBtn) nextBtn.addEventListener("click", handleNextTrack);
    if (prevBtn) prevBtn.addEventListener("click", handlePrevTrack);

    if (volumeBtn) volumeBtn.addEventListener("click", handleMuteToggle);
    if (volumeSlider) volumeSlider.addEventListener("input", handleVolumeChange);

    // Initial track setup (load first track but don't autoplay)
    const initialTrack = playlist[currentTrackIndex];
    if (initialTrack) {
        setTrack(initialTrack);
        updateNowPlaying(initialTrack);
        highlightCurrentTrack(currentTrackIndex);
    }

    updateVolumeUI(currentVolume, isMuted); // Set initial volume display
    if (volumeSlider) volumeSlider.value = currentVolume * 100;


    onTimeUpdate(updateProgress);

    getAudio().onended = () => { // Auto-play next track
        handleNextTrack();
    };

    const playlistInfoElement = document.querySelector('.playlist p');
    if (playlistInfoElement) { // Check if the element exists
        playlistInfoElement.textContent = `${playlist.length} items on the playlist`;
    }

    // The original main.js called loadAndPlayTrack() here.
    // If you want the first track to play automatically on load, uncomment the next line:
    // actualLoadAndPlayTrack(currentTrackIndex);
    // Otherwise, the first track is loaded, and the user needs to click play.
});

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");

console.log("Open modal button element:", openBtn); // Add this line

if (openBtn && modal && closeBtn) { // Add checks to ensure elements exist
    openBtn.addEventListener('click', () => {
        console.log("Open modal button clicked"); // This line should already be there
        modal.style.display = "block";
    });

    closeBtn.addEventListener('click', () => modal.style.display = "none");

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
} else {
    console.error("Modal elements not found. Check IDs in index.html and modal.html");
}


// This block allows Jest (a Node.js environment) to import these functions using require()
// Export functions you intend to unit test from main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Re-exporting imported functions for testing might be redundant if they are tested in their own files.
    // Focus on exporting functions defined *within* main.js if they contain logic worth testing in isolation.
    // For example, if actualLoadAndPlayTrack had more complex logic beyond orchestration.
    // The handlers are good candidates if their logic is complex.
    // For now, keeping it similar to your original structure:
    loadAndPlayTrack: actualLoadAndPlayTrack, // Renamed to avoid conflict, but export as original name
    handlePlaylistItemClick,
    handleVolumeChange, // Note: original took value, now it takes event. Test should adapt.
    handleMuteToggle,
    // Add other functions from main.js you want to test directly
  };
}