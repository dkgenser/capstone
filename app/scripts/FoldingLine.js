define([
    'utilities'

], function( utilities ) {
    'use strict';

    var glMatrix = require( 'glMatrix' );

    var SNAP_DELTA = 5;
    var SNAP_INCRE = 45;

    var FoldingLine = function( options ) {
        this.parentPlane = options.parent;
        this.childPlane  = options.child;
        this.center      = options.center;
        // `this.orientation` is assigned by `this.center` setter
    };


    FoldingLine.prototype = {
        get center() { return this._center; },
        set center(val) {
            this._center = val;
            this.orientation = this._calculateOrientation();
            if ( this.childPlane !== null ) {
                this.childPlane.update();
            }
        }
    };


    /*FoldingLine.prototype = {
        get orientation() { return this._orientation; },
        set orientation(val) {
            this._orientation = val;
        }
    }*/


    FoldingLine.prototype._calculateOrientation = function() {
        var radians = Math.atan2(
            this.center[1] - this.parentPlane.center[1],
            this.center[0] - this.parentPlane.center[0]
        );
        var angle = utilities.degrees( radians ) % 360;
        angle = this._snap( angle );
        return angle + 90;
    };

    FoldingLine.prototype._snap = function( angle ) {
        var snap     = Math.round( angle/SNAP_INCRE ) * SNAP_INCRE;
        if ( Math.abs( angle - snap ) <= SNAP_DELTA ) {
            return snap;
        } 
        else {
            return angle;
        }
    };


    FoldingLine.prototype.distToParent = function () {
        return glMatrix.vec3.dist( this.center, this.parentPlane.center );
    };


    return FoldingLine;
});

