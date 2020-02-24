var ctx = Sketch.create();

ctx.draw = function() {
	ctx.beginPath();
	ctx.arc( random( ctx.width ), random( ctx.height ), 10, 0, TWO_PI );
	ctx.fill();
}