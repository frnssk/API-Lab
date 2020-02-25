// Setup the document style
document.body.style.background = "black";
document.body.style.overflow = "hidden";
document.body.style.cursor = "default";

// Creates and returns a new sketch.
const s = Sketch.create({ autoclear: false });
// Array that stores all the created squares
const squares = [];
const maxSquares = 20;
// Sets the color range
let minHue = 50;
let maxHue = 500;
let hue = minHue;

// Assign the random x and y value to the variable
let point = {
  x: random(0, s.width),
  y: random(0, s.height)
};

// Instance method that draws the sketch
s.draw = function() {
  // Instance method that checks if mouse is clicked on the sketch, then reassigns the point values and initiates the loop that creates squares
  s.click = function() {
    (point.x = random(0, s.width)), (point.y = random(0, s.height));
    // Loop that creates and pushes new squares into the array
    for (let i = 0; i < maxSquares; i++) {
      setTimeout(() => squares.push(new Square()), i * 5);
    }
  };

  this.globalCompositeOperation = "source-over";
  this.fillStyle = "rgba(0,0,0,.4)";
  this.fillRect(0, 0, this.width, this.height);

  // Draws all the squares in the array
  squares.forEach(sq => sq.draw());
  this.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.a})`;

  hue = hue > maxHue ? minHue : hue + 0.8;
};

// Class that creates new squares
class Square {
  constructor() {
    this.init();
  }
  // Initiates the squares with set values
  init() {
    this.size = 20;
    this.sv = 1;
    this.a = 0;
    this.x = point.x;
    this.y = point.y;
    this.hue = hue;
  }

  // Method that draws the square when called upon
  draw() {
    s.globalCompositeOperation = "lighter";
    s.lineWidth = 2;
    s.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.a})`;
    s.strokeRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    this.update();
  }
  // Method that updates the square with new values
  update() {
    // Checks if mouse is over squares and if condition is true, the array gets empty
    if (
      s.mouse.x >= this.x &&
      s.mouse.x <= this.x + 10 &&
      s.mouse.y >= this.y &&
      s.mouse.y <= this.y + 10
    ) {
      // Deletes the squares
      squares.length = 0;
    }
    this.size += this.sv;
    this.sv *= 1.05;
    this.a += 0.01;
    if (this.size > (s.width + s.height) / 20) {
      this.init();
    }
  }
}
