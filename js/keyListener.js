//////////////////////////////////////////////////////////////////////////////
// KEY LISTENER
//

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

KeyListener.prototype.isPressed = function(key) {
  return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback) {
  document.addEventListener("keypress", function(e) {
      if (e.charCode === keyCode) {
          callback(e);
      }
  });
};

export default KeyListener;
