Sketch.create({
    setup() {
      this.r = this.g = this.b = random(100, 200)
    },
    mousemove() {
      this.r = 255 * (this.mouse.x / this.width)
      this.g = 100 * (this.mouse.y / this.height)
      this.b = 100 * abs(cos(PI * this.mouse.y / this.width))
    
    },
    draw() {
      this.fillStyle = `rgb(${~~this.r},${~~this.g},${~~this.b})`
      this.fillRect(0, 0, this.width, this.height)
    }
  })