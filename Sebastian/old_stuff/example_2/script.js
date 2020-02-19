
var balls = [];
var COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
function Ball(x,y,r) {
  this.init(x,y,r);
};
var gravityMode = false;
var text = "none";


function rad(degree) {
  return (degree * (PI / 180));
}
function degrees (angle) {
  return angle * (180 / Math.PI);
}

function angle(one, two)
{
  var x = two.x - one.x;
  var y = two.y - one.y;
  var theta = degrees(Math.atan2(x, y));
  return theta;
}

Ball.prototype = {
  init: function(x,y,r) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.r = r || 10;

    this.angle = random(0,360);
    this.vx = 0;
    this.vy = 0;    
    this.speed = 30 / this.r;
    this.mod = Math.floor(random(10,20));
    this.mul = 0;
    this.cycles=0;
    this.color = COLOURS[Math.floor(Math.random() * 7)];
    this.height = y;
  },  
  draw: function(ctx) {
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.r, 0, TWO_PI );
    ctx.fillStyle = this.color;
    ctx.fill();
  },
  
  handleCollisions: function()
  {
    if (this.y < this.r)
    {
      this.angle = 180 - this.angle;
      this.y += this.r + 1;
    }
    else if (this.y > (sketch.height - this.r))
    {
      this.angle = 180 - this.angle;
      this.y -= this.r - 1;
    }
    if (this.x < this.r)
    {
      this.angle = -this.angle;
      this.x = this.r + 1;
    }
    else if(this.x > (sketch.width - this.r))
    {
      this.angle = -this.angle;
      this.x = sketch.width - this.r - 1;
    }  
  },
  setAngle: function(target)
  {
    var xy = {x:this.x,y:this.y};
    this.angle = angle(xy, target);
  },
  stickAround: function() {
    if (this.cycles % this.mod == 0)
      this.angle += random(-50, 50);
  },
  
  spinTo: function(ang) {
    if (this.angle > (ang -10) && this.angle < (ang + 10))
      this.angle = ang;
    else
      this.angle *= 0.9;
  },
  
  bounce: function() {
    this.height = this.y;
    if (this.y < sketch.height - this.r - 1)
    {
      this.mul = -1;
      this.height = this.height / 2;
    }
    else if (this.y == this.height)
    {
      this.mul = 1;
    }
    this.y += this.mul * cos( this.cycles * PI );
  },
  
  update: function(event){
    if (!gravityMode)
    {
      this.handleCollisions();
      var target = event || -1;
      if (target != -1)
      {
        this.setAngle(target);
      }
      else
      {
        this.stickAround();
      }
    
      this.x += sin(rad(this.angle)) * this.speed;
      this.y += cos(rad(this.angle)) * this.speed;

    

      if(this.cycles > 20)
        this.cycles = 0;
    }
    else
    {
/*      if (this.angle != 0)
      {
        this.spinTo(0);
        this.x += sin(rad(this.angle)) * this.speed;
        this.y += cos(rad(this.angle)) * this.speed;
      }
      else if (this.y < (sketch.height - this.r))
        this.y+=10-this.speed;*/
      this.bounce();
    }
    if (this.angle > 360)
      this.angle -= 360;
    this.cycles++;
  }
};


var sketch = Sketch.create({
  container: document.getElementById('container' )
});

sketch.setup = function(){
  var i, ball;
  for (i=0;i<200;i++)
  {
    ball = new Ball(random(20,sketch.width), random(20, sketch.height), random(3,20));
    balls.push(ball);
  }
//  ball = new Ball(10,100, 10);
//  balls.push(ball);
};

sketch.update = function(){
  for (i=0;i<balls.length;i++)
  {
    balls[i].update();
  }  
};

sketch.draw = function(){
  var i;
  for (i=0;i<balls.length;i++)
  {
    balls[i].draw(sketch);
                      
  /*                this.beginPath();
      this.moveTo(balls[i].x, balls[i].y);
      this.lineTo(balls[i].x + 100* sin(rad(balls[i].angle)), balls[i].y + 100* cos(rad(balls[i].angle)));
      this.stroke();
      this.strokeText(balls[i].angle, 10,30);*/
  }
};

sketch.click = function(event) {
  gravityMode = !gravityMode;
};

sketch.touchmove = function(event){
  var i;
  for(i=0;i<balls.length;i++)
  {
    balls[i].update(event);
  }
}