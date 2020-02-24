//grass originally by Roman Taraban

var canvas   = document.getElementById('test'),
    ctx      = canvas.getContext('2d'),
    stack    = [],
    w        = window.innerWidth,
    h        = window.innerHeight;

var drawer = function(){
  //originally made background white
  //ctx.fillStyle="#222";
  ctx.clearRect(0,0,w,h);
  stack.forEach(function(el){
      el();  
  })
  requestAnimationFrame(drawer);
}
var anim = function(){
  var x = 0, y = 0;
  //tallness of straws * variable + min 
  var maxTall = Math.random()*(h/10)+(h/10);
  //thickness of straws
  var maxSize = Math.random()*(h/100)+5;
  //speed of straws growth
  var speed = Math.random()*1;  
  var position = Math.random()*w-w/2;
  var c = function(l,u){return Math.round(Math.random()*(u||255)+l||0);}
  
  //color of grass   
  var color = 'rgb('+c(125,50)+','+c(225,80)+','+c(80,50)+')';
  return function(){
    
    //how fast + far the grass straws bend 
    var deviation=Math.cos(x/20)*Math.min(x/4,50),
        tall = Math.min(x/2,maxTall),
        size = Math.min(x/100,maxSize);
    x+=speed;
    ctx.save();
    
    ctx.strokeWidth=20;
    ctx.translate(w/2+position,h)
    ctx.fillStyle=color;
    
    ctx.beginPath();
    ctx.lineTo(-size,0);
    ctx.quadraticCurveTo(-size,-tall/2,deviation,-tall);
    ctx.quadraticCurveTo(size,-tall/2,size,0);
    //ctx.closePath();?
    ctx.fill();
    
    ctx.restore()
  }    
};
//number of grass straws it makes
for(var x = 0; x<(w/4);x++){stack.push(anim());}
canvas.width = w;
canvas.height = h;
drawer();



/*var moon = [],
  particleCount = 1;
  moon = function(x,y) {
    this.x = x;
    this.y = y;

    this.radius = random(10.10);

    this.rgba = 'rgba('+floor(random(255,255))+','+floor(random(255,255))+','+floor(random(255,255))+','+random(.2,10)+')';

          //changes speed of particle
          this.vx = random(-.0,.120);
          this.vy = random(-.0,.0);
          
          // Draw our particle to the canvas.
          this.draw = function(ctx) {
            ctx.fillStyle = this.rgba;
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,TWO_PI);
            ctx.fill();
            
            //adds blinking glow
            ctx.shadowBlur = random(15,30);
            //glow color
            ctx.shadowColor = "white";
          };
          
          // Update our position. 
          this.update = function(ctx) {
          
            this.x += this.vx;
            this.y += this.vy;
      
          }

  };*/
 
/*
Bouncing Balls originally by Rob Glazebrook
Added glow, changed size, color and speed
*/


var particles = [],
    //number of stars
    particleCount = 1000;
    Particle = function(x,y) {     
      this.x = x;
      this.y = y;
      
      //size of stars
      this.radius = random(0,1);
      
      //colors red,green,blue,transparency 
      this.rgba = 'rgba('+floor(random(200,255))+','+floor(random(200,255))+','+floor(random(200,255))+','+random(100,100)+')';

      
      //set random speed of the stars
      this.vx = random(-.0,.300);
      this.vy = random(-.0,.0);
      
      // Draw the stars to canvas.
      this.draw = function(ctx) {
        ctx.fillStyle = this.rgba;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,TWO_PI);
        ctx.fill();
        
        //adds blinking glow
        ctx.shadowBlur = random(15,30);
        //glow color
        ctx.shadowColor = "white";
      };
      
      // Update our position. 
      this.update = function(ctx) {
      
        this.x += this.vx;
        this.y += this.vy;
  
      }
    };





var sketch = Sketch.create({
  setup: function() {
    var i = particleCount;
    while(i--) {
      var p = new Particle(random(0, this.width),random(0, this.height));
      particles.push(p);
    }
  },
  update: function() {
    var i = particleCount;
    while(i--) { 
      particles[i].update(this);
    }
  },
  draw: function() {
    var i = particleCount;
    while(i--) {
      particles[i].draw(this);
    }
  }
});

