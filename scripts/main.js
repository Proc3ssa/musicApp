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
let currentRenderedPlaylist = []; 


let playBtn, prevBtn, nextBtn, disk, volumeBtn, volumeSlider;

const initializeDOMElements = () => {
    playBtn = document.querySelector(".controls .play");
    prevBtn = document.querySelector(".controls button:nth-child(1)");
    nextBtn = document.querySelector(".controls button:nth-child(3)");
    disk = document.querySelector(".disc");
    volumeBtn = document.querySelector(".volume-icon");
    volumeSlider = document.querySelector(".volume-slider");
};

const actualLoadAndPlayTrack = (trackToLoad) => {
    const actualIndexInFullPlaylist = playlist.findIndex(track => track.id === trackToLoad.id);

    if (actualIndexInFullPlaylist === -1) {
        console.error("Track to load not found in the original playlist.");
        return;
    }

    currentTrackIndex = actualIndexInFullPlaylist; 

    setTrack(trackToLoad);
    updateNowPlaying(trackToLoad);
   
    playAudio().then(() => {
        isPlayingState = true;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-pause"></i>';
        if (disk) disk.classList.remove("rotate");

    }).catch(err => {
        console.error("Playback error:", err);
        isPlayingState = false; // Ensure state is correct on error
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
       
    });
};

const handlePlaylistItemClick = (index, currentRenderedPlaylist) => {
    const clickedTrack = currentRenderedPlaylist[index];

    // Find the actual index of the clicked track in the original playlist to update currentTrackIndex
    const actualIndexInFullPlaylist = playlist.findIndex(track => track.id === clickedTrack.id);
     if (actualIndexInFullPlaylist === -1) {
        console.error("Clicked track not found in the original playlist.");
        return;
    }


    if (actualIndexInFullPlaylist === currentTrackIndex && isPlayingState) {
        pauseAudio();
        isPlayingState = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
    } else {
        actualLoadAndPlayTrack(clickedTrack); 
    }
    
    highlightCurrentTrack(index);
};

