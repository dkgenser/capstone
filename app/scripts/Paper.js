define(function( require ) {
    // TODO: JSHint is right to complain: the data generation in this
    // module should be put elsewhere.

    'use strict';

    var utilities   = require( 'utilities' ),
        BufferSet   = require( 'BufferSet' ),
        PlaneView   = require( 'PlaneView' ),
        FoldingLine = require( 'FoldingLine' );

    // TODO: make these configurable from main.js
    var PLANE_WIDTH = 250;
    var MARGIN = 5;

    var repeatArray = function( n, array ) {
        var xs = [];
        for ( var i = 0; i < n; i += 1 ) {
            xs = xs.concat( array );
        }
        return xs;
    };

    var circularVertices = function( options ) {
        var step = 360 / options.n;
        var vertices = [];
        var radius = PLANE_WIDTH / 2;
        for ( var angle = 0; angle <= 360; angle += step ) {
            var radians = utilities.radians( angle );
            vertices.push( radius * Math.cos( radians ) );
            vertices.push( radius * Math.sin( radians ) );
            vertices.push( 0 );
        }
        return vertices;
    };

    var PLANE_VERTEX_POSITIONS = new Float32Array([
        -PLANE_WIDTH/2, PLANE_WIDTH/2, 0,       // Top-left corner
        PLANE_WIDTH/2, PLANE_WIDTH/2, 0,        // Top-right corner
        -PLANE_WIDTH/2, -PLANE_WIDTH/2, 0,      // Bottom-left corner
        PLANE_WIDTH/2, -PLANE_WIDTH/2, 0,       // Bottom-right corner
    ]);
    var PLANE_VERTEX_COLORS = new Float32Array( 16 );
    var PLANE_VERTEX_TEXTURE_COORDS = new Float32Array([
        0.0, 1.0,                               // Top-left corner
        1.0, 1.0,                               // Top-right corner
        0.0, 0.0,                               // Bottom-left corner
        1.0, 0.0                                // Bottom-right corner
    ]);

    var PLANE_CIRCLE_SIZE = 72;
    var PLANE_CIRCLE_POSITIONS =
        new Float32Array( circularVertices({ n: PLANE_CIRCLE_SIZE }) );
    var PLANE_CIRCLE_COLORS =
        new Float32Array( repeatArray( PLANE_CIRCLE_SIZE + 1, [ 1, 1, 0, 1 ] ) );
    var PLANE_CIRCLE_TEXTURE_COORDS =
        new Float32Array( 2 * (PLANE_CIRCLE_SIZE + 1) );

    var FOLDING_LINE_SIZE = 2;
    var FOLDING_LINE_POSITIONS = new Float32Array([
        -(PLANE_WIDTH * 0.75), 0, 0,            // Left
        (PLANE_WIDTH * 0.75), 0, 0,             // Right
    ]);
    var FOLDING_LINE_COLORS =
        new Float32Array( repeatArray( FOLDING_LINE_SIZE, [ 0, 0, 0, 1 ] ) );
    var FOLDING_LINE_TEXTURE_COORDS =
        new Float32Array( FOLDING_LINE_SIZE * 2 );


    var Paper = function( options ) {
        this.world = options.world;

        // TODO: allow callers to control the data going in

        this.planeVertex = new BufferSet( { gl: this.world.gl }, {
            positions:      PLANE_VERTEX_POSITIONS,
            colors:         PLANE_VERTEX_COLORS,
            textureCoords:  PLANE_VERTEX_TEXTURE_COORDS
        });

        this.planeCircle = new BufferSet( { gl: this.world.gl }, {
            positions:      PLANE_CIRCLE_POSITIONS,
            colors:         PLANE_CIRCLE_COLORS,
            textureCoords:  PLANE_CIRCLE_TEXTURE_COORDS
        });

        this.foldingLine = new BufferSet( { gl: this.world.gl }, {
            positions:      FOLDING_LINE_POSITIONS,
            colors:         FOLDING_LINE_COLORS,
            textureCoords:  FOLDING_LINE_TEXTURE_COORDS
        });

        this.planes = [
            // Top view
            new PlaneView({
                width: PLANE_WIDTH,
                center: [ 0, (PLANE_WIDTH + MARGIN) / 2, 0 ],
                orientation: 0,
                view: {
                    eye: [ 0, this.world.boundingSphereRadius, 0 ],
                    center: [ 0, 0, 0 ],
                    up: [ 0, 0, -1 ]
                },
                framebuffer: this.world.framebuffers.pop()
            }),
            // Front view
            new PlaneView({
                width: PLANE_WIDTH,
                center: [ 0, -(PLANE_WIDTH + MARGIN) / 2, 0 ],
                orientation: 0,
                view: {
                    eye: [ 0, 0, this.world.boundingSphereRadius ],
                    center: [ 0, 0, 0 ],
                    up: [ 0, 1, 0 ]
                },
                framebuffer: this.world.framebuffers.pop()
            })
        ];

        this.foldingLines = [];

        this._linkPlanes({
            parent: this.planes[ 0 ],
            child: this.planes[ 1 ],
            center: [ 0, 0, 0 ]
        });
    };

    Paper.prototype._linkPlanes = function( options ) {
        var fl = new FoldingLine( options );
        options.parent.children.push( fl );
        if(options.child !== null ) {
            options.child.parentLine = fl;
        }
        this.foldingLines.push( fl );
        return fl;
    };


    Paper.prototype.render = function() {
        this.planes.forEach(function( plane ) {
            plane.renderToTexture();
        });
    };


    Paper.prototype.draw = function() {
        this.planes.forEach(function( plane ) {
            this.world.drawPlane( plane );
        }.bind( this ));

        this.foldingLines.forEach(function( foldingLine ) {
            this.world.drawFoldingLine( foldingLine );
        }.bind( this ));
    };

    Paper.prototype.addFoldingLine = function( options ) {
        return this._linkPlanes( options );
    };

    Paper.prototype.addChildPlane = function( foldingLine ) {
        if ( foldingLine.childPlane !== null ) {
            return;
        }

        var childPlane = foldingLine.parentPlane.createChild({
            foldingLine: foldingLine,
            framebuffer: this.world.framebuffers.pop()
        });

        // link foldingline and planes
        foldingLine.childPlane = childPlane;
        childPlane.parentLine = foldingLine;

        this.planes.push(childPlane);
    };


    return Paper;
});

