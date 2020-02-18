//Based on https://www.youtube.com/watch?v=CKeyIbT3vXI

var fireworks = [];
var gravity;


function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  strokeWeight(4);
  
  gravity = createVector(0, 0.2);
}

 
function draw() {
  colorMode(RGB);
  background(0, 100);
  
  if(random(1) < 0.02){
    fireworks.push(new Firework());
  }
  
  for (var i = fireworks.length - 1; i >= 0; i--){
    fireworks[i].update();
    fireworks[i].show();
    if(fireworks[i].done()){
      fireworks.splice(i, 1);
    }
  }
}


//____Particle Function____// 
function Particle(x, y, firework, hu) {
  this.pos = createVector(x, y);
  this.firework = firework;
  this.lifespan = 255;
  this.weight = 1;
  this.hu = hu;
  
  if (this.firework) {
    this.vel = createVector(0, -random(height /100, height/(32 + height/100)));
  } else {
    this.vel = p5.Vector.random2D();
    this.vel.setMag(pow(random(1,2), 2));
    this.weight = map(mag(this.vel.x, this.vel.y), 1, 4, 3, 0);
    this.vel.mult(height / this.pos.y);
  }
  
  this.acc = createVector(0,0);
  
  this.applyForce = function(force){
    this.acc.add(force);
  }
  
  this.update = function() {
    if (!this.firework){
      this.vel.mult(0.9);
      this.lifespan -= 5;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.done = function() {
    if(this.lifespan > 0){
      return false;
    } else {
      return true;
    }
  }
  
  this.show = function() {
    if (!this.firework){
      colorMode(HSB);
      stroke(hu, 255, 255, this.lifespan);
      strokeWeight(this.weight);
    } else {
      colorMode(HSB);
      stroke(hu, 255, 255);
      strokeWeight(4);
    }  
    point(this.pos.x, this.pos.y);
  }
  
}


//____Firework Function____// 
function Firework() {
  
  this.hu = random(255);
  this.firework = new Particle(random(width), height, true, this.hu);
  this.exploded = false;
  this.particles = [];
  
  this.done = function() {
    if(this.exploded && this.particles.length === 0){
      return true;
    } else {
      return false;
    }
  }
  
  this.update = function() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  this.explode = function() {
    for (var i = 0; i < floor(random(10,100)); i++) {
      var p = new Particle(this.firework.pos.x, this.firework.pos.y, false, this.hu);
      this.particles.push(p);
    }
  }
  
  this.show = function() {
    if(!this.exploded){
      this.firework.show();
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
  
}