const {
  playlist
} = require('../scripts/playlist');

describe('Playlist Data', () => {
  test('playlist should be an array', () => {
    expect(Array.isArray(playlist)).toBe(true);
  });

  test('playlist should contain at least one track', () => {
    expect(playlist.length).toBeGreaterThan(0);
  });

  test('each track in the playlist should have required properties', () => {
    playlist.forEach(track => {
      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('title');
      expect(track).toHaveProperty('artist');
      expect(track).toHaveProperty('src');
      expect(track).toHaveProperty('cover');
      expect(track).toHaveProperty('duration');
    });
  });

  test('track IDs should be unique', () => {
    const ids = playlist.map(track => track.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
