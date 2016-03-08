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

Display.prototype.drawPaused = function(p) {
  p.fillText("PAUSED", this.x, this.y);
  p.font="60px Verdana";
};

export default Display;
