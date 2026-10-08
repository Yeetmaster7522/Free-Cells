// creating the objects
const audio = new AudioPlayer(); // audio player
const ui = new UI_Manager(); // handles the visuals
const game = new GameLoop(); // handles the internal game state and also commands the other classes
const commands = new Commands(); // handles the buttons at the bottom of the screen
const settings = new Settings(); // handles the settings page