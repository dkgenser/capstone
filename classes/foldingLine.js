 function FoldingLine(center, parent, child){
 	this.parentPlane = parent;
 	this.childPlane = child;

 	this.setCenter(center);
 }

 FoldingLine.prototype.setCenter = function(center){
 	this.center = center;

 	var planeCenter = {
 		x: this.parentPlane.center[0],
 		y: this.parentPlane.center[1]
 	};

 	var angle = Math.atan2(center[1] - planeCenter.y, center[0] - planeCenter.x);
 	angle = (angle * 180 / Math.PI) % 360;

 	this.orientation = angle+90;
 }

 FoldingLine.prototype.draw = function(){
 	mvPushMatrix();
 	mat4.translate(mvMatrix, mvMatrix, this.center);
 	mat4.rotateZ(mvMatrix, mvMatrix, degToRad(this.orientation));

 	gl.uniform1i(shaderProgram.useTexturesUniform, false);

 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexPositionBuffer);
 	gl.vertexAttribPointer(shaderProgram.positionLocation, FLVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexColorBuffer);
 	gl.vertexAttribPointer(shaderProgram.colorLocation, FLVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexTextureCoordBuffer);
 	gl.vertexAttribPointer(shaderProgram.textureLocation, FLVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

 	setMatrixUniforms();
 	gl.drawArrays(gl.LINE_STRIP, 0, FLVertexPositionBuffer.numItems);

 	mvPopMatrix();
 }

 FoldingLine.prototype.distToParent = function(){
 	return vec3.dist(this.center, this.parentPlane.center);
 }

 FoldingLine.prototype.createChild = function(){
 	if(this.child != null) return this.child;

 	//center of the new plane
 	var transDist = this.parentPlane.transferDistance();
 	var childPlaneCenter = [this.center[0] + transDist * Math.cos(degToRad(this.orientation-90)),
 	 this.center[1] + transDist * Math.sin(degToRad(this.orientation-90)), 0];

 	//the view (camera)
 	var childPlaneView = this.createChildView();

 	//the new plane's rotation
 	var childPlaneOrientation = 0;//this.orientation - 90

 	//all fake numbers except the center (and maybe orientation)
 	var newChild = new PlaneView(childPlaneCenter, childPlaneOrientation,
 	 	childPlaneView, paper.fbIndices.pop());
 	newChild.parentLine = this;
 	this.childPlane = newChild;

 	return newChild;
 }

 FoldingLine.prototype.createChildView = function(){
 	var parentView = this.parentPlane.view;
 	//return parentView;
 	var newView = { eye: vec3.create(), center: vec3.create(), up: vec3.create() };

 	// var rotationAxis = foldingline at center = [0, 1, 0] rotated by this.orientation
 	var rotationAxis = [parentView.center[0] + Math.cos(degToRad(this.orientation)),
 		parentView.center[0] + Math.sin(degToRad(this.orientation)), 0];
 	var viewRotate = quat.create();
 	quat.setAxisAngle(viewRotate, rotationAxis, degToRad(90)); //TODO: might be -90?

 	// newUp = (parentView.up rotated [this.orientation - 90 - this.parentPlane.orientation] around [parentView.eye - parentView.center])
 	var upAxis = parentView.eye - parentView.center;
 	var upDegree = this.orientation - 90 - this.parentPlane.orientation;
 	var upRotate = quat.create();
 	quat.setAxisAngle(upRotate, upAxis, degToRad(upDegree));

 	//vec3.transformQuat(newView.up, parentView.up, upRotate);
 	// newUp = newUp rotated 90 degrees around rotationAxis
 	//vec3.transformQuat(newView.up, newView.up, viewRotate);
 	newView.up = parentView.up;
 	
 	// newEye = parentView.eye rotated 90 degrees around rotationAxis
 	vec3.transformQuat(newView.eye, parentView.eye, viewRotate);
 	//newView.eye = parentView.eye;

 	// newCenter = parentView.center;
 	newView.center = parentView.center;

 	return new View(newView.eye, newView.center, newView.up);
 }

  	
