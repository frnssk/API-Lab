Sketch.create({
    setup: function() {
        this.r = this.g = this.b = random(100, 200);
    },
    mousemove: function() {
        this.r = 255 * (this.mouse.x / this.width);
        this.g = 255 * (this.mouse.y / this.height);
        this.b = 255 * abs(cos(PI * this.mouse.y / this.width));
    },
    draw: function() {
        this.fillStyle = 'rgb(' + ~~this.r + ',' + ~~this.g + ',' + ~~this.b + ')';
        this.fillRect(0, 0, this.width, this.height);
    }
});