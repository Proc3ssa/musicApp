/**
 * @jest-environment jsdom
 */

import {
  loadAndPlayTrack,
  handlePlaylistItemClick,
  handleVolumeChange,
  handleMuteToggle
} from '../scripts/main.js';

import { playlist } from '../scripts/playlist.js';
import * as player from '../scripts/player.js';
import * as ui from '../scripts/ui.js';

// Mock dependencies
jest.mock('../scripts/player.js', () => ({
  setTrack: jest.fn(),
  playAudio: jest.fn(() => Promise.resolve()),
  pauseAudio: jest.fn(),
  getAudio: jest.fn(() => ({ muted: false })),
  setVolume: jest.fn(),
  getVolume: jest.fn(() => 0.5),
  toggleMute: jest.fn()
}));

jest.mock('../scripts/ui.js', () => ({
  updateNowPlaying: jest.fn(),
  updateProgress: jest.fn(),
  renderPlaylist: jest.fn(),
  highlightCurrentTrack: jest.fn(),
  updateVolumeUI: jest.fn()
}));

jest.mock('../scripts/playlist.js', () => ({
  playlist: [
    { title: "Track 1", src: "track1.mp3" },
    { title: "Track 2", src: "track2.mp3" }
  ]
}));

beforeEach(() => {
  document.body.innerHTML = `
    <div class="controls">
      <button></button>
      <button class="play"></button>
      <button></button>
    </div>
    <div class="disc"></div>
    <input class="volume-slider" />
    <div class="volume-icon"></div>
  `;

  // Reset mock state
  jest.clearAllMocks();
});

describe('loadAndPlayTrack', () => {
  it('should load and play a valid track without throwing', async () => {
    await loadAndPlayTrack(0);
    expect(player.setTrack).toHaveBeenCalled();
    expect(ui.updateNowPlaying).toHaveBeenCalled();
    expect(player.playAudio).toHaveBeenCalled();
  });
});

describe('handlePlaylistItemClick', () => {
  it('should pause if clicked track is current and playing', () => {
    // Force current track and state
    document.querySelector('.controls .play').innerHTML = '';
    const disk = document.querySelector('.disc');
    player.pauseAudio.mockImplementation(() => {});
    playlist.currentTrackIndex = 0;

    // Simulate click on same track
    handlePlaylistItemClick(0);
    expect(player.pauseAudio).toHaveBeenCalled();
  });

  it('should play a new track if different index is clicked', async () => {
    await loadAndPlayTrack(0); // ensure currentTrackIndex = 0
    handlePlaylistItemClick(1);
    expect(player.setTrack).toHaveBeenCalled();
  });
});

describe('handleVolumeChange', () => {
  it('should update volume and mute state', () => {
    const event = { target: { value: '50' } };
    handleVolumeChange(event);
    expect(player.setVolume).toHaveBeenCalledWith(0.5);
    expect(ui.updateVolumeUI).toHaveBeenCalledWith(0.5, false);
  });

  it('should detect mute if value is 0', () => {
    const event = { target: { value: '0' } };
    handleVolumeChange(event);
    expect(ui.updateVolumeUI).toHaveBeenCalledWith(0, true);
  });
});

describe('handleMuteToggle', () => {
  it('should toggle mute and update volume UI', () => {
    const fakeAudio = { muted: false };
    player.getAudio.mockReturnValue(fakeAudio);

    handleMuteToggle();

    expect(player.toggleMute).toHaveBeenCalled();
    expect(ui.updateVolumeUI).toHaveBeenCalled();
  });
});
