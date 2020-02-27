
/*Creates the "canvas" and draws the button*/
var ctx = Sketch.create({
  fullscreen: false,
  width: 1000,
  height: 500,
  container: document.getElementById('container'),
  
  draw : function() {
		this.beginPath();
		this.fillRect(100, 10, 300, 100 );
    this.fillStyle = "#306955";
    this.strokeText ("Click me to make me drop", 160, 65);
    this.font = "15px Arial";
  }
});

/*Event that listen for mouse clicks*/
document.addEventListener("click", buttonClick);

/* A function that runs the entire animation of the button falling when the button is clicked*/ 
function buttonClick(e){
if (e.clientX > 110 && e.clientX < 410 && e.clientY > 20 && e.clientY < 120) {
  

  function Vector2(x, y, width, height){ 
  };
  
  Vector2.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  };
  
  /*****FallingBox****/
  
  /* The falling box's start parameters, size, falling directions and color.*/
  function Box(){
    this.setPosition(100, 10);
    this.width = 300;
    this.height = 100;
    this.velocityX = 2;
    this.velocityY = -1;
    this.color = '#306955';
    }
  
  Box.prototype = new Vector2;
  
  /*Creates a function that sets the parameters of how the box should fall, speed, position, direction*/
  Box.prototype.update = function() {
    this.velocityY += 0.4;
    this.setPosition(this.x + this.velocityX, this.y + this.velocityY);
    };
  
  /*Draws the falling box*/
  Box.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  
  /*Setup for creating the falling animation*/
  ctx.setup = function () {
    this.player = new Box();
    };
  
  
  ctx.update = function() {
    this.player.update();
    };
  
  /*Continues to draw the box while falling*/
  ctx.draw = function(){
    this.player.draw();
    }; 

  };
};
