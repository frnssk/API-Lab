var colors = ['#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80' ];
var radius = 0;

Sketch.create({

    container: document.getElementById( 'container' ),
    autoclear: false,
    retina: 'auto',

    setup: function() {
        console.log( 'setup' );
    },

    update: function() {
        radius = 2 + abs( sin( this.millis * 0.003 ) * 50 );
    },

    // Event handlers

    keydown: function() {
        if ( this.keys.C ) this.clear();
    },

    touchmove: function() {

        for ( var i = this.touches.length - 1, touch; i >= 0; i--){

            touch = this.touches[i];

            this.lineCap = 'round';
            this.lineJoin = 'round';
            this.fillStyle = this.strokeStyle = colors[ i % colors.length ];
            this.lineWidth = radius;

            this.beginPath();
            this.moveTo( touch.ox, touch.oy );
            this.lineTo( touch.x, touch.y );
            this.stroke();
        }
    }
});