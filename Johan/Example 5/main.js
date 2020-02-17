var s = Sketch.create({ autoclear: false });
var particles = [];
var max = 100;
var clearColor = "rgba(0,0,0,.2)";
var hue = (minHue = 190);
var maxHue = 200;
var reverseHue = false;

function P() {}

P.prototype = {
  constructor: P,
  init: function() {
    this.r = random(8) + 3;
    this.v = this.r / 3;
    this.x = s.mouse.x || s.width / 2 - this.r;
    this.y = s.mouse.y || s.height / 2 - this.r;
    this.vx = random(-2 * this.v, this.v * 2);
    this.vy = random(-2 * this.v, this.v);
    this.color = "hsla(" + hue + ", 100%, 50%, 1)";
    this.life = 0;
    this.maxLife = random(200);
    this.stroke = Math.random() > 0.5 ? true : false;
  },
  draw: function() {
    s.globalCompositeOperation = "source-over";
    s.fillStyle = this.color;
    s.shadowColor = this.color;
    s.shadowBlur = this.r * 2;
    s.beginPath();
    s.arc(this.x, this.y, this.r, 0, TWO_PI);
    s.fill();

    this.update();
  },
  update: function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02;
    this.life++;
    if (this.life >= this.maxLife || this.r <= 0.2) {
      this.init();
    }
  }
};

s.setup = function() {
  for (var i = 0; i < max; i++) {
    setTimeout(function() {
      var p = new P();
      p.init();
      particles.push(p);
    }, i * 30);
  }
};

s.update = function() {
  s.globalCompositeOperation = "source-over";
  s.fillStyle = clearColor;
  s.shadowColor = clearColor;
  s.shadowBlur = 0;
  s.fillRect(0, 0, s.width, s.height);
  if (hue >= maxHue) {
    reverseHue = true;
  }
  if (hue <= minHue) {
    reverseHue = false;
  }
  hue = reverseHue ? hue - 1 : hue + 1;
};

s.draw = function() {
  for (var i in particles) {
    particles[i].draw();
  }
};

s.mouseout = s.touchend = function() {
  s.mouse.x = null;
  s.mouse.y = null;
};
