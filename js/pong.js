///////////////////////////////////////////////////////////////////////////////
// MAIN GAME LOOP
//
import Game from './game.js';

// Initialize the game instance
const game = new Game();

let afID = null;

function step(timestamp) {
  afID = requestAnimationFrame(step);
  game.update();
  game.inputs();
  game.draw();
}

document.getElementById('resume-game').onclick = function() {
  game.showMenu();
  game.paused = false;
};

document.getElementById('new-game').onclick = function() {
  game.resetGame();
  game.showMenu();
  game.paused = false;
};


afID = window.requestAnimationFrame(step);
