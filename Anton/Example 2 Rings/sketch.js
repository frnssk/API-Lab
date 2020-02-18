var s = Sketch.create({
    autoclear: false
});
var particles = [];
var max = 20;
var clearColor = "rgba(0,0,0,.1)";
var hue = 0;

function P() {}

P.prototype = {
    constructor: P,
    init: function() {
        this.r = random(10) + 10;
        this.v = this.r / 3;
        this.x = s.mouse.x || s.width / 2 - this.r;
        this.y = s.mouse.y || s.height / 2 - this.r;
        this.vx = random(-1 * this.v, this.v);
        this.vy = random(-1 * this.v, this.v);
        this.dv = .96;
        this.color = "hsla(" + hue + ", 100%, 50%, 1)";
        this.life = 0;
        this.maxLife = random(100);
    },
    draw: function() {
        s.globalCompositeOperation = "source-atop";
        s.strokeStyle = this.color;
        s.beginPath();
        s.arc(this.x, this.y, this.r, 0, TWO_PI);
        s.stroke();
        this.update();
    },
    update: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.r *= this.dv;
        this.vx *= this.dv;
        this.vy *= this.dv;
        this.life++;
        if (this.life >= this.maxLife || this.r <= .2) {
            this.init();
        }
    }
};

s.setup = function() {
    for (var i = 0; i < max; i++) {
        setTimeout(function() {
            var p = new P();
            p.init();
            particles.push(p)
        }, i * 10);
    }
};

s.update = function() {
    s.globalCompositeOperation = "source-over";
    s.fillStyle = clearColor;
    s.fillRect(0, 0, s.width, s.height);
    hue += .3;
};

s.draw = function() {
    for (var i in particles) {
        particles[i].draw();
    }
};

s.mouseout = s.touchend = function() {
    s.mouse.x = null;
    s.mouse.y = null;
};