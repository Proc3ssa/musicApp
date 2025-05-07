/**
 * @jest-environment jsdom
 */

import {
  formatTime,
  updateNowPlaying,
  updateVolumeUI,
  highlightCurrentTrack
} from '../scripts/ui.js';

describe('ui.js DOM updates', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="inner">
        <b></b>
        <p></p>
      </div>
      <div class="disc"></div>
      <div class="volume-icon"><i></i></div>
      <input class="volume-slider" type="range" />
      <div class="playlist">
        <div class="song" data-index="0">
          <div class="namePic"><i></i></div>
        </div>
        <div class="song" data-index="1">
          <div class="namePic"><i></i></div>
        </div>
      </div>
      <div class="controls">
        <div class="play"><i class="fa fa-pause"></i></div>
      </div>
    `;
  });

  it('formats time correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(-10)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('updates now playing info', () => {
    const track = { artist: 'Artist X', title: 'Track Y', cover: 'cover.jpg' };
    updateNowPlaying(track);

    expect(document.querySelector('.inner b').textContent).toBe('Artist X');
    expect(document.querySelector('.inner p').textContent).toBe('Track Y');
    expect(document.querySelector('.disc').style.backgroundImage).toContain('cover.jpg');
  });

  it('updates volume slider and icon based on volume', () => {
    const slider = document.querySelector('.volume-slider');
    const icon = document.querySelector('.volume-icon i');

    updateVolumeUI(0.8, false);
    expect(slider.value).toBe('80');
    expect(icon.className).toBe('fa fa-volume-up');

    updateVolumeUI(0.3, false);
    expect(icon.className).toBe('fa fa-volume-down');

    updateVolumeUI(0, false);
    expect(icon.className).toBe('fa fa-volume-mute');

    updateVolumeUI(0.5, true);
    expect(icon.className).toBe('fa fa-volume-mute');
  });

  it('highlights current track and updates icons', () => {
    highlightCurrentTrack(1);

    const songs = document.querySelectorAll('.playlist .song');
    expect(songs[0].classList.contains('active')).toBe(false);
    expect(songs[1].classList.contains('active')).toBe(true);

    const icon = songs[1].querySelector('.namePic i');
    expect(icon.className).toBe('fa fa-pause');
  });
});
