define([
    'BufferSet'
], function( BufferSet ) {
    'use strict';

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
    var F_COLORS = new Float32Array( 384 );
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

    var S_COLORS_COMPRESSED = [
        [1.0, 0.0, 0.0, 1.0],     // Front face (red)
        [1.0, 1.0, 0.0, 1.0],     // Back face (yellow)
        [0.0, 1.0, 0.0, 1.0],     // Top face (green)
        [1.0, 0.5, 0.5, 1.0],     // Bottom face (light pink)
        [1.0, 0.0, 1.0, 1.0],     // Right face (magenta)
        [0.0, 0.0, 1.0, 1.0],     // Left face (blue)
    ];
    var S_COLORS = [];
    // Concatenate each sub-array four times.
    for ( var i = 0; i < S_COLORS.length; i++ ) {
        for ( var j = 0; j < 4; j++ ) {
            S_COLORS = S_COLORS.concat( S_COLORS_COMPRESSED[ i ] );
        }
    }
    S_COLORS = new Float32Array( S_COLORS );

    var S_TEXTURE_COORDS = new Float32Array( 48 );

    var S_INDICES = new Uint16Array([
        // Front face
        0, 1, 2, 0, 2, 3,
        // Back face
        4, 5, 6, 4, 6, 7,
        // Top face
        8, 9, 10, 8, 10, 11,
        // Bottom face
        12, 13, 14, 12, 14, 15,
        // Right face
        16, 17, 18, 16, 18, 19,
        // Left face
        20, 21, 22, 20, 22, 23
    ]);

    var ModelWorld = function ( options ) {
        this.gl    = options.gl;
        this.rCube = options.rCube || 0;

        // TODO: allow callers to control the data going in

        this.F = new BufferSet( { gl: this.gl }, {
            positions: F_POSITIONS,
            colors: F_COLORS,
            textureCoords: F_TEXTURE_COORDS
        });

        this.S = new BufferSet( { gl: this.gl }, {
            positions: S_POSITIONS,
            colors: S_COLORS,
            textureCoords: S_TEXTURE_COORDS,
            indices: S_INDICES
        });
    };

    ModelWorld.prototype.draw = function( options ) {
        var world = options.world;
        this.gl.uniform1i( world.program.useTexturesUniform, false );

        // Draw F
        this.F.assignVertexAttributes( world.program );
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.F.positions.numItems );

        // Draw box
        world.pushMvMatrix();
        world.rotateMvMatrix({ degrees: this.rCube });
        this.S.assignVertexAttributes( world.program );
        this.gl.bindBuffer(
            this.gl.ELEMENT_ARRAY_BUFFER,
            this.S.indices.buffer
        );
        world.setMatrixUniforms();
        this.gl.drawElements(
            this.gl.TRIANGLES,          // GLenum mode
            this.S.indices.numItems,    // GLsizei count
            this.gl.UNSIGNED_SHORT,     // GLenum type
            0                           // GLintptr offset
        );
        world.popMvMatrix();
    };

    return ModelWorld;
});
