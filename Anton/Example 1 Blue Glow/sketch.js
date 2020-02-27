var s = Sketch.create({
    autoclear: false
});

var button = document.getElementById("button")

button.addEventListener("mousedown", function(){
    hue = minHue = 90;
    maxHue = 100;
})

//Setting up, an array for the particles to sit in, and some settings. 
var particles = [];
var max = 0;
var clearColor = "rgba(0,0,0,.2)";
var hue = minHue = 1;
var maxHue = 30;
var reverseHue = false;

//this function is used as an object to hold properties...
function P() {}

//...such as this one
P.prototype = {
    constructor: P,

    //method that sets up values for the particles
    init: function() {
        //generates values that are used when drawing the particles. 
        this.r = random(10);
        this.v = this.r / 8;

        //makes the particles move around the mouse if it is on screen
        this.x = s.mouse.x || s.width / 2 - this.r;
        this.y = s.mouse.y || s.height / 2 - this.r;

        //more generated values
        this.vx = random(-1 * this.v, this.v * 1);
        this.vy = random(-1 * this.v, this.v);
        this.color = "hsla(" + hue + ", 100%, 60%, 10)";
        this.life = 0;
        this.maxLife = random(50);
        this.stroke = Math.random() > .5 ? true : false;
    },

    //method that uses values generated in previous method to draw a particle on the sketch
    draw: function() {
        s.globalCompositeOperation = "source-over";
        s.fillStyle = this.color;
        s.shadowColor = this.color;
        s.shadowBlur = this.r * 10;
        s.beginPath();
        s.arc(this.x, this.y, this.r, 0, TWO_PI);
        s.fill();

        this.update();
    },

    //iterates the particles, updating their values to "kill" old particles
    update: function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += .02;
        this.life++;
        if (this.life >= this.maxLife || this.r <= .2) {
            this.init();
        }
    }
};

//Pushes particles into the array setup early in the code
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
    s.shadowColor = clearColor;
    s.shadowBlur = 0;
    s.fillRect(0, 0, s.width, s.height);
    if (hue >= maxHue) {
        reverseHue = true;
    }
    if (hue <= minHue) {
        reverseHue = false;
    }
    hue = reverseHue ? hue - 1 : hue + 1;

};

//call the method in a for loop to draw all of the particles
s.draw = function() {
    for (var i in particles) {
        particles[i].draw();

    }
};

//removes the mouse coords if the mouse leaves the sketch
s.mouseout = s.touchend = function() {
    s.mouse.x = null;
    s.mouse.y = null;
};

//eventlisteners
document.addEventListener("mousedown", resumeDraw);
document.addEventListener("mouseup", stopDraw);

//This function starts drawing if you hold down the mouse
function resumeDraw() {
    max = 20;

    for (var i = 0; i < max; i++) {
        setTimeout(function() {
            var p = new P();
            p.init();
            particles.push(p)
        }, i * 30);
    }

}

//this function stops drawing when you let you of the left click
function stopDraw() {
    //particles = [];
    for (var i = 0; i < max; i++) {
        setTimeout(function() {
            var p = new P();
            p.init();
            particles.pop(p)
        }, i * 30);
    }
}