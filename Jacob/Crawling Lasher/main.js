//different settings as tools for us to alter the behaviour of the "lasher"
var settings = {
    interactive: true,
    headRadius: 10,
    thickness: 5,
    tentacles: 50,
    friction: 1,
    gravity: 0,
    colour: { r: 1, g: 1, b: 1 },
    length: 50,
    pulse: false,
    wind: 0
};

//Function that will draw a line through points that are defined within the function
var utils = {

    curveThroughPoints: function( points, ctx ) {

        var i, n, a, b, x, y;
        
        for ( i = 1, n = points.length - 2; i < n; i++ ) {

            a = points[i];
            b = points[i + 1];
            
            x = ( a.x + b.x ) * 0.5;
            y = ( a.y + b.y ) * 0.5;

            ctx.quadraticCurveTo( a.x, a.y, x, y );
        }

        a = points[i];
        b = points[i + 1];
        
        ctx.quadraticCurveTo( a.x, a.y, b.x, b.y );
    }
};

var Node = function( x, y ) {
    
    this.x = this.ox = x || 0.0;
    this.y = this.oy = y || 0.0;
   
    this.vx = 0.0;
    this.vy = 0.0;
};

//takes the settings chosen earlier in the code and puts them to use.
var Tentacle = function( options ) {

    //referring to the options that were set up earlier in the code
    this.length = options.length || 10;
    this.radius = options.radius || 10;
    this.spacing = options.spacing || 20;
    this.friction = options.friction || 0.8;

    this.nodes = [];
    this.outer = [];
    this.inner = [];
    this.theta = [];

    for ( var i = 0; i < this.length; i++ ) {
        this.nodes.push( new Node() );
    }
};

//adding a method in the tentacle object, 
Tentacle.prototype = {

    move: function( x, y, instant ) {
        
        this.nodes[0].x = x;
        this.nodes[0].y = y;
        if ( instant ) {

            var i, node;
            for ( i = 1; i < this.length; i++ ) {

                node = this.nodes[i];
                node.x = x;
                node.y = y;
            }
        }
    },

    //update is done to animate 
    update: function() {

        var i, n, s, c, dx, dy, da, px, py, node, prev = this.nodes[0];
        var radius = this.radius * settings.thickness;
        var step = radius / this.length;

        for ( i = 1, j = 0; i < this.length; i++, j++ ) {

            node = this.nodes[i];

            node.x += node.vx;
            node.y += node.vy;

            dx = prev.x - node.x;
            dy = prev.y - node.y;
            da = Math.atan2( dy, dx );

            px = node.x + cos( da ) * this.spacing * settings.length;
            py = node.y + sin( da ) * this.spacing * settings.length;

            node.x = prev.x - ( px - node.x );
            node.y = prev.y - ( py - node.y );

            node.vx = node.x - node.ox;
            node.vy = node.y - node.oy;

            node.vx *= this.friction * (1 - settings.friction);
            node.vy *= this.friction * (1 - settings.friction);

            node.vx += settings.wind;
            node.vy += settings.gravity;

            node.ox = node.x;
            node.oy = node.y;

            s = sin( da + HALF_PI );
            c = cos( da + HALF_PI );

            this.outer[j] = {
                x: prev.x + c * radius,
                y: prev.y + s * radius
            };

            this.inner[j] = {
                x: prev.x - c * radius,
                y: prev.y - s * radius
            };

            this.theta[j] = da;

            radius -= step;

            prev = node;
        }
    },

    draw: function( ctx ) {

        var r, g, b, e;

        s = this.outer[0];
        e = this.inner[0];

        ctx.beginPath();
        ctx.moveTo( s.x, s.y );
        utils.curveThroughPoints( this.outer, ctx );
        utils.curveThroughPoints( this.inner.reverse(), ctx );
        ctx.lineTo( e.x, e.y );
        ctx.closePath();

        ctx.fillStyle = '#f1f1f1';
        ctx.fill();

        if ( settings.thickness > 2 ) {

            ctx.strokeStyle = '#f1f1f1';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
};

var demo = true;
var ease = 0;
var modified = false;
var radius = settings.headRadius;
var tentacles = [];
var center = { x:0, y:0 };

var sketch = Sketch.create({

    container: document.getElementById( 'container' ),

    setup: function() {

        center.x = this.width / 2;
        center.y = this.height / 2;

        var tentacle;

        for ( var i = 0; i < 100; i++ ) {

            tentacle = new Tentacle({
                length: random( 10, 20 ),
                radius: random( 0.05, 1.0 ),
                spacing: random( 0.2, 1.0 ),
                friction: random( 0.7, 0.88 )
            });

            tentacle.move( center.x, center.y, true );
            tentacles.push( tentacle );
        }
    },

    update: function() {

        var t, cx, cy, pulse;

        t = this.millis * 0.001;

        if ( settings.pulse ) {

            pulse = pow( sin( t * PI ), 18 );
            radius = settings.headRadius * 0.5 + settings.headRadius * 0.5 * pulse;
        }

        if ( settings.interactive ) {

            ease += ( 0.7 - ease ) * 0.05;

            center.x += ( this.mouse.x - center.x ) * ease;
            center.y += ( this.mouse.y - center.y ) * ease;

        } else {

            t = this.millis;
            cx = this.width * 0.5;
            cy = this.height * 0.5;

            center.x = cx + sin( t * 0.002 ) * cos( t * 0.00005 ) * cx * 1 + Math.ceil(random(0, 40) - 20);
            center.y = cy + sin( t * 0.003 ) * tan( sin( t * 0.0003 ) * 1.15 ) * cy * 0.8 + Math.ceil(random(0, 40) - 20);
        }

        var px, py, theta, tentacle;
        var step = TWO_PI / settings.tentacles;

        for ( var i = 0, n = settings.tentacles; i < n; i++ ) {

            tentacle = tentacles[i];

            theta = i * step;

            px = cos( theta ) * radius;
            py = sin( theta ) * radius;

            tentacle.move( center.x + px, center.y + py );
            tentacle.update();
        }
    },

    draw: function() {

        this.globalAlpha = 0.1;

        for ( var i = 0, n = settings.tentacles; i < n; i++ ) {
            tentacles[i].draw( this );
        }
    }
});
