
/*document.addEventListener("keypress", dealWithKeyboard, false);

function dealWithKeyboard(event){
  if (this.keyCode === 32){
*/

document.getElementById("myBtn").addEventListener("mousedown", buttonFunction);
document.getElementById("myBtn").addEventListener("mouseup", buttonFunction);
/*var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");*/

var InfiniteRunner = Sketch.create({
  fullscreen: false,
  width: 640,
  height: 360,
  container: document.getElementById('container')
});

/*let button = {
  x: 150,
  y: 30,
  width: 32,
  height: 32,
  color: '#181818',
    draw : function (){
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.color;
    }
}*/

function buttonFunction () {

function Vector2(x, y, width, height){ 
};

/*Vector2*/

Vector2.prototype.setPosition = function(x, y) {
  this.x = x;
  this.y = y;
};

/*****BOX****/


function Box(options){

  this.setPosition(options.x, options.y);
  this.width = options.width;
  this.height = options.height;
  this.velocityX = 3;
  this.velocityY = -1;
  this.color = '#306955';

}

Box.prototype = new Vector2;

Box.prototype.update = function() {
  this.velocityY += 0.5;
  this.setPosition(this.x + this.velocityX, this.y + this.velocityY);
};


Box.prototype.draw = function() {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.width, this.height);
};

InfiniteRunner.setup = function () {
  this.player = new Box({x: 100, y: 0, width: 100, height: 35});
};

InfiniteRunner.update = function() {
  this.player.update();
};

InfiniteRunner.draw = function(){
 
this.player.draw();
}; 

};