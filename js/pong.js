///////////////////////////////////////////////////////////////////////////////
// MAIN GAME LOOP
//
import Game from './game.js';

// Initialize the game instance
const game  = new Game();
let   afID  = null;

document.getElementById('resume-game').disabled = true;

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
  document.getElementById('resume-game').disabled = false;
  game.resetGame();
  game.showMenu();
  game.paused = false;
};

afID = window.requestAnimationFrame(step);

function resizeWindow() {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  document.getElementById('game').width = w;
  document.getElementById('game').height = h;

  var newWidth = w + "px;";
  var newHeight = h + "px;";

  var newDimensions = "width:" + newWidth + "height:" + newHeight;

  console.log('resume width:', document.getElementById('resume-game').style.width);

  var newLeft = "left:" + (Math.abs(w / 2) - 150) + "px;";
  var newLeft2 = "left:" + (Math.abs(w / 2) - 150) + "px;";

  document.getElementById('wrapper').setAttribute('style', newDimensions);

  document.getElementById('title').setAttribute('style', newLeft);
  document.getElementById('new-game').setAttribute('style', newLeft2);
  document.getElementById('resume-game').setAttribute('style', newLeft2);

  game.width = w;
  game.height = h;
  game.resize();
  game.draw();
}

function doOnOrientationChange()
{
  resizeWindow();
}

resizeWindow();

window.addEventListener('orientationchange', doOnOrientationChange);


window.addEventListener('resize', function(){
  resizeWindow();
}, true);
