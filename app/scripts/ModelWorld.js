define([
    'BufferSet'
], function( BufferSet ) {
    'use strict';

    var repeatArray = function( n, array ) {
        var xs = [];
        for ( var i = 0; i < n; i += 1 ) {
            xs = xs.concat( array );
        }
        return xs;
    };

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

    var S_POSITIONS = new Float32Array([
        // Front face
        -50.0, -50.0, 50.0, 50.0, -50.0, 50.0,
        50.0, 50.0, 50.0, -50.0, 50.0, 50.0,
        // Back face
        -50.0, -50.0, -50.0, -50.0,  50.0, -50.0,
        50.0,  50.0, -50.0, 50.0, -50.0, -50.0,
        // Top face
        -50.0,  50.0, -50.0, -50.0,  50.0,  50.0,
        50.0,  50.0,  50.0, 50.0,  50.0, -50.0,
        // Bottom face
        -50.0, -50.0, -50.0, 50.0, -50.0, -50.0,
        50.0, -50.0,  50.0, -50.0, -50.0,  50.0,
        // Right face
        50.0, -50.0, -50.0, 50.0,  50.0, -50.0,
        50.0,  50.0,  50.0, 50.0, -50.0,  50.0,
        // Left face
        -50.0, -50.0, -50.0, -50.0, -50.0,  50.0,
        -50.0,  50.0,  50.0, -50.0,  50.0, -50.0,
    ]);

    // TODO: abstract out color logic (apply to Paper too)

    var ModelWorld = function ( options ) {
        this.gl    = options.gl;
        this.rCube = options.rCube || 0;

        // TODO: allow callers to control the data going in

        this.F = new BufferSet( { gl: this.gl }, {
            positions: F_POSITIONS,
            colors: F_COLOR,
            textureCoords: F_TEXTURE_COORDS
        });
    };

    ModelWorld.prototype.draw = function( options ) {
        var world = options.world;
        this.gl.uniform1i( world.program.useTexturesUniform, false );

        // Draw F
        this.F.assignVertexAttributes( world.program );
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.F.positions.numItems );

    };

    return ModelWorld;
});
