// CONSTANTS

var PAUSE_KEY = 112;
var TOUCH_BUFFER = 50;

// GAME

function Game() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.keys = new KeyListener();
    this.touches = new TouchListener(canvas);

    var self = this;

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
      console.log('touch:', JSON.stringify(touch, null, 2));
      console.log('p1:', JSON.stringify(self.p1), 'top:', self.p1.top(), 'bottom:', self.p1.bottom(), 'left:', self.p1.left(), 'right:', self.p1.right());
      console.log('p2:', JSON.stringify(self.p2), 'top:', self.p2.top(), 'bottom:', self.p2.bottom(), 'left:', self.p2.left(), 'right:', self.p2.right());

      if(touch.x < self.width / 2) {
        self.p1.y += touch.offset.y;
      } else if(touch.x > self.width / 2) {
        self.p2.y += touch.offset.y;
      }

/*
      if(touch.y >= self.p1.top() - TOUCH_BUFFER && touch.y <= self.p1.bottom() + TOUCH_BUFFER) {
        if(touch.x >= self.p1.left() - TOUCH_BUFFER && touch.x <= self.p1.right() + TOUCH_BUFFER) {
          self.p1.y += touch.offset.y;
        }
      } else if(touch.y >= self.p2.top() - TOUCH_BUFFER && touch.y <= self.p2.bottom() + TOUCH_BUFFER) {
        if(touch.x >= self.p2.left() - TOUCH_BUFFER && touch.x <= self.p2.right() + TOUCH_BUFFER) {
          console.log('moving p2');
          self.p2.y += touch.offset.y;
        }
      }*/
    };

    this.ball = new Ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.vy = Math.floor(Math.random()*12 - 6);
    this.ball.vx = 7 - Math.abs(this.ball.vy);
}

Game.prototype.draw = function()
{
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillRect(this.width/2, 0, 2, this.height);

    this.ball.draw(this.context);

    this.p1.draw(this.context);
    this.p2.draw(this.context);

    this.display1.draw(this.context);
    this.display2.draw(this.context);
};

Game.prototype.update = function()
{
    if (this.paused)
        return;

    this.ball.update();
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
    }

    // Top and bottom collision
    if ((this.ball.vy < 0 && this.ball.y < 0) ||
            (this.ball.vy > 0 && this.ball.y + this.ball.height > this.height)) {
        this.ball.vy = -this.ball.vy;
    }

    /*
    if (this.ball.x > this.width || this.ball.x + this.ball.width < 0) {
        this.ball.vx = -this.ball.vx;
    } else if (this.ball.y > this.height || this.ball.y + this.ball.height < 0) {
        this.ball.vy = -this.ball.vy;
    }*/

    // Scoring
    if (this.ball.x >= this.width)
        this.score(this.p1);
    else if (this.ball.x + this.ball.width <= 0)
        this.score(this.p2);
};

Game.prototype.score = function(p)
{
    // player scores
    p.score++;
    var player = p == this.p1 ? 0 : 1;

    // set ball position
    this.ball.x = this.width/2;
    this.ball.y = p.y + p.height/2;

    // set ball velocity
    this.ball.vy = Math.floor(Math.random()*12 - 6);
    this.ball.vx = 7 - Math.abs(this.ball.vy);
    if (player == 1)
        this.ball.vx *= -1;
};

// BALL

function Ball() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.width = 10;
    this.height = 10;
    this.radius = 6;
}

Ball.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
};

Ball.prototype.draw = function (p) {
    p.beginPath();
    p.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI, false);
    p.closePath();
    p.fill();
};

// PADDLE

function Paddle(x,y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 60;
    this.score = 0;
}

Paddle.prototype.draw = function(p)
{
    p.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.top = function()
{
    return this.y - this.height / 2;
};

Paddle.prototype.bottom = function()
{
    return this.y + this.height / 2;
};

Paddle.prototype.left = function()
{
    return this.x - this.width / 2;
};

Paddle.prototype.right = function()
{
    return this.x + this.width / 2;
};


// KEY LISTENER

function KeyListener() {
    this.pressedKeys = [];

    this.keydown = function(e) {
        this.pressedKeys[e.keyCode] = true;
    };

    this.keyup = function(e) {
        this.pressedKeys[e.keyCode] = false;
    };

    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}

KeyListener.prototype.isPressed = function(key)
{
    return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
{
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode) {
            callback(e);
        }
    });
};

// TOUCH LISTENER

function TouchListener(element) {
    this.touches = [];
    this.touchMoveListener = function(touch) {};

    element.addEventListener("touchstart", (function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};
        }
    }).bind(this));

    element.addEventListener("touchmove", (function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];
            var previousTouch = this.touches[touch.identifier];
            this.touches[touch.identifier] = {x: touch.clientX, y: touch.clientY};

            var offset = {x: touch.clientX - previousTouch.x, y: touch.clientY - previousTouch.y};
            this.touchMoveListener({x: touch.clientX, y: touch.clientY, offset: offset});
        }
    }).bind(this));

    element.addEventListener("touchend", (function(e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) {
            delete this.touches[e.changedTouches[i].identifier];
        }
    }).bind(this));
}

// DISPLAY

function Display(x, y) {
    this.x = x;
    this.y = y;
    this.value = 0;
}

Display.prototype.draw = function(p)
{
    p.fillText(this.value, this.x, this.y);
    p.font="30px Verdana";
};

// Initialize our game instance
var game = new Game();

function step(timestamp) {
    requestAnimationFrame(step);
    game.update();
    game.draw();
}

window.requestAnimationFrame(step);
