
import { 
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
  } from '../scripts/player';
  
  // Mock the HTMLAudioElement
  jest.mock('./player', () => {
    const originalModule = jest.requireActual('./player');
    
    // Create a mock audio object
    const mockAudio = {
      src: '',
      volume: 1,
      muted: false,
      paused: true,
      currentTime: 0,
      duration: 100,
      play: jest.fn().mockImplementation(() => Promise.resolve()),
      pause: jest.fn(),
      load: jest.fn(),
      ontimeupdate: null
    };
    
    return {
      ...originalModule,
      getAudio: jest.fn().mockImplementation(() => mockAudio)
    };
  });
  
  describe('Player Module', () => {
    let audio;
    
    beforeEach(() => {
      // Get the mock audio object before each test
      audio = getAudio();
      
      // Reset mock function calls
      jest.clearAllMocks();
    });
    
    test('setTrack should set audio source and load it', () => {
      const track = { src: 'test-audio.mp3' };
      setTrack(track);
      
      expect(audio.src).toBe(track.src);
      expect(audio.load).toHaveBeenCalled();
    });
    
    test('playAudio should call audio.play', async () => {
      await playAudio();
      expect(audio.play).toHaveBeenCalled();
    });
    
    test('pauseAudio should call audio.pause', () => {
      pauseAudio();
      expect(audio.pause).toHaveBeenCalled();
    });
    
    test('onTimeUpdate should set the ontimeupdate handler', () => {
      const callback = jest.fn();
      onTimeUpdate(callback);
      
      // Simulate timeupdate event
      audio.ontimeupdate();
      
      expect(callback).toHaveBeenCalledWith(audio.currentTime, audio.duration);
    });
    
    test('setVolume should set audio volume and clamp values', () => {
      expect(setVolume(0.5)).toBe(0.5);
      expect(audio.volume).toBe(0.5);
      
      expect(setVolume(2)).toBe(1); // Should clamp to max 1
      expect(audio.volume).toBe(1);
      
      expect(setVolume(-1)).toBe(0); // Should clamp to min 0
      expect(audio.volume).toBe(0);
    });
    
    test('getVolume should return current audio volume', () => {
      audio.volume = 0.75;
      expect(getVolume()).toBe(0.75);
    });
    
    test('muteAudio should mute audio and return true', () => {
      expect(muteAudio()).toBe(true);
      expect(audio.muted).toBe(true);
    });
    
    test('unmuteAudio should unmute audio and return false', () => {
      audio.muted = true;
      expect(unmuteAudio()).toBe(false);
      expect(audio.muted).toBe(false);
    });
    
    test('toggleMute should toggle mute state', () => {
      audio.muted = false;
      expect(toggleMute()).toBe(true);
      expect(audio.muted).toBe(true);
      
      expect(toggleMute()).toBe(false);
      expect(audio.muted).toBe(false);
    });
    
    test('isPlaying should return true if audio is not paused', () => {
      audio.paused = true;
      expect(isPlaying()).toBe(false);
      
      audio.paused = false;
      expect(isPlaying()).toBe(true);
    });
  });