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
 	var childView = this.createChildView();
 	var childPlaneView = new View(childView.eye, childView.center, childView.up);
 	
 	//the new plane's rotation
 	var childPlaneOrientation = (this.orientation +180) % 360;

 	var newChild = new PlaneView(childPlaneCenter, childPlaneOrientation,
 	 	childPlaneView, RTT.fbos.pop());
 	newChild.parentLine = this;
 	this.childPlane = newChild;

 	return newChild;
 }

 FoldingLine.prototype.createChildView = function(){
 	var parentView = this.parentPlane.view;
 	var childView = {
 		eye: vec3.clone(parentView.eye),
 	 	center: vec3.clone(parentView.center),
 	 	up: vec3.clone(parentView.up)
 	};

 	var lineOfSight = vec3.create();
 	vec3.subtract(lineOfSight, parentView.eye, parentView.center);
 	vec3.normalize(lineOfSight, lineOfSight); 
 	
 	var rotationAxis = vec3.create();
 	var createRA = quat.create();
 	quat.setAxisAngle(createRA, lineOfSight, degToRad(this.orientation+90-this.parentPlane.orientation));
 	vec3.transformQuat(rotationAxis, parentView.up, createRA);
 	var rotateView = quat.create();
 	quat.setAxisAngle(rotateView, rotationAxis, degToRad(-90));

 	//new eye
 	vec3.transformQuat(childView.eye, childView.eye, rotateView);
 	
 	//new up, first rotation
 	var turnView = quat.create();
 	quat.setAxisAngle(turnView, lineOfSight, degToRad(this.orientation+180-this.parentPlane.orientation));
 	vec3.transformQuat(childView.up, childView.up, turnView);
 	vec3.normalize(childView.up, childView.up);
 	
 	vec3.transformQuat(childView.up, childView.up, rotateView);
 	vec3.normalize(childView.up, childView.up);
 	
 	return childView;
 }

  	
