///////////////////////////////////////////////////////////////////////////////
// TOUCH LISTENER
//

function TouchListener(element) {
  this.touches = [];
  this.touchMoveListener = function(touch) {};
  this.doubleTapListener = function() {};
  this.timeout = 0;
  this.lastTap = 0;

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

      var offset = {x: touch.clientX - previousTouch.x,
                    y: touch.clientY - previousTouch.y};
      this.touchMoveListener({x: touch.clientX,
                              y: touch.clientY, offset: offset});
    }
  }).bind(this));

  element.addEventListener("touchend", (function(e) {

    for (let i = 0; i < e.changedTouches.length; i++) {
      delete this.touches[e.changedTouches[i].identifier];
    }

    let currentTime   = new Date().getTime();
    let tapLength     = currentTime - lastTap;

    clearTimeout(timeout);

    if (tapLength < 500 && tapLength > 0) {
        // this was a double tap
        this.doubleTapListener();
        event.preventDefault();
    } else {
        timeout = setTimeout(function() {
            clearTimeout(timeout);
        }, 500);
    }

    lastTap = currentTime;

  }).bind(this));
}

export default TouchListener;
