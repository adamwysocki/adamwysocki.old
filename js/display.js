///////////////////////////////////////////////////////////////////////////////
// DISPLAY
//
function Display(x, y) {
  this.x = x;
  this.y = y;
  this.value = 0;
}

Display.prototype.draw = function(p) {
  p.fillText(this.value, this.x, this.y);
  p.font="30px Verdana";
};

Display.prototype.resize = function(newX) {
  this.x = newX;
};

export default Display;
