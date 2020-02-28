// Setup the style of the document
document.body.style.background = "black";
document.body.style.overflow = "hidden";
document.body.style.cursor = "default";

// Setup a new sketch and assigns it to an variable
const s = Sketch.create({ autoclear: false });
// Array that stores all the created squares
const squares = [];
// Set the max amount of squares that will be drawn
const maxSquares = 20;
// Sets the color range of the squares
let minHue = 50;
let maxHue = 500;
let hue = minHue;

// Assign a random x and y value to the variable based on the width and height of the sketch
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

  // Changes the color of the squares based on the color range
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

  // Method that draws the squares
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

  // Method that updates the squares, array and checks the mouse position
  update() {
    // Checks if mouse is over squares and if condition is true, the array gets empty
    if (
      s.mouse.x >= this.x &&
      s.mouse.x <= this.x + 10 &&
      s.mouse.y >= this.y &&
      s.mouse.y <= this.y + 10
    ) {
      // By reassigning the length of the array to 0, it will empty the array thus delete the squares
      squares.length = 0;
    }
    // Updates the size of the squares thus creates the effect
    this.size += this.sv;
    this.sv *= 1.05;
    this.a += 0.01;
    if (this.size > (s.width + s.height) / 20) {
      this.init();
    }
  }
}
