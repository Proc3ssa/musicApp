// main.test.js
import { loadAndPlayTrack, handlePlaylistItemClick, handleVolumeChange, handleMuteToggle } from './main';
import * as playerModule from '../scripts/player';
import * as uiModule from '../scripts/ui';
import { playlist } from '../scripts/playlist';

// Mock the modules
jest.mock('../scripts/player');
jest.mock('../scripts/ui');
jest.mock('../scripts/playlist', () => ({
  playlist: [
    { id: 1, title: 'Track 1', artist: 'Artist 1', src: 'track1.mp3', cover: 'cover1.jpg', duration: '3:45' },
    { id: 2, title: 'Track 2', artist: 'Artist 2', src: 'track2.mp3', cover: 'cover2.jpg', duration: '2:30' }
  ]
}));

describe('Main Module', () => {
  // Setup DOM elements for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="controls">
        <button></button>
        <button class="play"><i class="fa fa-play"></i></button>
        <button></button>
      </div>
      <div class="disc" class="rotate"></div>
      <div class="volume-icon"></div>
      <div class="volume-slider"></div>
      <div class="playlist"><p></p><div class="list"></div></div>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Default mock implementations
    playerModule.playAudio.mockImplementation(() => Promise.resolve());
    playerModule.getAudio.mockImplementation(() => ({
      onended: null
    }));
  });
  
  test('loadAndPlayTrack should set track and play it', async () => {
    const mockTrack = playlist[0];
    
    await loadAndPlayTrack();
    
    expect(playerModule.setTrack).toHaveBeenCalledWith(mockTrack);
    expect(uiModule.updateNowPlaying).toHaveBeenCalledWith(mockTrack);
    expect(uiModule.highlightCurrentTrack).toHaveBeenCalled();
    expect(playerModule.playAudio).toHaveBeenCalled();
    
    // Check UI updates
    expect(document.querySelector('.play').innerHTML).toBe('<i class="fa fa-pause"></i>');
    expect(document.querySelector('.disc').classList.contains('rotate')).toBe(false);
  });
  
  test('loadAndPlayTrack should handle playback errors', async () => {
    // Mock console.error to prevent actual logging during test
    console.error = jest.fn();
    
    // Mock playAudio to reject
    playerModule.playAudio.mockImplementation(() => Promise.reject('Mock error'));
    
    await loadAndPlayTrack();
    
    expect(playerModule.setTrack).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Playback error:', 'Mock error');
  });
  
  test('handlePlaylistItemClick should pause when clicking current track', () => {
    // Set up state for current track playing
    const currentIndex = 0;
    
    handlePlaylistItemClick(currentIndex);
    
    expect(playerModule.pauseAudio).toHaveBeenCalled();
    expect(document.querySelector('.play').innerHTML).toBe('<i class="fa fa-play"></i>');
    expect(document.querySelector('.disc').classList.contains('rotate')).toBe(true);
  });
  
  test('handlePlaylistItemClick should play a new track when clicking different track', () => {
    const newIndex = 1;
    
    // Mock loadAndPlayTrack to check if it's called
    global.loadAndPlayTrack = jest.fn();
    
    handlePlaylistItemClick(newIndex);
    
    expect(global.loadAndPlayTrack).toHaveBeenCalled();
  });
  
  test('handleVolumeChange should update volume settings', () => {
    handleVolumeChange(50);
    
    expect(playerModule.setVolume).toHaveBeenCalledWith(0.5);
    expect(uiModule.updateVolumeUI).toHaveBeenCalledWith(0.5, false);
    
    handleVolumeChange(0);
    
    expect(playerModule.setVolume).toHaveBeenCalledWith(0);
    expect(uiModule.updateVolumeUI).toHaveBeenCalledWith(0, true);
  });
  
  test('handleMuteToggle should toggle mute state', () => {
    playerModule.toggleMute.mockReturnValue(true);
    
    handleMuteToggle();
    
    expect(playerModule.toggleMute).toHaveBeenCalled();
    expect(uiModule.updateVolumeUI).toHaveBeenCalled();
  });
});
