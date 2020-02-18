document.body.style.background = "black";
document.body.style.overflow = "hidden";
document.body.style.cursor = "none";

const $ = Sketch.create({ autoclear: false });
const squares = [];
const maxSquares = 200;
let minHue = 240;
let maxHue = 260;
let hue = minHue;
let hasMovedMouse = false;

let point = {
  x: $.width / 2,
  y: $.height / 2
};

$.draw = function() {
  this.globalCompositeOperation = "source-over";
  this.fillStyle = "rgba(0,0,0,.4)";
  this.fillRect(0, 0, this.width, this.height);

  squares.forEach(sq => sq.draw());

  hue = hue > maxHue ? minHue : hue + 0.8;

  if (!Math.hypot(this.mouse.x - point.x, this.mouse.y - point.y) <= 0.1) {
    point.x += (this.mouse.x - point.x) * 0.04;
    point.y += (this.mouse.y - point.y) * 0.04;
  }
};

$.mousemove = () => (hasMovedMouse = true);
$.touchmove = () => (hasMovedMouse = true);
$.mouseout = function() {
  hasMovedMouse = false;
  moveMouseRandomly();
};

class Square {
  constructor() {
    this.init();
  }
  init() {
    this.size = 100;
    this.sv = random(2, 4);
    this.a = 0;
    this.x = point.x;
    this.y = point.y;
    this.hue = hue;
  }
  draw() {
    $.globalCompositeOperation = "lighter";
    $.lineWidth = 2;
    $.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.a})`;
    $.strokeRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    this.update();
  }
  update() {
    this.size += this.sv;
    this.sv *= 1.1;
    this.a += 0.01;
    if (this.size > ($.width + $.height) * 2) {
      this.init();
    }
  }
}

for (let s = 0; s < maxSquares; s++) {
  setTimeout(() => squares.push(new Square()), s * 20);
}

// Move the mouse around randomly, until the user moves their mouse/touch
// so preview looks more interesting.
const moveMouseRandomly = () => {
  if (!hasMovedMouse) {
    $.mouse.x = $.width / 2 + random(-200, 200);
    $.mouse.y = $.height / 2 + random(-200, 200);
    setTimeout(() => moveMouseRandomly(), random(500, 2000));
  }
};

moveMouseRandomly();
