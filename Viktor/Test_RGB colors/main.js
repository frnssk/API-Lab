/*Creates the "canvas" where everything will happen*/
Sketch.create({
	setup: function() {
	  this.r = this.g = this.b = random( 100, 200 );
	},
	 
	mousemove: function() {
	  this.r = 255 * ( this.mouse.x / this.width );
	  this.g = 0 * ( this.mouse.y / this.height );
	  this.b = 0 * abs( cos( PI * this.mouse.y / this.width ) );
	},
	/*Uses the previous 'r', 'g', 'b' to control the rgb color that will be drawn
	on the canvas*/
	draw: function() {
	  this.fillStyle = 'rgb(' + ~~this.r + ',' + ~~this.g + ',' + ~~this.b + ')';
	  this.fillRect( 0, 0, this.width, this.height );
	}
});