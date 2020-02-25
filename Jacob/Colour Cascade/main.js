(function() {
  //sets up the context with a canvas, sets up an array to hold the dots that are animated on the screen, as well as a maximum number of dots on the screen at the same time.
  //the "h" variable is there to randomise colours
  var ctx = Sketch.create({ autoclear: false });
  var dots = [];
  var max = 100;
  var h = 0;

  //Adding the object for the controllable blob
  var blob = {
    posX: 100,
    posY: ctx.height - 1000,
    velocityY: 0,
    height: 50,
    width: 50,
    step: 20
   
  };


  //eventlistener to control the blob
  document.addEventListener("keydown", function(event) {

    if (event.keyCode == 65) {
      setInterval(moveLeft(), 10);
    } else if (event.keyCode == 68 ) {
      setInterval(moveRight(), 10);
    } else if(event.keyCode == 32 || event.keyCode == 87){
      blobJump();
    }
  });

  //actual functions that control the blob, if/else if statements to make sure the blob doesn't move out of bounds
  function moveRight() {
    if (blob.posX > ctx.width - 50) {
      blob.posX -= 20;
    } else if (blob.posX < 0) {
      blob.posX = 0;
    } else {
      blob.posX += blob.step;
    }
  }

  function moveLeft() {
    if (blob.posX > ctx.width - 50) {
      blob.posX = (ctx.width - 50);
    } else if (blob.posX < 0) {
      blob.posX = 10;
    } else {
      blob.posX -= blob.step;
    }
  }
  //Gives blob legs
  function blobJump(){
    if (blob.posY == (ctx.height- 250)){
    blob.velocityY += 30;
    }  
  }
  //function that controls the gravity for Blob
  function blobGravity(){
    if (blob.posY < (ctx.height - 250)){
      blob.velocityY -= 2;

      //Makes sure Blob doesn't get stuck in the ground
    }else if ( blob.posY > (ctx.height - 250)){
      blob.posY = (ctx.height - 250)
      blob.velocityY = 0;
      
    }
  }
  //Moves blob higher
  function blobJumpHandler(){
    blob.posY -= blob.velocityY;
  }


  //Creates the dot object with some inherent properties
  Dot = function() {
    this.init = function() {
      this.size = random(2) + 3;
      this.x = random(-300, ctx.width);
      this.y = -this.size;
      this.vx = 1; // this line changes the angle at which the dot enter the screen
      this.vy = random(1) + 10;
      this.color = "#72B4E8";
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
    // Made the background into a gradient
    var grd = ctx.createLinearGradient(0, 0, 0, 500);
    grd.addColorStop(0, "#1D2229");
    grd.addColorStop(1, "#56667A");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    for (var i = 0; i < dots.length; i++) {
      dots[i].draw();
    }
      //draws ground
      ctx.fillStyle = "#11253D";
      ctx.fillRect(0, ctx.height - 200, ctx.width, ctx.height);

      //draws blob
      ctx.fillStyle = "#6688B3";
      ctx.fillRect(blob.posX, blob.posY, blob.width, blob.height);
    
    //Gravity for Blob
    blobGravity();
    blobJumpHandler();

  };
  //"teleports" the dots that hit the ground up to the top again
  ctx.makeDot = function(reuseDot) {
    var dot = reuseDot ? reuseDot : new Dot();
    dot.init();
    dots.push(dot);
  };
})();
