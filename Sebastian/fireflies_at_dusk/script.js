var canvas   = document.getElementById('test'),
    ctx      = canvas.getContext('2d'),
    stack    = [],
    w        = window.innerWidth,
    h        = window.innerHeight;

var drawer = function(){
  ctx.clearRect(0,0,w,h);
  stack.forEach(function(el){
      el();  
  })
  requestAnimationFrame(drawer);
}
 

var particles = [],
    //number of stars on canvas
    particleCount = 1500;
    Particle = function(x,y) {     
      this.x = x;
      this.y = y;
      
      //randomize size of the stars
      this.radius = random(.9, 3);
      
      //slight different color of the stars; red,green,blue,transparency 
      this.rgba = 'rgba('+floor(random(250,255))+','+floor(random(250,255))+','+floor(random(200,255))+','+random(0,100)+')';

      
      //set random speed of the stars
      this.vx = random(-.0,.100);
      this.vy = random(-.0,0);
      
      //Draw the stars to canvas.
      this.draw = function(ctx) {
        ctx.fillStyle = this.rgba;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,TWO_PI);
        ctx.fill();
        
        //Adds blinking effect to the stars
        ctx.shadowBlur = random(1,50);
        //blinking color
        ctx.shadowColor = "white";
      };
      
      //Update the position
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
