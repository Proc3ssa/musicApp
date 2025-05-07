

import { 
    updateNowPlaying, 
    updateProgress, 
    updateVolumeUI, 
    renderPlaylist, 
    highlightCurrentTrack, 
    formatTime 
  } from '../scripts/ui';
  
  describe('UI Module', () => {
    // Setup DOM before tests
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="inner">
          <b></b>
          <p></p>
        </div>
        <div class="disc"></div>
        <progress></progress>
        <div class="times">
          <small></small>
          <small></small>
        </div>
        <div class="volume-slider"></div>
        <div class="volume-icon"><i></i></div>
        <div class="playlist">
          <div class="list"></div>
        </div>
      `;
    });
    
    test('updateNowPlaying should update track info in UI', () => {
      const track = {
        artist: 'Test Artist',
        title: 'Test Title',
        cover: 'test-cover.jpg'
      };
      
      updateNowPlaying(track);
      
      expect(document.querySelector('.inner b').textContent).toBe('Test Artist');
      expect(document.querySelector('.inner p').textContent).toBe('Test Title');
      expect(document.querySelector('.disc').style.backgroundImage).toBe(`url(${track.cover})`);
    });
    
    test('updateProgress should update progress bar and time displays', () => {
      const progressBar = document.querySelector('progress');
      const startTime = document.querySelector('.times small:first-child');
      const endTime = document.querySelector('.times small:last-child');
      
      updateProgress(30, 100);
      
      expect(progressBar.value).toBe(30);
      expect(progressBar.max).toBe(100);
      expect(startTime.textContent).toBe('0:30');
      expect(endTime.textContent).toBe('1:40');
    });
    
    test('updateProgress should handle invalid duration', () => {
      const progressBar = document.querySelector('progress');
      const startTime = document.querySelector('.times small:first-child');
      const endTime = document.querySelector('.times small:last-child');
      
      // Set initial values to check they don't change
      progressBar.value = 10;
      progressBar.max = 50;
      startTime.textContent = '0:10';
      endTime.textContent = '0:50';
      
      updateProgress(30, NaN);
      
      // Values should remain unchanged
      expect(progressBar.value).toBe(10);
      expect(progressBar.max).toBe(50);
      expect(startTime.textContent).toBe('0:10');
      expect(endTime.textContent).toBe('0:50');
    });
    
    test('updateVolumeUI should update volume slider and icon', () => {
      const volumeSlider = document.querySelector('.volume-slider');
      const volumeIcon = document.querySelector('.volume-icon i');
      
      // Test high volume
      updateVolumeUI(0.8, false);
      expect(volumeSlider.value).toBe('80');
      expect(volumeIcon.className).toBe('fa fa-volume-up');
      
      // Test low volume
      updateVolumeUI(0.3, false);
      expect(volumeSlider.value).toBe('30');
      expect(volumeIcon.className).toBe('fa fa-volume-down');
      
      // Test muted
      updateVolumeUI(0.5, true);
      expect(volumeSlider.value).toBe('50');
      expect(volumeIcon.className).toBe('fa fa-volume-mute');
      
      // Test zero volume
      updateVolumeUI(0, false);
      expect(volumeSlider.value).toBe('0');
      expect(volumeIcon.className).toBe('fa fa-volume-mute');
    });
    
    test('renderPlaylist should create playlist items with correct data', () => {
      const mockPlaylist = [
        { id: 1, title: 'Track 1', artist: 'Artist 1', cover: 'cover1.jpg', duration: '3:45' },
        { id: 2, title: 'Track 2', artist: 'Artist 2', cover: 'cover2.jpg', duration: '2:30' }
      ];
      const mockClickHandler = jest.fn();
      
      renderPlaylist(mockPlaylist, 0, mockClickHandler);
      
      const playlistItems = document.querySelectorAll('.playlist .song');
      expect(playlistItems.length).toBe(2);
      
      // Check first item (active)
      expect(playlistItems[0].classList.contains('active')).toBe(true);
      expect(playlistItems[0].querySelector('.namePic b:first-child').textContent).toBe('01');
      expect(playlistItems[0].querySelector('.namePic i').className).toBe('fa fa-pause');
      expect(playlistItems[0].querySelector('.namePic b:last-child').textContent).toBe('Track 1');
      expect(playlistItems[0].querySelector('.artiste .ar').textContent).toBe('Artist 1');
      expect(playlistItems[0].querySelector('.artiste .duration').textContent).toBe('3:45');
      
      // Check second item (not active)
      expect(playlistItems[1].classList.contains('active')).toBe(false);
      expect(playlistItems[1].querySelector('.namePic i').className).toBe('fa fa-play');
      expect(playlistItems[1].querySelector('.namePic b:last-child').textContent).toBe('Track 2');
      
      // Test click handler
      playlistItems[1].click();
      expect(mockClickHandler).toHaveBeenCalledWith(1);
    });
    
    test('highlightCurrentTrack should update active song in playlist', () => {
      // Setup playlist DOM
      const list = document.querySelector('.playlist .list');
      list.innerHTML = `
        <div class="song active" data-index="0">
          <div class="namePic"><i class="fa fa-pause"></i></div>
        </div>
        <div class="song" data-index="1">
          <div class="namePic"><i class="fa fa-play"></i></div>
        </div>
        <div class="song" data-index="2">
          <div class="namePic"><i class="fa fa-play"></i></div>
        </div>
      `;
      
      
      highlightCurrentTrack(1);
      
      const songs = document.querySelectorAll('.playlist .song');
      expect(songs[0].classList.contains('active')).toBe(false);
      expect(songs[1].classList.contains('active')).toBe(true);
      expect(songs[2].classList.contains('active')).toBe(false);
      
      expect(songs[0].querySelector('i').className).toBe('fa fa-play');
      expect(songs[1].querySelector('i').className).toBe('fa fa-pause');
      expect(songs[2].querySelector('i').className).toBe('fa fa-play');
    });
    
    test('formatTime should format seconds to MM:SS format', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(3661)).toBe('61:01');
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(0)).toBe('0:00');
    });
  });
  