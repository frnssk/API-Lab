// the main sketch/canvas/context
// using sketch.js for this, learn more: https://soulwire.github.com/sketch.js/
var sketch = Sketch.create(),
  // keep track of the profit
  profit = 0,
  // jQuery convenience to change profit display
  profitDisplay = $(".profit span"),
  // set the magnet range in pixels
  magnetRange = 250,
  // initial color
  hue = 60,
  // delta time for speed regulation
  dt = 1,
  // the coin object collection
  coins = [],
  // number format with commas utility
  // source - https://bit.ly/14ckxAw
  numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

// set mouse coords to center by default
sketch.mouse.x = sketch.width / 2;
sketch.mouse.y = sketch.height / 2;

// set font settings
sketch.font = "bold 14px arial";
sketch.textAlign = "center";

// coin constructor
var Coin = function(x, y, value) {
  // position
  this.x = x;
  this.y = y;

  // set random initial velocity
  this.vx = random(-50, 100) / 100;
  this.vy = random(-50, 100) / 100;

  // size of the coin
  this.radius = 4;

  // how many space bucks is this worth?
  this.value = value;

  // is the coin in the magnet's (cursor) range?
  this.magnetized = false;

  // xScale keeps track of the "spin" effect on the coin
  this.xScale = 1;
  this.xScaleGrow = true;

  // has the coin been collected?
  this.collected = false;

  // initial alpha of 0, so that we can fade it in
  this.alpha = 0;

  // collection velocity
  // controls speed of floating number after collected
  this.cv = 0;
};

Coin.prototype = {
  update: function(i) {
    // fade coin in if alpha is less than 1
    if (this.alpha < 1 && !this.collected) {
      this.alpha += 0.05;
    }

    // update the xScale to create spinning effect
    // this essentially squishes the coin horizontally
    // first determine whether we are growing or shrinking
    if (this.xScaleGrow && this.xScale >= 1) {
      this.xScaleGrow = false;
    } else if (!this.xScaleGrow && this.xScale <= 0.1) {
      this.xScaleGrow = true;
    }

    // set the speed faster if magnetized
    var scaleChange = this.magnetized ? 0.15 : 0.05;

    // apply the scale change
    if (this.xScaleGrow) {
      this.xScale += scaleChange;
    } else {
      this.xScale -= scaleChange;
    }

    // if the coin has not been collected yet
    if (!this.collected) {
      // get x distance, y distance, and actual distance
      var dx = sketch.mouse.x - this.x;
      var dy = sketch.mouse.y - this.y;
      var dist = sqrt(dx * dx + dy * dy);
      // coin is in magnet range
      if (dist <= magnetRange) {
        this.magnetized = true;
        // determine the angle, x velocity, and y velocity to move toward the magnet (cursor)
        var angle = atan2(dy, dx);
        var mvx = cos(angle);
        var mvy = sin(angle);
        // adjust the power based on the distance, stronger as you get closer
        var power = 3 + 100 / dist;
        // combine power with angle and apply
        this.x += mvx * power * dt;
        this.y += mvy * power * dt;
      } else {
        // not magnetized, move based on initial random velocities
        this.magnetized = false;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      }

      // collect the coin if within magnet collection threshold
      if (dist <= 15) {
        // add to our profit
        profit += this.value;
        this.collected = true;
        this.magnetized = false;
        profitDisplay.text(numberWithCommas(profit));
      }

      // coin has been collected, send it to infinity and beyond
    } else {
      // fade out number
      this.alpha -= 0.03;
      // move up
      this.cv += 0.15;
      this.y -= this.cv * dt;
    }

    // remove the coin if it is out of bounds
    // this can occur from random drift
    // or from the vertical propelling after being collected (shown as number at this point)
    if (this.outOfBounds()) {
      coins.splice(i, 1);
    }
  },
  outOfBounds: function() {
    // compare x and y to see if in bound or not
    return (
      this.x > sketch.width + this.radius ||
      this.x < -this.radius ||
      this.y > sketch.height + this.radius ||
      this.y < -this.radius
    );
  },
  render: function() {
    // if not collected render the coin
    if (!this.collected) {
      sketch.save();
      // translate to center of coin, needed because scale is used
      sketch.translate(this.x, this.y);
      // scale to create the spinning effect
      sketch.scale(this.xScale, 1);
      sketch.beginPath();
      sketch.arc(0, 0, this.radius < 0 ? 0 : this.radius, 0, TWO_PI, false);
      // use different styles based on magnetization
      // also, adjust the lightness based on the xScale to enhance the coin spinning effect
      if (this.magnetized) {
        sketch.fillStyle =
          "hsla(0, 0%, " + this.xScale * 140 + "%, " + this.alpha + ")";
      } else {
        sketch.fillStyle =
          "hsla(" +
          hue +
          ", 100%, " +
          this.xScale * 70 +
          "%, " +
          this.alpha +
          ")";
      }
      sketch.fill();
      sketch.restore();
      // else render the value number
    } else {
      sketch.fillStyle =
        "hsla(0, 0%, 0%, " + (this.alpha < 0 ? 0 : this.alpha) + ")";
      sketch.fillText("+" + this.value, this.x, this.y + 1);
      sketch.fillStyle =
        "hsla(" +
        hue +
        ", 100%, 60%, " +
        (this.alpha < 0 ? 0 : this.alpha) +
        ")";
      sketch.fillText("+" + this.value, this.x, this.y);
    }
  }
};

