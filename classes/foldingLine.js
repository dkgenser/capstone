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
 	
 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexTextureCoordBuffer);
 	gl.vertexAttribPointer(shaderProgram.textureLocation, FLVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

 	setMatrixUniforms();
 	gl.uniform4f(shaderProgram.colorLocation, 0, 0, 0, 1);
 	gl.drawArrays(gl.LINE_STRIP, 0, FLVertexPositionBuffer.numItems);

 	mvPopMatrix();
 }

 FoldingLine.prototype.distToParent = function(){
 	return vec3.dist(this.center, this.parentPlane.center);
 }

 FoldingLine.prototype.createChild = function(){
 	if(this.child != null) return;

 	var transDist = this.parentPlane.transferDistance();

 	var newCenter = [this.center[0] + transDist * Math.cos(degToRad(this.orientation-90)),
 	 this.center[1] + transDist * Math.sin(degToRad(this.orientation-90)), 0];


 	//all fake numbers except the center
 	var newChild = new PlaneView(newCenter, 0, this.parentPlane.view, paper.fbIndices.pop());
 	this.childPlane = newChild;

 	return newChild;
 }