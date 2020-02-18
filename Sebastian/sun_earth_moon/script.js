// translate n rotate at different speed examples

var sun = 0;
var earth = 0;
var moon = 0;
var s = 1;
var s2 = 2;
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  background(0);
}

function draw() {
  // Try with and without background(0)
  background(0);
  noStroke(0);

  // Draw the sun
  // Move to center
  translate(200, 200);
  fill("red");
  ellipse(0, 0, 120);
  fill("orangered");
  ellipse(0, 0, 100);
  fill("orange");
  ellipse(0, 0, 80);
  stroke(255);

  // Rotate the earth in CCW
  // line is visual reference
  rotate(sun);
  line(0, 0, 100, 100);
  
  // rotate by speed of s
  sun = sun - s;
  //console.log("sun = " + sun);

  // move back to origin position after rotate
  translate(-200, -200);

  // draw earth
  // rotate the earth in CW, need 2 x s2 = s to see movement

  translate(300, 300);
  
  rotate(earth);
  line(0, 0, 30, 30);
  // rotate by speed of s2
  earth = earth + s2;
  //console.log("earth = " + earth);
  
  noStroke();
  fill("blue");
  ellipse(0, 0, 50);
  fill("green");
  ellipse(0, 0, 40);
  // move back to origin
  translate(-300, -300);

  
  // Draw the moon
  fill("yellow");
  ellipse(330, 330, 20);
}
