//////////////////////////////////////////////////////////////////////////////
// BALL
//

function Ball() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 1;
    this.ay = 1;
    this.width = 14;
    this.height = 14;
    this.halfHeight = this.height / 2;
    this.halfWidth = this.width / 2;
    this.radius = 6;
    this.restitution = 2;
}

Ball.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
};

Ball.prototype.draw = function (p) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;

    p.beginPath();
    p.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    p.closePath();
    p.fill();
};

Ball.prototype.getMidX = function() {
  return this.halfWidth + this.x;
};

Ball.prototype.getMidY = function() {
  return this.halfHeight + this.y;
};

Ball.prototype.getTop = function() {
  return this.y;
};

Ball.prototype.getBottom = function() {
  return this.y + this.height;
};

Ball.prototype.getLeft = function() {
  return this.x;
};

Ball.prototype.getRight = function() {
  return this.x + this.width;
};

export default Ball;
