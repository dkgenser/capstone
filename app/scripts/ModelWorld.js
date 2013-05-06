define(function( require ) {
    'use strict';

    var Plane   = require( 'Plane' ),
        BufferSet   = require( 'BufferSet' );

    // TODO: extract these multiplier numbers with ITEM_SIZES in Buffer

    var F_POSITIONS = new Float32Array([
        0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0, 30, 0,
        0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0, 30, 60, 0,
        67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0, 0, 0, 30, 30, 0,
        30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30, 30, 0, 30, 100, 0,
        30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30, 30, 60, 30, 67,
        60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30, 0, 0, 0, 100,
        0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30, 100, 0, 0, 100, 30, 0,
        100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30, 30, 30, 0, 30, 30, 30,
        100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0, 30, 30, 0, 30, 30, 30,
        30, 60, 30, 30, 30, 0, 30, 60, 30, 30, 60, 0, 30, 60, 0, 30, 60, 30,
        67, 60, 30, 30, 60, 0, 67, 60, 30, 67, 60, 0, 67, 60, 0, 67, 60, 30,
        67, 90, 30, 67, 60, 0, 67, 90, 30, 67, 90, 0, 30, 90, 0, 30, 90, 30,
        67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0, 30, 90, 0, 30, 90, 30,
        30, 150, 30, 30, 90, 0, 30, 150, 30, 30, 150, 0, 0, 150, 0, 0, 150, 30,
        30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0, 0, 0, 0, 0, 0, 30, 0,
        150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0
    ]);
    var F_COLOR  = [0.0, 0.0, 0.0, 1.0];
    var F_TEXTURE_COORDS = new Float32Array( 192 );


    var ModelWorld = function ( options ) {
        this.gl    = options.gl;
        this.world = options.world;
        this.rCube = options.rCube || 0;

        // TODO: allow callers to control the data going in

        this.F = new BufferSet( { gl: this.gl }, {
            positions: F_POSITIONS,
            colors: F_COLOR,
            textureCoords: F_TEXTURE_COORDS
        });

        this.objects = [];

        this.objects.push( new Plane ({
            gl: this.gl,
            world: this.world,
            points: [
                [-50.0, -50.0, 50.0],
                [ 50.0, -50.0, 50.0],
                [ 50.0,  50.0, 50.0],
                [-50.0,  50.0, 50.0],
            ],
            wireframe: true,
        }) );


    };

    ModelWorld.prototype.draw = function() {
        this.gl.uniform1i( this.world.program.useTexturesUniform, false );

        // Draw F
        this.F.assignVertexAttributes( this.world.program );
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.F.positions.numItems );

        this.objects.forEach( function( obj ){
            obj.draw();
        });
    };

    ModelWorld.prototype.intersect = function( options ) {
        var collection = [];

        this.objects.forEach( function( obj ){
            if ( obj.intersects( options ) ) { 
                collection.push( obj );
            }
        });

        return collection;
    };

    return ModelWorld;
});
