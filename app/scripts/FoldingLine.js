define([
    'utilities'

], function( utilities ) {
    'use strict';

    var glMatrix = require( 'glMatrix' );

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
        }
    };

    FoldingLine.prototype._calculateOrientation = function() {
        var radians = Math.atan2(
            this.center[1] - this.parentPlane.center[1],
            this.center[0] - this.parentPlane.center[0]
        );
        var angle = utilities.degrees( radians ) % 360;
        return angle + 90;
    };

    FoldingLine.prototype.distToParent = function(){
        return glMatrix.vec3.dist(this.center, this.parentPlane.center);
    };

    return FoldingLine;
});


 // FoldingLine.prototype.createChild = function(){
 // 	if(this.child != null) return this.child;

 // 	//center of the new plane
 // 	var transDist = this.parentPlane.transferDistance();
 // 	var childPlaneCenter = [this.center[0] + transDist * Math.cos(degToRad(this.orientation-90)),
 // 	 this.center[1] + transDist * Math.sin(degToRad(this.orientation-90)), 0];

 // 	//the view (camera)
 // 	var childView = this.createChildView();
 // 	var childPlaneView = new View(childView.eye, childView.center, childView.up);
 // 	
 // 	//the new plane's rotation
 // 	var childPlaneOrientation = (this.orientation +180) % 360;

 // 	var newChild = new PlaneView(childPlaneCenter, childPlaneOrientation,
 // 	 	childPlaneView, RTT.fbos.pop());
 // 	newChild.parentLine = this;
 // 	this.childPlane = newChild;

 // 	return newChild;
 // }

 // FoldingLine.prototype.createChildView = function(){
 // 	var parentView = this.parentPlane.view;
 // 	var childView = {
 // 		eye: vec3.clone(parentView.eye),
 // 	 	center: vec3.clone(parentView.center),
 // 	 	up: vec3.clone(parentView.up)
 // 	};

 // 	var lineOfSight = vec3.create();
 // 	vec3.subtract(lineOfSight, parentView.eye, parentView.center);
 // 	vec3.normalize(lineOfSight, lineOfSight); 
 // 	
 // 	var rotationAxis = vec3.create();
 // 	var createRA = quat.create();
 // 	quat.setAxisAngle(createRA, lineOfSight, degToRad(this.orientation+90-this.parentPlane.orientation));
 // 	vec3.transformQuat(rotationAxis, parentView.up, createRA);
 // 	var rotateView = quat.create();
 // 	quat.setAxisAngle(rotateView, rotationAxis, degToRad(-90));

 // 	//new eye
 // 	vec3.transformQuat(childView.eye, childView.eye, rotateView);
 // 	
 // 	//new up, first rotation
 // 	var turnView = quat.create();
 // 	quat.setAxisAngle(turnView, lineOfSight, degToRad(this.orientation+180-this.parentPlane.orientation));
 // 	vec3.transformQuat(childView.up, childView.up, turnView);
 // 	vec3.normalize(childView.up, childView.up);
 // 	
 // 	vec3.transformQuat(childView.up, childView.up, rotateView);
 // 	vec3.normalize(childView.up, childView.up);
 // 	
 // 	return childView;
 // }

 //  	
