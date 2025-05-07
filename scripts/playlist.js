// playlist.js
export const playlist = [
  {
    id: 1,
    title: "Najm",
    artist: "husarey",
    src: "./audio/053.mp3",
    cover: "./assets/images/husarey.WEBP",
    duration: "8:39"
  },
  {
      id: 2,
      title: "Faatiha",
      artist: "Haadi Toure",
      src: "./audio/001.mp3",
      cover: "./assets/images/toure.JPG",
      duration: "0:46"
    },
    {
      id: 3,
      title :"Annaas",
      artist: "Ibra Walk",
      src: "./audio/114.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:25"
    },
    {
      id: 4,
      title :"Falak",
      artist: "Ibra Walk",
      src: "./audio/113.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:25"
    },
    {
      id: 5,
      title :"Ikhlas",
      artist: "Ibra Walk",
      src: "./audio/112.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:18"
    },
    {
      id: 6,
      title :"Masad",
      artist: "Ibra Walk",
      src: "./audio/111.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:25"
    },
    {
      id: 7,
      title :"Nasr",
      artist: "Ibra Walk",
      src: "./audio/110.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:25"
    },
    {
      id: 8,
      title :"Kafirun",
      artist: "Ibra Walk",
      src: "./audio/109.mp3",
      cover: "./assets/images/walk.JPG",
      duration: "00:25"
    },
];

// This block allows Jest (a Node.js environment) to import the playlist using require()
if (typeof module !== 'undefined' && module.exports) {
module.exports = {
  playlist
};
}