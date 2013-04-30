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
        //TODO: set default distance ( (planeWidth + margin) / 2 )
        if(this.parentLine === null) {
            return this.width / 2;
        }

        return this.parentLine.distToParent();
    };


    PlaneView.prototype.createChild = function( options ) {
        var flCenter = options.foldingLine.center;
        var flAngle  = options.foldingLine.orientation;

        // center of the child plane
        var transDist = this._transferDistance();
        var radians = utilities.radians( flAngle - 90 );
        var childPlaneCenter = [
            flCenter[0] + transDist * Math.cos( radians ),
            flCenter[1] + transDist * Math.sin( radians ),
            this.center[2]
        ];

        // child plane's view (camera)
        var childView = this._createChildView( options.foldingLine );

        // child plane's rotation
        var childPlaneOrientation = ( flAngle + 180 ) % 360;

        // compilation of all parts
        var newChild = new PlaneView({
            width: this.width,
            center: childPlaneCenter,
            orientation: childPlaneOrientation,
            view: {
                eye: childView.eye,
                center: childView.center,
                up: childView.up
            },
            framebuffer: options.framebuffer
        });

        return newChild;
    };


    PlaneView.prototype._createChildView = function( foldingLine ) {
        var flAngle    = foldingLine.orientation;
        var pPAngle    = foldingLine.parentPlane.orientation;
        var parentView = foldingLine.parentPlane.view;

        var childView  = {
            eye: glMatrix.vec3.clone( parentView.eye ),
            center: glMatrix.vec3.clone( parentView.center ),
            up: glMatrix.vec3.clone( parentView.up )
        };

        var lineOfSight = glMatrix.vec3.create();
        glMatrix.vec3.subtract(
            lineOfSight,
            parentView.eye,
            parentView.center
        );
        glMatrix.vec3.normalize( lineOfSight, lineOfSight );

        var rotationAxis = glMatrix.vec3.create();
        var createRA = glMatrix.quat.create();
        glMatrix.quat.setAxisAngle(
            createRA,
            lineOfSight,
            utilities.radians( flAngle + 90 - pPAngle )
        );
        glMatrix.vec3.transformQuat( rotationAxis, parentView.up, createRA );
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
            utilities.radians( flAngle + 180 - pPAngle )
        );
        glMatrix.vec3.transformQuat( childView.up, childView.up, turnView );
        glMatrix.vec3.normalize( childView.up, childView.up );

        glMatrix.vec3.transformQuat( childView.up, childView.up, rotateView );
        glMatrix.vec3.normalize( childView.up, childView.up );

        return childView;
    };


    return PlaneView;
});

