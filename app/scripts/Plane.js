define(function() {
    'use strict';


    // TODO: blending, mixing opaque and transparent object
    // requires sorting objects by their proximity to the screen
    // var PLANE_COLOR        = [1.0, 1.0, 1.0, 0.25];
    var PLANE_SELECT_COLOR = [0.0, 1.0, 1.0, 1.0];

    var WIRE_COLOR        = [0.0, 0.0, 0.0, 1.0];
    var WIRE_SELECT_COLOR = [0.0, 1.0, 1.0, 1.0];

    // Requires an array of counter-clockwise points
    var Plane = function( options ) {
        this.points    = options.points;
        this.wireframe = options.wireframe;
        this.gl        = options.gl;

        // bounding sphere
    };


    // BufferSet
    Plane.prototype._constructBuffers = function() {
        return new BufferSet( { gl: this.gl }, {
            positions:      this._constructTriangles,
            colors:         FOLDING_LINE_COLORS,
            textureCoords:  FOLDING_LINE_TEXTURE_COORDS
        });
    };

    Plane.prototype._constructTriangles = function() {
        var first = this.points[0];
        var last  = this.points[1];
        var next;

        var verticies = [];

        for(var i = 2; i < this.points.length; i++) {
            next = this.points[i];
            verticies.push( first );
            verticies.push( last );
            verticies.push( next );

            last = next;
        };

        return verticies;
    };

    Plane.prototype.draw = function() {

    };

    // TODO: intersects, select


    return Prism;
});