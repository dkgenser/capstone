define(function( require ) {
    'use strict';


    var glMatrix  = require( 'glMatrix' ),
        utilities = require( 'utilities' );


    var PlaneView = function( options ) {
        this.width       = options.width;
        this.center      = options.center;
        this.orientation = options.orientation;
        this.framebuffer = options.framebuffer;
        this.view        = options.view;

        this.view.mvMatrix = glMatrix.mat4.create();
        this._calculateMVMatrix();

        this.selected = false;

        // Tree information
        this.parentLine = null;
        this.children = [];
    };


    PlaneView.prototype.renderToTexture = function() {
        this.framebuffer.renderToBuffer( this.view );
    };


    PlaneView.prototype.intersects = function( coords ) {
        return glMatrix.vec2.distance( coords, this.center ) <= this.width / 2;
    };


    PlaneView.prototype._transferDistance = function() {
        // TODO: set default distance ( (planeWidth + margin) / 2 )
        if (this.parentLine === null) {
            return this.width / 2;
        }
        return this.parentLine.distToParent();
    };


    PlaneView.prototype._calculateMVMatrix = function() {
        glMatrix.mat4.identity( this.view.mvMatrix );
        glMatrix.mat4.lookAt( this.view.mvMatrix, this.view.eye, this.view.center, this.view.up );
    };


    PlaneView.prototype.update = function( ) {
        var fl        = this.parentLine;
        if ( fl === null ) return;

        var distance  = fl.parentPlane._transferDistance() + fl.distToParent();
        var radians   = utilities.radians( fl.orientation - 90 );
        this.center = [
            fl.parentPlane.center[0] + distance * Math.cos( radians ),
            fl.parentPlane.center[1] + distance * Math.sin( radians ),
            fl.parentPlane.center[2]
        ];
        this.orientation = ( fl.orientation + 180 ) % 360,
        this.view = this._calculateView( fl );
        this._calculateMVMatrix();
    };


    PlaneView.prototype.createChild = function( options ) {
        var fl        = options.foldingLine;
        var distance  = this._transferDistance() + fl.distToParent();
        var radians   = utilities.radians( fl.orientation - 90 );
        return new PlaneView({
            width: this.width,
            center: [
                this.center[0] + distance * Math.cos( radians ),
                this.center[1] + distance * Math.sin( radians ),
                this.center[2]
            ],
            orientation: ( fl.orientation + 180 ) % 360,
            view: this._calculateView( fl ),
            framebuffer: options.framebuffer
        });
    };


    PlaneView.prototype.cloneView = function( view ) {
        return {
            eye:      glMatrix.vec3.clone( view.eye ),
            center:   glMatrix.vec3.clone( view.center ),
            up:       glMatrix.vec3.clone( view.up ),
            pMatrix:  view.pMatrix,
            mvMatrix: glMatrix.mat4.create(),
        };
    };


    PlaneView.prototype.getLineOfSight = function( view ) {
        var los = glMatrix.vec3.create();
        glMatrix.vec3.subtract(
            los,
            view.eye,
            view.center
        );
        glMatrix.vec3.normalize( los, los );
        return los;
    };


    PlaneView.prototype._calculateView = function( fl ) {
        var parent = fl.parentPlane;

        var childView  = this.cloneView( parent.view );
        var lineOfSight = this.getLineOfSight( parent.view );

        var rotationAxis = glMatrix.vec3.create();
        var createRA = glMatrix.quat.create();
        glMatrix.quat.setAxisAngle(
            createRA,
            lineOfSight,
            utilities.radians( fl.orientation + 90 - parent.orientation )
        );
        glMatrix.vec3.transformQuat( rotationAxis, parent.view.up, createRA );
        var rotateView = glMatrix.quat.create();
        glMatrix.quat.setAxisAngle(
            rotateView,
            rotationAxis,
            utilities.radians( -90 )
        );

        // new eye
        glMatrix.vec3.transformQuat( childView.eye, childView.eye, rotateView );

        // new up, first rotation
        var turnView = glMatrix.quat.create();
        glMatrix.quat.setAxisAngle(
            turnView,
            lineOfSight,
            utilities.radians( fl.orientation + 180 - parent.orientation )
        );
        glMatrix.vec3.transformQuat( childView.up, childView.up, turnView );
        glMatrix.vec3.normalize( childView.up, childView.up );

        glMatrix.vec3.transformQuat( childView.up, childView.up, rotateView );
        glMatrix.vec3.normalize( childView.up, childView.up );

        return childView;
    };


    return PlaneView;
});
