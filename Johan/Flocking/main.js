var calculateDistance = function(object1, object2) {
  x = Math.abs(object1.x - object2.x);
  y = Math.abs(object1.y - object2.y);

  return Math.sqrt(x * x + y * y);
};

var calcMagnitude = function(x, y) {
  return Math.sqrt(x * x + y * y);
};

var calcVectorAdd = function(v1, v2) {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
};

var random = function(min, max) {
  return min + Math.random() * (max - min);
};

var getRandomItem = function(list, weight) {
  var total_weight = weight.reduce(function(prev, cur, i, arr) {
    return prev + cur;
  });

  var random_num = random(0, total_weight);
  var weight_sum = 0;
  //console.log(random_num)

  for (var i = 0; i < list.length; i++) {
    weight_sum += weight[i];
    weight_sum = +weight_sum.toFixed(2);

    if (random_num <= weight_sum) {
      return list[i];
    }
  }

  // end of function
};

/***********************
BOID
***********************/
function Boid(x, y) {
  this.init(x, y);
}

Boid.prototype = {
  init: function(x, y) {
    //body
    this.type = "boid";
    this.alive = true;
    this.health = 1;
    this.maturity = 4;
    this.speed = 20;
    this.size = 5;
    //this.hungerLimit = 12000;
    this.hunger = 1;
    this.isFull = false;
    //this.digestTime = 400;
    this.color =
      "rgb(" +
      ~~random(0, 100) +
      "," +
      ~~random(50, 220) +
      "," +
      ~~random(100, 220) +
      ")";

    //brains
    this.eyesight = 100; //range for object dectection
    this.personalSpace = 5; //distance to avoid safe objects
    this.flightDistance = 80; //distance to avoid scary objects
    this.flockDistance = 100; //factor that determines how attracted the boid is to the center of the flock
    this.matchVelFactor = 8; //factor that determines how much the flock velocity affects the boid. less = more matching

    this.x = x || 0.0;
    this.y = y || 0.0;

    this.v = {
      x: random(-1, 1),
      y: random(-1, 1),
      mag: 0
    };

    this.unitV = {
      x: 0,
      y: 0
    };

    this.v.mag = calcMagnitude(this.v.x, this.v.y);
    this.unitV.x = this.v.x / this.v.mag;
    this.unitV.y = this.v.y / this.v.mag;
  },
  wallAvoid: function(ctx) {
    var wallPad = 20;
    if (this.x < wallPad) {
      this.v.x = this.speed;
    } else if (this.x > ctx.width - wallPad) {
      this.v.x = -this.speed;
    }
    if (this.y < wallPad) {
      this.v.y = this.speed;
    } else if (this.y > ctx.height - wallPad) {
      this.v.y = -this.speed;
    }
  },
  ai: function(boids, index, ctx) {
    percievedCenter = {
      x: 0,
      y: 0,
      count: 0
    };
    percievedVelocity = {
      x: 0,
      y: 0,
      count: 0
    };
    mousePredator = {
      x: typeof ctx.touches[0] === "undefined" ? 0 : ctx.touches[0].x,
      y: typeof ctx.touches[0] === "undefined" ? 0 : ctx.touches[0].y
    };

    for (var i = 0; i < boids.length; i++) {
      if (i != index) {
        dist = calculateDistance(this, boids[i]);

        //Find all other boids close to it
        if (dist < this.eyesight) {
          //if the same species then flock
          if (boids[i].type == this.type) {
            //Alignment
            percievedCenter.x += boids[i].x;
            percievedCenter.y += boids[i].y;
            percievedCenter.count++;

            //Cohesion
            percievedVelocity.x += boids[i].v.x;
            percievedVelocity.y += boids[i].v.y;
            percievedVelocity.count++;

            //Separation
            if (dist < this.personalSpace + this.size + this.health) {
              this.avoidOrAttract("avoid", boids[i]);
            }
          } else {
            //if other species fight or flight
            if (
              dist <
              this.size + this.health + boids[i].size + boids[i].health
            ) {
              this.eat(boids[i]);
            } else {
              this.handleOther(boids[i]);
            }
          }
        } //if close enough
      } //dont check itself
    } //Loop through boids

    //Get the average for all near boids
    if (percievedCenter.count > 0) {
      percievedCenter.x =
        (percievedCenter.x / percievedCenter.count - this.x) /
        this.flockDistance;
      percievedCenter.y =
        (percievedCenter.y / percievedCenter.count - this.y) /
        this.flockDistance;
      this.v = calcVectorAdd(this.v, percievedCenter);
    }
    if (percievedVelocity.count > 0) {
      percievedVelocity.x =
        (percievedVelocity.x / percievedVelocity.count - this.v.x) /
        this.matchVelFactor;
      percievedVelocity.y =
        (percievedVelocity.y / percievedVelocity.count - this.v.y) /
        this.matchVelFactor;
      this.v = calcVectorAdd(this.v, percievedVelocity);
    }

    //Avoid Mouse
    if (calculateDistance(mousePredator, this) < this.eyesight) {
      var mouseModifier = 20;
      this.avoidOrAttract("avoid", mousePredator, mouseModifier);
    }

    this.wallAvoid(ctx);
    this.limitVelocity();
  },
  setUnitVector: function() {
    var magnitude = calcMagnitude(this.v.x, this.v.y);
    this.v.x = this.v.x / magnitude;
    this.v.y = this.v.y / magnitude;
  },
  limitVelocity: function() {
    this.v.mag = calcMagnitude(this.v.x, this.v.y);
    this.unitV.x = this.v.x / this.v.mag;
    this.unitV.y = this.v.y / this.v.mag;

    if (this.v.mag > this.speed) {
      this.v.x = this.unitV.x * this.speed;
      this.v.y = this.unitV.y * this.speed;
    }
  },
  avoidOrAttract: function(action, other, modifier) {
    var newVector = { x: 0, y: 0 };
    var direction = action === "avoid" ? -1 : 1;
    var vModifier = modifier || 1;
    newVector.x += (other.x - this.x) * vModifier * direction;
    newVector.y += (other.y - this.y) * vModifier * direction;
    this.v = calcVectorAdd(this.v, newVector);
  },
  move: function() {
    this.x += this.v.x;
    this.y += this.v.y;
    if (this.v.mag > this.speed) {
      this.hunger += this.speed;
    } else {
      this.hunger += this.v.mag;
    }
  },
  metabolism: function() {
    if (this.hunger >= this.hungerLimit) {
      this.health--;
      this.hunger = 0;
    }

    if (this.hunger >= this.digestTime) {
      this.isFull = false;
    }

    if (this.health <= 0) {
      this.alive = false;
    }
  },
  mitosis: function(boids) {
    if (this.health >= this.maturity) {
      //reset old boid
      this.health = 1;

      birthedBoid = new Boid(
        this.x + random(-this.personalSpace, this.personalSpace),
        this.y + random(-this.personalSpace, this.personalSpace)
      );
      birthedBoid.color = this.color;

      boids.push(birthedBoid);
    }
  },
  draw: function(ctx) {
    drawSize = this.size + this.health;

    ctx.beginPath();
    ctx.moveTo(
      this.x + this.unitV.x * drawSize,
      this.y + this.unitV.y * drawSize
    );
    ctx.lineTo(
      this.x + this.unitV.y * drawSize,
      this.y - this.unitV.x * drawSize
    );
    ctx.lineTo(
      this.x - this.unitV.x * drawSize * 2,
      this.y - this.unitV.y * drawSize * 2
    );
    ctx.lineTo(
      this.x - this.unitV.y * drawSize,
      this.y + this.unitV.x * drawSize
    );
    ctx.lineTo(
      this.x + this.unitV.x * drawSize,
      this.y + this.unitV.y * drawSize
    );
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fill();
  }
};

/***********************
SIM
***********************/
var boids = [];

var sim = Sketch.create({
  container: document.getElementById("container")
});

sim.setup = function() {
  for (i = 0; i < 50; i++) {
    x = random(0, sim.width);
    y = random(0, sim.height);
    sim.spawn(x, y);
  }
};

sim.spawn = function(x, y) {
  boid = new Boid(x, y);
  boids.push(boid);
};

sim.update = function() {
  for (i = boids.length - 1; i >= 0; i--) {
    if (boids[i].alive) {
      boids[i].ai(boids, i, sim);
      boids[i].move();
      boids[i].metabolism();
      boids[i].mitosis(boids);
    } else {
      //remove dead boid
      boids.splice(i, 1);
    }
  }
};

sim.draw = function() {
  sim.globalCompositeOperation = "lighter";

  for (i = boids.length - 1; i >= 0; i--) {
    boids[i].draw(sim);
  }

  sim.fillText(boids.length, 40, 40);
};
