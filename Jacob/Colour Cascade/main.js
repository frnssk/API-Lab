(function() {

    //sets up the context with a canvas, sets up an array to hold the dots that are animated on the screen, as well as a maximum number of dots on the screen at the same time. 
    //the "h" variable is there to randomise colours
  var ctx = Sketch.create({ autoclear: false });
  var dots = [];
  var max = 100;
  var h = 0;

  //Creates the dot object with some inherent properties
  Dot = function() {
    this.init = function() {
      this.size = random(2) + 3 ;
      this.x = random(-300, ctx.width);
      this.y = -this.size;
      this.vx = 1; // this line changes the angle at which the dot enter the screen
      this.vy = random(1) + 10 ;
      this.color = "#72B4E8";
       /* removed temporarily to remove colour randomness, to bring back, replace the line above with the line that's been removed
       this.color = "hsla(" + h + ", 100%, 50%, .6)"; */
       h += 0.1;
      if (h > 360) {
        h = 0;
        
      }

      //some more options that alter the behaviour of the dot. 
      this.life = 10;
      this.gravity = 0.5;
      this.maxLife = 100;
    };

    //iterates the dot
    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.size += 0.0;
      this.life;
    };

    //Draws the dot 
    this.draw = function() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    };
  };

  // Checks the dots to see if they need to be removed or not 
  ctx.update = function() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].update();
      if (
        dots[i].y - dots[i].size > ctx.height ||
        dots[i].y + dots[i].size < 0 ||
        dots[i].x - dots[i].size > ctx.width ||
        dots[i].x + dots[i].size < 0 ||
        dots[i].life > dots[i].maxLife
      ) {
        this.makeDot(dots.splice(i, 1)[0]);
      }
    }
  };

  //pushes dots into the array
  ctx.setup = function() {
    for (var i = 0; i < max; i++) {
      setTimeout(function() {
        var dot = new Dot();
        dot.init();
        dots.push(dot);
      }, 15 * i);
    }
  };

  //draws the background then fires the function that draws a single dot, but in a for loop so that every dot is drawn
  ctx.draw = function() {
    ctx.fillStyle = "#56667A";
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    for (var i = 0; i < dots.length; i++) {
      dots[i].draw();
    }
  };

  ctx.makeDot = function(reuseDot) {
    var dot = reuseDot ? reuseDot : new Dot();
    dot.init();
    dots.push(dot);
  };
})();
