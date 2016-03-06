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

afID = window.requestAnimationFrame(step);