const handlePlayPause = () => {
    if (isPlayingState) {
        pauseAudio();
        isPlayingState = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa fa-play"></i>';
        if (disk) disk.classList.add("rotate");
    } else {
       
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
    if (currentRenderedPlaylist.length === 0) return; // Prevent errors if playlist is empty

    // Find the index of the currently playing track within the currently rendered playlist
    const currentTrackInRenderedIndex = currentRenderedPlaylist.findIndex(track => track.id === playlist[currentTrackIndex].id);

    if (currentTrackInRenderedIndex === -1) {
        console.error("Current track not found in the rendered playlist.");

        actualLoadAndPlayTrack(currentRenderedPlaylist[0]);
        highlightCurrentTrack(0);
        return;
    }


    const nextTrackInRenderedIndex = (currentTrackInRenderedIndex + 1) % currentRenderedPlaylist.length;
    const nextTrack = currentRenderedPlaylist[nextTrackInRenderedIndex];

    actualLoadAndPlayTrack(nextTrack);
    highlightCurrentTrack(nextTrackInRenderedIndex);
};

const handlePrevTrack = () => {
     if (currentRenderedPlaylist.length === 0) return; // Prevent errors if playlist is empty

    // Find the index of the currently playing track within the currently rendered playlist
    const currentTrackInRenderedIndex = currentRenderedPlaylist.findIndex(track => track.id === playlist[currentTrackIndex].id);

     if (currentTrackInRenderedIndex === -1) {
        console.error("Current track not found in the rendered playlist.");
         // Fallback: if current track not in rendered list, just go to the last track of the rendered list
        actualLoadAndPlayTrack(currentRenderedPlaylist[currentRenderedPlaylist.length - 1]);
        highlightCurrentTrack(currentRenderedPlaylist.length - 1);
        return;
    }

    const prevTrackInRenderedIndex = (currentTrackInRenderedIndex - 1 + currentRenderedPlaylist.length) % currentRenderedPlaylist.length; // Ensure positive index
    const prevTrack = currentRenderedPlaylist[prevTrackInRenderedIndex];

    actualLoadAndPlayTrack(prevTrack);
    highlightCurrentTrack(prevTrackInRenderedIndex);
};

const handleVolumeChange = (event) => { // event.target.value
    const value = parseFloat(event.target.value);
    currentVolume = value / 100;
    setVolume(currentVolume);
    isMuted = currentVolume === 0;
    updateVolumeUI(currentVolume, isMuted);
};

const handleMuteToggle = () => {
    const currentlyMuted = getAudio().muted;
    toggleMute(); //flip the state in player.js
    isMuted = getAudio().muted; // getting new state

    if (!isMuted && getVolume() === 0) { 
        currentVolume = 0.5; // Set to a default volume
        setVolume(currentVolume);
    } else {
        currentVolume = getVolume(); // show current volume
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

    currentRenderedPlaylist = renderPlaylist(playlist, currentTrackIndex, handlePlaylistItemClick); // Assign returned value
    renderArtistSlides(playlist); // Call to render initial artist slides

    

    if (playBtn) playBtn.addEventListener("click", handlePlayPause);
    if (nextBtn) nextBtn.addEventListener("click", handleNextTrack);
    if (prevBtn) prevBtn.addEventListener("click", handlePrevTrack);

    if (volumeBtn) volumeBtn.addEventListener("click", handleMuteToggle);
    if (volumeSlider) volumeSlider.addEventListener("input", handleVolumeChange);

    
    // Initial track setup (load first track but don't autoplay)
    const initialTrack = playlist[currentTrackIndex];
    if (initialTrack) {
        actualLoadAndPlayTrack(initialTrack);
        // Highlight the initial track in the rendered playlist (which is the full playlist initially)
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

});

// Function to render artist slides
const renderArtistSlides = (currentPlaylist) => {
    const slidesContainer = document.querySelector(".slides");
    if (!slidesContainer) {
        console.error("Slides container not found.");
        return;
    }

    slidesContainer.innerHTML = ''; // Clear existing slides

    // Get unique artists
    const artists = [...new Set(currentPlaylist.map(track => track.artist))];

    artists.forEach(artist => {
        // Find the first song by this artist to get a cover image
        const firstSongByArtist = currentPlaylist.find(track => track.artist === artist);
        const coverImage = firstSongByArtist ? firstSongByArtist.cover : './assets/images/default-cover.jpg'; // Use a default if no cover found

        const slideElement = document.createElement('div');
        slideElement.classList.add('slide');

        // Add a class based on the artist name for filtering (clean up artist name for class)
        const artistClass = artist.replace(/[^a-zA-Z0-9]/g, '-');
        slideElement.classList.add(artistClass);

        slideElement.innerHTML = `
            <div class="pic"><img src="${coverImage}" alt="${artist} cover"></div>
            <b>${artist}</b>
        `;

        // filter playlist by artist
        slideElement.addEventListener('click', () => {
            const filteredPlaylist = playlist.filter(track => track.artist === artist);
            currentRenderedPlaylist = renderPlaylist(filteredPlaylist, 0, handlePlaylistItemClick); // Assign returned value
            //  update the playlist count text
            const playlistInfoElement = document.querySelector('.playlist p');
            if (playlistInfoElement) {
                playlistInfoElement.textContent = `${filteredPlaylist.length} items by ${artist}`;
            }
        });

        slidesContainer.appendChild(slideElement);
    });
};


const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");

console.log("Open modal button element:", openBtn); // issue with modal

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

    //aading a new song
    const addSongForm = document.querySelector(".modal-form");
    if (addSongForm) {
        addSongForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const songTitleInput = document.getElementById("songTitle");
            const songArtistInput = document.getElementById("songArtist");
            const songSrcInput = document.getElementById("songSrc");
            const songCoverInput = document.getElementById("songCover");

            if (songTitleInput && songArtistInput && songSrcInput && songCoverInput) {
                const newSong = {
                    title: songTitleInput.value,
                    artist: songArtistInput.value,
                    src: songSrcInput.files.length > 0 ? URL.createObjectURL(songSrcInput.files[0]) : '', // Use createObjectURL for audio file
                    cover: songCoverInput.files.length > 0 ? URL.createObjectURL(songCoverInput.files[0]) : '', // Use createObjectURL for cover image
                    duration: "00:01"
                };

                playlist.push(newSong); // Add new song to the playlist array
                currentRenderedPlaylist = renderPlaylist(playlist, currentTrackIndex, handlePlaylistItemClick); // Re-render the main playlist and assign
                renderArtistSlides(playlist); // Re-render artist slides

                // Close the modal and clear the form
                if (modal) modal.style.display = "none";
                songTitleInput.value = '';
                songArtistInput.value = '';
               
                // update the playlist count text
                const playlistInfoElement = document.querySelector('.playlist p');
                if (playlistInfoElement) {
                    playlistInfoElement.textContent = `${playlist.length} items on the playlist`;
                }

            } else {
                console.error("One or more song input elements not found.");
            }
        });
    } else {
        console.error("Add song form element not found.");
    }


// Export export for unit test
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    
    loadAndPlayTrack: actualLoadAndPlayTrack, 
    handlePlaylistItemClick,
    handleVolumeChange, 
    handleMuteToggle,
  };
}