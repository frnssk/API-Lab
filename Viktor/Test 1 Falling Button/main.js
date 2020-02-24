


document.getElementById("myBtn").addEventListener("mousedown", buttonFunction);
/*document.getElementById("myBtn").addEventListener("mouseup", buttonFunction2);*/

var buttonFallen = false;

var ctx = Sketch.create({
  fullscreen: false,
  width: 640,
  height: 360,
  container: document.getElementById('container'),
  draw: function() {
		this.beginPath();
		this.fillRect(100, 10, 300, 100 );
    this.fillStyle = "#306955";
    }
  });



/* A function that runs the entire animation of the button falling when activated*/ 
function buttonFunction () {
  if (buttonFallen === false){

function Vector2(x, y, width, height){ 
};


Vector2.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};

/*****FallingBox****/


function Box(){
  this.setPosition(100, 10);
  this.width = 100;
  this.height = 35;
  this.velocityX = 2;
  this.velocityY = -1;
  this.color = '#306955';
  }

Box.prototype = new Vector2;

Box.prototype.update = function() {
  this.velocityY += 0.4;
  this.setPosition(this.x + this.velocityX, this.y + this.velocityY);
  };


Box.prototype.draw = function() {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
  };

ctx.setup = function () {
  this.player = new Box({x: 100, y: 10, width: 300, height: 100});
  };

ctx.update = function() {
  this.player.update();
  };

ctx.draw = function(){
 
  this.player.draw();
  }; 
buttonFallen === true;

  } else if (buttonFallen === true)
  {

  alert("Button has fallen");
  };
};