// create a coin every 50 milliseconds
setInterval(function() {
  // the settings passed place it randomly and give the coin a random value
  coins.push(
    new Coin(
      random(0, sketch.width),
      random(0, sketch.height),
      floor(random(1, 100))
    )
  );
}, 50);

sketch.update = function() {
  // convert sketch.js to more usable number
  dt = sketch.dt / 16;
  // update the hue over time
  hue += 0.75;
  var i = coins.length;
  while (i--) {
    // when updating, pass in the index of the coin
    // this allows us to target the coin in the array
    // when it moves out of bounds or get collected
    coins[i].update(i);
  }
};

sketch.draw = function() {
  var i = coins.length;
  while (i--) {
    // render each coin
    coins[i].render();
  }
};

sketch.clear = function() {
  sketch.clearRect(0, 0, sketch.width, sketch.height);
};

// Or, without comments
/*
var sketch = Sketch.create(),
    profit = 0,
    profitDisplay = $( '.profit span' ),
    magnetRange = 250,
    hue = 60,
    dt = 1,
    coins = [],    
    numberWithCommas = function( x ){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

sketch.mouse.x = sketch.width / 2;
sketch.mouse.y = sketch.height / 2;
sketch.font = 'bold 14px arial';
sketch.textAlign = 'center';

var Coin = function( x, y, value ){
  this.x = x;
	this.y = y;
	this.vx = random( -50, 100 ) / 100;
	this.vy = random( -50, 100 ) / 100;
	this.radius = 4;
	this.value = value;
	this.magnetized = false;
	this.xScale = 1;
	this.xScaleGrow = true;
	this.collected = false;
	this.alpha = 0;
  this.cv = 0;
};

Coin.prototype = {
  update: function( i ){
		if( this.alpha < 1 && !this.collected ){
			this.alpha += 0.05;
		};
			
		if( this.xScaleGrow && this.xScale >= 1 ){
			this.xScaleGrow = false;
		} else if( !this.xScaleGrow && this.xScale <= .1 ){
			this.xScaleGrow = true;
		};
		
    var scaleChange = ( this.magnetized ) ? 0.15 : 0.05;
    
		if( this.xScaleGrow ){        
      this.xScale += scaleChange;
		} else {
		  this.xScale -= scaleChange;
		};
			
		if( !this.collected ){
		  var dx = sketch.mouse.x - this.x;
			var dy = sketch.mouse.y - this.y;
			var dist = sqrt( dx * dx + dy * dy );
			if( dist <= magnetRange ){
				this.magnetized = true;
				var angle = atan2( dy, dx );
				var mvx = cos( angle );
				var mvy = sin( angle );
        var power = 3 + ( 100 / dist );
				this.x += ( mvx * power ) * dt;
				this.y += ( mvy * power ) * dt; 
			} else {
				this.magnetized = false;
				this.x += this.vx * dt;
				this.y += this.vy * dt;
			};
			 
			if( dist <= 15 ){
				profit += this.value;
				this.collected = true;
				this.magnetized = false;
        profitDisplay.text( numberWithCommas( profit ) );
			};				
		
    } else {
      this.alpha -= 0.03;
      this.cv += 0.15;			
			this.y -= this.cv * dt;
    };
    
    if( this.outOfBounds() ){
			coins.splice( i, 1 );          
		};
	},
  outOfBounds: function(){
    // compare x and y to see if in bound or not
    return ( this.x > sketch.width + this.radius || this.x < -this.radius || this.y > sketch.height + this.radius || this.y < -this.radius );
  },
	render: function(){
    if(!this.collected){
		  sketch.save();
		  sketch.translate( this.x, this.y );
		  sketch.scale( this.xScale, 1 )
		  sketch.beginPath();
		  sketch.arc( 0, 0, ( this.radius < 0 ) ? 0 : this.radius, 0, TWO_PI, false );
      if(this.magnetized){
        sketch.fillStyle = 'hsla(0, 0%, ' + ( this.xScale * 140 ) + '%, ' + this.alpha + ')';
      } else {
        sketch.fillStyle = 'hsla(' + hue + ', 100%, ' + ( this.xScale * 70 ) + '%, ' + this.alpha + ')';
      };
		  sketch.fill();
		  sketch.restore();
    } else {
      sketch.fillStyle = 'hsla(0, 0%, 0%, ' + ((this.alpha < 0 ) ? 0 : this.alpha) + ')';
      sketch.fillText( '+' + this.value, this.x, this.y + 1 );
      sketch.fillStyle = 'hsla(' + hue + ', 100%, 60%, ' + ((this.alpha < 0 ) ? 0 : this.alpha) + ')';
      sketch.fillText( '+' + this.value, this.x, this.y );
    };
	}
};

setInterval(function(){
  coins.push( new Coin( random( 0, sketch.width ), random( 0, sketch.height ), floor( random( 1, 100 ) ) ) );
}, 50 );

sketch.update = function(){
  dt = sketch.dt / 16;
  hue += 0.75;
  var i = coins.length;
  while( i-- ){
    coins[ i ].update( i );  
  };
};

sketch.draw = function(){
  var i = coins.length;
  while( i-- ){
    coins[ i ].render();  
  };
};

sketch.clear = function(){
  sketch.clearRect( 0, 0, sketch.width, sketch.height );
};
*/
