define(function( require ) {
    'use strict';

    var BufferSet   = require( 'BufferSet' ),
        glMatrix    = require( 'glMatrix' );

    // TODO: blending, mixing opaque and transparent object
    // requires sorting objects by their proximity to the screen
    // var PLANE_COLOR        = [1.0, 1.0, 1.0, 0.25];
    var PLANE_SELECT_COLOR = [0.0, 1.0, 1.0, 1.0];

    var WIRE_COLOR        = [0.0, 0.0, 0.0, 1.0];
    var WIRE_SELECT_COLOR = [0.0, 1.0, 1.0, 1.0];

    // Requires an array of counter-clockwise points
    var Plane = function( options ) {
        this.world     = options.world;
        this.gl        = options.gl;

        this.points    = options.points;
        this.wireframe = options.wireframe;
        
        this.selected  = false;
        this.triangles = this._constructTriangles();
        this._constructBuffers();
        // TODO: bounding sphere
    };


    // BufferSet
    Plane.prototype._constructBuffers = function() {
        //Wireframe buffer 
        this.wireBuffer = new BufferSet( { gl: this.gl }, {
            positions:      this._constructWireframe(),
            colors:         WIRE_COLOR,
            textureCoords:  new Float32Array( 2 *(this.points.length) ),
        });

        //Planes buffer
        this.planeBuffer = new BufferSet( { gl: this.gl }, {
            positions:      this._constructTriPositions(),
            colors:         PLANE_SELECT_COLOR,
            textureCoords:  new Float32Array( 2 *( 3 *( this.points.length - 2 ))),
        });
    };

    Plane.prototype._constructWireframe = function() {
        var positions = [];
        for(var i = 0; i < this.points.length; i++) {
            positions = positions.concat( this.points[i] );
        }; 
        return new Float32Array( positions );
    };

    Plane.prototype._constructTriPositions = function() {
        if ( this.triangles === null ) {
            this.triangles = this._constructTriangles();
        }

        var verticies = [];

        for(var i = 0; i < this.triangles.length; i++) {
            verticies = verticies.concat( this.triangles[i][0] );
            verticies = verticies.concat( this.triangles[i][1] );
            verticies = verticies.concat( this.triangles[i][2] );
        };

        return new Float32Array( verticies );
    }

    Plane.prototype._constructTriangles = function() {
        var first = this.points[0];
        var last  = this.points[1];
        var next;

        var triangles = [];

        for(var i = 2; i < this.points.length; i++) {
            next = this.points[i];
            var triangle = [];
            triangle.push( first );
            triangle.push( last );
            triangle.push( next );

            last = next;
            triangles.push( triangle );
        };

        return triangles;
    };

    Plane.prototype.draw = function() {
        this.gl.uniform1i( this.world.program.useTexturesUniform, false );

        //LINE_LOOP
        this.wireBuffer.assignVertexAttributes( this.world.program );
        this.world.setMatrixUniforms();
        this.gl.drawArrays(
            this.gl.LINE_LOOP,
            0,
            this.wireBuffer.positions.numItems
        );

        //TRIANGLES
        if( this.selected ) { 
            this.planeBuffer.assignVertexAttributes( this.world.program );
            this.world.setMatrixUniforms();
            this.gl.drawArrays(
                this.gl.TRIANGLES,
                0,
                this.planeBuffer.positions.numItems
            ); 
        }
    };


    /* Code adapted from raytracer assignment */
    Plane.prototype.intersects = function( options ) {
        var e   = options.eye;
        var d   = options.direction;
        var t   = options.time;
        var min = options.min;
        var max = options.max;

        var intersected = false;
        
        this.triangles.forEach( function( triangle ) {
            var a = triangle[0];
            var b = triangle[1];
            var c = triangle[2];

            var u = [0, 0, 0];
            var v = [0, 0, 0];
            var w = [0, 0, 0];

            glMatrix.vec3.subtract(u, a, b);
            glMatrix.vec3.subtract(v, a, c);
            glMatrix.vec3.subtract(w, a, e);

            var eihf = v[1]*d[2] - d[1]*v[2];
            var gfdi = d[0]*v[2] - v[0]*d[2];
            var dheg = v[0]*d[1] - d[0]*v[1];
            var akjb = u[0]*w[1] - w[0]*u[1];
            var jcal = w[0]*u[2] - u[0]*w[2];
            var blkc = u[1]*w[2] - w[1]*u[2];

            var M = u[0]*eihf + u[1]*gfdi + u[2]*dheg;
            if ( M === 0 ) {
                alert( " M = 0 ");
            }

            //calculated first in hopes of gaining some efficiency
            var tempt = (v[2]*akjb + v[1]*jcal + v[0]*blkc) / M;

            if( tempt < min || tempt > max )
            {
                alert(tempt);
                return false;
            }

            if( t !== null ) { t = tempt; }

            var beta = (w[0]*eihf + w[1]*gfdi + w[2]*dheg) / M;
            alert ( beta );

            if( beta<0 || beta>1 ) 
            {
                return false;
            }

            var gamma = (d[2]*akjb + d[1]*jcal + d[0]*blkc) / M;
            alert( gamma );
            if( gamma<0 || gamma > 1 - beta ) 
            {
                return false;
            }

            intersected = true;
        });

        return intersected;
    };


    return Plane;
});