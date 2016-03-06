///////////////////////////////////////////////////////////////////////////////
// GAME
//

// IMPORTS
import Ball from './ball.js';
import CollisionDetector from './collisionDetector.js';
import KeyListener from './keyListener.js';
import Paddle from './paddle.js';
import TouchListener from './touchListener.js';
import Display from './display.js';

// CONSTANTS
const PAUSE_KEY = 112;

function Game() {
  const canvas              = document.getElementById("game");
  this.width                = canvas.width;
  this.height               = canvas.height;
  this.context              = canvas.getContext("2d");
  this.context.fillStyle    = "white";
  this.keys                 = new KeyListener();
  this.touches              = new TouchListener(canvas);
  this.collisions           = new CollisionDetector();

  const self = this;

  this.keys.addKeyPressListener(PAUSE_KEY, function(e) {
    if(self.paused) {
      self.paused = false;
    } else {
      self.paused = true;
    }
  });

  this.paused = false;

  this.p1 = new Paddle(5, 0);
  this.p1.y = this.height/2 - this.p1.height/2;
  this.display1 = new Display(this.width/4, 35);

  this.p2 = new Paddle(this.width - 5 - 10, 0);
  this.p2.y = this.height/2 - this.p2.height/2;
  this.display2 = new Display(this.width*3/4, 35);

  this.touches.touchMoveListener = function(touch) {
    if(touch.x < self.width / 2) {
      if(touch.offset.y < 0) {
        self.p1.y = Math.max(0, self.p1.y + touch.offset.y);
      } else {
        self.p1.y = Math.min(self.height - self.p1.height, self.p1.y + touch.offset.y);
      }
    } else if(touch.x > self.width / 2) {
      if(touch.offset.y < 0) {
        self.p2.y = Math.max(0, self.p2.y + touch.offset.y);
      } else {
        self.p2.y = Math.min(self.height - self.p2.height, self.p2.y + touch.offset.y);
      }
    }
  };

  this.ball = new Ball();
  this.ball.x = this.width/2;
  this.ball.y = this.height/2;
  this.ball.vy = Math.floor(Math.random()*8 - 6);
  this.ball.vx = 7 - Math.abs(this.ball.vy);
}

Game.prototype.draw = function() {
  this.context.clearRect(0, 0, this.width, this.height);
  this.context.fillRect(this.width/2, 0, 2, this.height);

  this.ball.draw(this.context);

  this.p1.draw(this.context);
  this.p2.draw(this.context);

  this.display1.draw(this.context);
  this.display2.draw(this.context);
};

Game.prototype.inputs = function() {

  if (this.paused) {
      return;
  }

  this.display1.value = this.p1.score;
  this.display2.value = this.p2.score;

  // To which Y direction the paddle is moving
  if (this.keys.isPressed(83)) { // DOWN
      this.p1.y = Math.min(this.height - this.p1.height, this.p1.y + 4);
  } else if (this.keys.isPressed(87)) { // UP
      this.p1.y = Math.max(0, this.p1.y - 4);
  }

  if (this.keys.isPressed(40)) { // DOWN
      this.p2.y = Math.min(this.height - this.p2.height, this.p2.y + 4);
  } else if (this.keys.isPressed(38)) { // UP
      this.p2.y = Math.max(0, this.p2.y - 4);
  }
};

Game.prototype.update = function() {
  if (this.paused) {
      return;
  }

  this.ball.update();

  if(this.collisions.collideRect(this.ball, this.p2)) {
    this.collisions.resolveElastic(this.ball, this.p2);
  }

  if(this.collisions.collideRect(this.ball, this.p1)) {
    this.collisions.resolveElastic(this.ball, this.p1);
  }


/*
  if (this.ball.vx > 0) {
      if (this.p2.x <= this.ball.x + this.ball.width &&
              this.p2.x > this.ball.x - this.ball.vx + this.ball.width) {
          var collisionDiff = this.ball.x + this.ball.width - this.p2.x;
          var k = collisionDiff/this.ball.vx;
          var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
          if (y >= this.p2.y && y + this.ball.height <= this.p2.y + this.p2.height) {
              // collides with right paddle
              this.ball.x = this.p2.x - this.ball.width;
              this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
              this.ball.vx = -this.ball.vx;
          }
      }
  } else {
      if (this.p1.x + this.p1.width >= this.ball.x) {
          var collisionDiff = this.p1.x + this.p1.width - this.ball.x;
          var k = collisionDiff/-this.ball.vx;
          var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
          if (y >= this.p1.y && y + this.ball.height <= this.p1.y + this.p1.height) {
              // collides with the left paddle
              this.ball.x = this.p1.x + this.p1.width;
              this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
              this.ball.vx = -this.ball.vx;
          }
      }
  }*/

  // Top and bottom collision
  if ((this.ball.vy < 0 && this.ball.y < 0) ||
          (this.ball.vy > 0 && this.ball.y + this.ball.height > this.height)) {
      this.ball.vy = -this.ball.vy;
  }

  // Scoring
  if (this.ball.x >= this.width)
      this.score(this.p1);
  else if (this.ball.x + this.ball.width <= 0)
      this.score(this.p2);
};

Game.prototype.score = function(p) {
  // player scores
  p.score++;

  const player = p == this.p1 ? 0 : 1;

  // set ball position
  this.ball.x = this.width/2;
  this.ball.y = p.y + p.height/2;

  // set ball velocity
  this.ball.vy = Math.floor(Math.random()*8 - 6);
  this.ball.vx = 7 - Math.abs(this.ball.vy);
  if (player == 1)
      this.ball.vx *= -1;
};

export default Game;
