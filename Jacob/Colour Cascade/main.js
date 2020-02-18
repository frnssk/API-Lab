(function() {
  var ctx = Sketch.create({ autoclear: false });
  var dots = [];
  var max = 300;
  var h = 0;
  Dot = function() {
    this.init = function() {
      this.size = random(20) + 10;
      this.x = random(-30, ctx.width);
      this.y = -this.size;
      this.vx = 0;
      this.vy = random(20);
      this.color = "hsla(" + h + ", 100%, 50%, .6)";
      h += 0.1;
      if (h > 360) {
        h = 0;
      }
      this.life = 0;
      this.gravity = 0.1;
      this.maxLife = 100;
    };
    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.size += 0.01;
      this.life++;
    };
    this.draw = function() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    };
  };
  ctx.update = function() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].update();
      if (
        dots[i].y - dots[i].size > ctx.height ||
        dots[i].y + dots[i].size < 0 ||
        dots[i].x - dots[i].size > ctx.width ||
        dots[i].x + dots[i].size < 0 ||
        dots[i].life > dots[i].maxLife
      ) {
        this.makeDot(dots.splice(i, 1)[0]);
      }
    }
  };
  ctx.setup = function() {
    for (var i = 0; i < max; i++) {
      setTimeout(function() {
        var dot = new Dot();
        dot.init();
        dots.push(dot);
      }, 15 * i);
    }
  };
  ctx.draw = function() {
    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    for (var i = 0; i < dots.length; i++) {
      dots[i].draw();
    }
  };
  ctx.makeDot = function(reuseDot) {
    var dot = reuseDot ? reuseDot : new Dot();
    dot.init();
    dots.push(dot);
  };
})();
