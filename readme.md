# Music Application

A simple web-based music player application built with HTML, CSS, and JavaScript.

## Features

- Display a list of artists and a music playlist.
- Play, pause, skip to the next or previous track.
- Adjust volume and mute/unmute the audio.
- Visually indicate the currently playing track in the playlist.
- Progress bar to show track playback progress.

## Project Structure

- `index.html`: The main HTML file defining the structure of the application.
- `style/`: Contains the CSS file for styling the application.
  - `style/style.css`: Styles for the music player UI.
- `scripts/`: Contains the JavaScript files for the application logic.
  - `scripts/main.js`: Main application logic, event handling, and coordination.
  - `scripts/player.js`: Handles audio playback using the HTML5 Audio API.
  - `scripts/playlist.js`: Defines the music playlist data.
  - `scripts/ui.js`: Manages updates to the user interface.
- `assets/`: Contains image and audio assets.
  - `assets/images/`: Album covers and artist images.
  - `assets/audio/`: Audio files for the playlist.
- `test/`: Contains Jest unit tests for the JavaScript modules.
  - `test/main.test.js`: Tests for `scripts/main.js`.
  - `test/player.test.js`: Tests for `scripts/player.js`.
  - `test/playlist.test.js`: Tests for `scripts/playlist.js`.
  - `test/ui.test.js`: Tests for `scripts/ui.js`.
- `babel.config.js`: Babel configuration for Jest.
- `package.json`: Project dependencies and scripts.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Proc3ssa/musicApp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd musicApp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Open the `index.html` file in your web browser to run the application.

## Challenges

(Default section - add your own challenges here)

## Git Workflow

This project follows a standard Git workflow with Pull Requests (PRs).

1. **Branching:** Create a new branch for each feature or bug fix. Use descriptive branch names (e.g., `feature/add-volume-control`, `fix/playback-bug`).
2. **Committing:** Make atomic commits with clear and concise messages.
3. **Pull Requests:**
   - Before creating a PR, ensure your branch is up-to-date with the main branch.
   - Create a PR to merge your branch into the main branch.
   - Provide a clear description of the changes in the PR.
   - Request reviews from other contributors.
   - Address any feedback and make necessary changes.
   - Once approved, merge the PR.

## Testing

The project uses Jest for unit testing.

- Run tests:
  ```bash
  npm test
  ```
- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

Test files are located in the `test/` directory and correspond to the modules in the `scripts/` directory.