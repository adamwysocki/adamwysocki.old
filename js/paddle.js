///////////////////////////////////////////////////////////////////////////////
// PADDLE
//

function Paddle(x,y) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 80;
    this.score = 0;
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.restitution = 1.1;
}

Paddle.prototype.draw = function(p) {
  p.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.getMidX = function() {
  return this.halfWidth + this.x;
};

Paddle.prototype.getMidY = function() {
  return this.halfHeight + this.y;
};

Paddle.prototype.getTop = function() {
  return this.y;
};

Paddle.prototype.getBottom = function() {
  return this.y + this.height;
};

Paddle.prototype.getLeft = function() {
  return this.x;
};

Paddle.prototype.getRight = function() {
  return this.x + this.width;
};

export default Paddle;
