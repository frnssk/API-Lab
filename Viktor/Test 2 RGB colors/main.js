Sketch.create({
    setup() {
      this.r = this.g = this.b = random(0, 100)
    },
    mousemove() {
      this.r = 255 * random(this.mouse.x / this.width) 
      this.g = 255 * random(this.mouse.y / this.height)
      this.b = 255 * abs(cos(PI * this.mouse.y / this.width))
    
    },
    draw() {
      this.fillStyle = `rgb(${~~this.r},${~~this.g},${~~this.b})`
      this.fillRect(0, 0, this.width, this.height)
    }
  });

  