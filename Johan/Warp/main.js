document.body.style.background = "black";
document.body.style.overflow = "hidden";
document.body.style.cursor = "default";

const s = Sketch.create({ autoclear: false, retina: true });
const squares = [];
const maxSquares = 20;
let minHue = 50;
let maxHue = 500;
let hue = minHue;
//let hasMovedMouse = false;

let point = {
  x: random(0, s.width),
  y: random(0, s.height)
};

s.draw = function() {
  s.mouseout = function() {
    this.stop();
    this.clear();
  };
  s.mouseover = function() {
    (point.x = random(0, s.width)), (point.y = random(0, s.height));
    this.start();
  };

  this.globalCompositeOperation = "source-over";
  this.fillStyle = "rgba(0,0,0,.4)";
  this.fillRect(0, 0, this.width, this.height);
  squares.forEach(sq => sq.draw());
  this.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.a})`;

  hue = hue > maxHue ? minHue : hue + 0.8;

  /*if (!Math.hypot(this.mouse.x - point.x, this.mouse.y - point.y) <= 0.1) {
    point.x += (this.mouse.x - point.x) * 0.1;
    point.y += (this.mouse.y - point.y) * 0.1;
  }
  */
};

/*
s.mousemove = () => (hasMovedMouse = true);
s.touchmove = () => (hasMovedMouse = true);
s.mouseout = function() {
  hasMovedMouse = false;
  moveMouseRandomly();
};
*/

class Square {
  constructor() {
    this.init();
  }
  init() {
    this.size = 30;
    this.sv = 1;
    this.a = 0;
    this.x = point.x;
    this.y = point.y;
    this.hue = hue;
  }

  draw() {
    s.globalCompositeOperation = "lighter";
    s.lineWidth = 4;
    s.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.a})`;
    s.strokeRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    this.update();
  }

  update() {
    this.size += this.sv;
    this.sv *= 1.05;
    this.a += 0.01;
    if (this.size > (s.width + s.height) / 10) {
      this.init();
    }
  }
}

for (let i = 0; i < maxSquares; i++) {
  setTimeout(() => squares.push(new Square()), i * 5);
}

/*

document.addEventListener("mouseover", animationDraw);
document.addEventListener("mouseout", animationStop);

function animationDraw() {
  for (let s = 0; s < maxSquares; s++) {
    setTimeout(() => squares.push(new Square()), s * 5);
  }
}

function animationStop() {
  for (let s = 0; s < maxSquares; s++) {
    setTimeout(() => squares.pop(new Square()), s * 5);
  }
}

*/
