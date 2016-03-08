///////////////////////////////////////////////////////////////////////////////
// MENU
//
function Menu(x, y) {
  this.menu = document.getElementById('menu');
  this.x = x;
  this.y = y;
}

Display.prototype.toggle = function() {
  if(this.menu.style.visibility === "hidden") {
    this.menu.style.visibility = "visible";
  } else {
    this.menu.style.visibility = "hidden";
  }
};

export default Menu;
