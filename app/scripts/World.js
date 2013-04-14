define([
    'glMatrix',

    'utilities',
    'shaders',
    'Framebuffer',
    'ModelWorld',
    'Paper'

], function( glMatrix, utilities, shaders, Framebuffer, ModelWorld, Paper ) {
    'use strict';

    var World = function( options ) {
        // Copy all configuration properties directly to the World object.
        // (this makes more semantic sense, internally and externally)
        for ( var prop in options ) {
            this[ prop ] = options[ prop ];
        }

        this.canvas       = this._initializeCanvas();
        this.gl           = this._initializeGL();
        this.program      = this._initializeProgram();
        this.framebuffers = this._initializeFramebuffers();
        this.modelWorld   = new ModelWorld({ gl: this.gl });
        this.paper        = new Paper({ world: this });

        this.gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
        this.gl.enable( this.gl.DEPTH_TEST );
        this.gl.depthFunc( this.gl.LEQUAL );

        this.mvMatrix = glMatrix.mat4.create();
        this.pMatrix = glMatrix.mat4.create();
        this.mvMatrixStack = [];

        // interact.initInteraction(canvas);
    };

    World.prototype.tick = function () {
        utilities.requestAnimationFrame( World.prototype.tick.bind( this ) );
        this.gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
        this.paper.render();
        this.gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
        this.paper.draw();
    };

    World.prototype.rotateMvMatrix = function( options ) {
        glMatrix.mat4.rotate(
            this.mvMatrix,                              // out
            this.mvMatrix,                              // a
            utilities.radians( options.degrees ),       // radians
            [ 1, 1, 1 ]                                 // axis
        );
    };

    World.prototype.pushMvMatrix = function() {
        this.mvMatrixStack.push( glMatrix.mat4.clone( this.mvMatrix ) );
    };

    World.prototype.popMvMatrix = function() {
        if (this.mvMatrixStack.length === 0) {
            alert( 'ModelWorld: can\'t pop empty matrix stack!' );
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    };

    World.prototype.setMatrixUniforms = function() {
        this.gl.uniformMatrix4fv(
            this.program.pMatrixLocation, false, this.pMatrix
        );
        this.gl.uniformMatrix4fv(
            this.program.mvMatrixLocation, false, this.mvMatrix
        );
    };

    // These functions don't assign directly to the properties. Rather,
    // they just return the value to be assigned. This is better for
    // testability, reusability and clarity. It lets us see all the
    // properties of the object straight from the constructor.

    World.prototype._initializeCanvas = function() {
        var container = document.querySelector( this.containerSelector );
        var canvas = document.createElement( 'canvas' );
        canvas.width = container.width;
        canvas.height = container.height;
        container.appendChild( canvas );
        return canvas;
    };

    World.prototype._initializeGL = function() {
        var gl;
        try {
            gl = this.canvas.getContext( 'experimental-webgl' );
            gl.viewportWidth = this.canvas.width;
            gl.viewportHeight = this.canvas.height;
        } catch ( e ) {}
        if ( !gl ) {
            alert( 'Could not initialise WebGL, sorry :-(' );
        }
        return gl;
    };

    World.prototype._initializeProgram = function() {
        var program = this.gl.createProgram();
        this.gl.attachShader( program, shaders.get( this.gl, 'vert' ) );
        this.gl.attachShader( program, shaders.get( this.gl, 'frag' ) );
        this.gl.linkProgram( program );
        if ( !this.gl.getProgramParameter( program, this.gl.LINK_STATUS ) ) {
            alert( 'Could not link the GL program.' );
        }
        this.gl.useProgram( program );

        var bindAttr = function( property, attr ) {
            program[ property ] = this.gl.getAttribLocation( program, attr );
            this.gl.enableVertexAttribArray( program[ property ] );
        }.bind( this );
        bindAttr( 'positionLocation', 'aVertexPosition' );
        bindAttr( 'textureLocation', 'aTextureCoord' );
        bindAttr( 'colorLocation', 'aVertexColor' );

        var bindUniform = function( property, attr ) {
            program[ property ] = this.gl.getUniformLocation( program, attr );
        }.bind( this );
        // `uSampler` indicates what texture number to use.
        bindUniform( 'samplerUniform', 'uSampler' );
        bindUniform( 'mvMatrixLocation', 'uMVMatrix' );
        bindUniform( 'pMatrixLocation', 'uPMatrix' );
        bindUniform( 'useTexturesUniform', 'uUseTextures' );

        return program;
    };

    World.prototype._initializeFramebuffers = function() {
        var fbs = [];
        for ( var i = 0; i < this.textureLen; i++ ) {
            fbs.push( new Framebuffer({
                world: this,
                width: this.framebufferWidth,
                height: this.framebufferHeight,
                textureNumber: i
            }) );
        }
        return fbs;
    };

    World.prototype.drawView = function( view ) {
        this.gl.viewport(
            0, 0, this.framebufferWidth, this.framebufferHeight
        );
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

        // TODO: also, only calculated once? set and save pMatrix
        glMatrix.mat4.ortho(
            this.pMatrix,
            -this.framebufferWidth / 2,
            this.framebufferHeight / 2,
            -this.framebufferWidth / 2,
            this.framebufferHeight / 2,
            0.1,
            2 * this.boundingSphereRadius
        );

        glMatrix.mat4.identity( this.mvMatrix );
        glMatrix.mat4.lookAt( this.mvMatrix, view.eye, view.center, view.up );

        this.setMatrixUniforms();

        this.modelWorld.draw({ world: this });
    };

    World.prototype._prepareMvMatrixToDraw = function( obj ) {
        this.pushMvMatrix();
        glMatrix.mat4.translate( this.mvMatrix, this.mvMatrix, obj.center );
        glMatrix.mat4.rotateZ(
            this.mvMatrix,
            this.mvMatrix,
            utilities.radians( obj.orientation )
        );
    };

    World.prototype.drawPlane = function( planeView ) {
        this._prepareMvMatrixToDraw( planeView );

        this.paper.planeVertex.assignVertexAttributes( this.program );
        planeView.framebuffer.prepareToDraw( this.program );
        this.setMatrixUniforms();
        this.gl.drawArrays(
            this.gl.TRIANGLE_STRIP,
            0,
            this.paper.planeVertex.positions.numItems
        );

        // Draw circle for highlighting
        if ( this.selected ) {
            this.gl.uniform1i( this.program.useTexturesUniform, false );
            this.paper.planeCircle.assignVertexAttributes( this.program );
            this.gl.drawArrays(
                this.gl.LINE_LOOP,
                0,
                this.paper.planeCircle.positions.numItems
            );
        }

        this.popMvMatrix();
    };

    World.prototype.drawFoldingLine = function( foldingLine ) {
        this._prepareMvMatrixToDraw( foldingLine );
        this.gl.uniform1i( this.program.useTexturesUniform, false);
        this.paper.foldingLine.assignVertexAttributes( this.program );
        this.setMatrixUniforms();
        this.gl.drawArrays(
            this.gl.LINE_STRIP,
            0,
            this.paper.foldingLine.positions.numItems
        );
        this.popMvMatrix();
    };

    return World;
});
