/**
 * @jest-environment jsdom
 */

import {
  setTrack,
  playAudio,
  pauseAudio,
  setVolume,
  getVolume,
  toggleMute,
  muteAudio,
  unmuteAudio,
  getAudio
} from '../scripts/player.js';

describe('player.js audio controls', () => {
  beforeEach(() => {
    // Reset audio element before each test
    getAudio().pause();
    getAudio().src = '';
    getAudio().volume = 1;
    getAudio().muted = false;
  });

  it('sets the track correctly', () => {
    const testTrack = { src: 'song.mp3' };
    setTrack(testTrack);
    expect(getAudio().src).toContain('song.mp3');
  });

  it('plays the audio', async () => {
    const playSpy = jest.spyOn(getAudio(), 'play').mockImplementation(() => Promise.resolve());
    await playAudio();
    expect(playSpy).toHaveBeenCalled();
    playSpy.mockRestore();
  });

  it('pauses the audio', () => {
    const pauseSpy = jest.spyOn(getAudio(), 'pause').mockImplementation(() => {});
    pauseAudio();
    expect(pauseSpy).toHaveBeenCalled();
    pauseSpy.mockRestore();
  });

  it('sets volume within valid range', () => {
    setVolume(0.8);
    expect(getVolume()).toBeCloseTo(0.8);

    setVolume(-1); // too low
    expect(getVolume()).toBe(0);

    setVolume(2); // too high
    expect(getVolume()).toBe(1);
  });

  it('toggles mute state', () => {
    const audio = getAudio();
    audio.muted = false;
    const result = toggleMute();
    expect(result).toBe(true);
    expect(audio.muted).toBe(true);
  });

  it('mutes and unmutes audio', () => {
    muteAudio();
    expect(getAudio().muted).toBe(true);

    unmuteAudio();
    expect(getAudio().muted).toBe(false);
  });
});
