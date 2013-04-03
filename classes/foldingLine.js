 function FoldingLine(orientation, parent, child){
 	this.parentPlane = parent;
 	this.childPlane = child;

 	this.setOrientation(orientation);
 }

 FoldingLine.prototype.setOrientation = function(angle){
 	this._orientation = angle;
 	var planeCenter = {
 		x: this.parentPlane.center[0],
 		y: this.parentPlane.center[1]
 	};

 	this._center = [planeCenter.x + planeWidth/2 * Math.cos(degToRad(angle-90)),
 	 planeCenter.y + planeWidth/2 * Math.sin(degToRad(angle-90)), 0];
 }

 FoldingLine.prototype.draw = function(){
 	mvPushMatrix();
 	mat4.translate(mvMatrix, mvMatrix, this._center);
 	mat4.rotateZ(mvMatrix, mvMatrix, degToRad(this._orientation));

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
 	return vec3.dist(this._center, this.parentPlane.center);
 }

 FoldingLine.prototype.createChild = function(){
 	if(this.child != null) return;

 	var transDist = this.parentPlane.transferDistance();

 	var planeCenter = {
 		x: this.parentPlane.center[0],
 		y: this.parentPlane.center[1]
 	};

 	var newCenter = [this._center[0] + transDist * Math.cos(degToRad(this._orientation-90)),
 	 this._center[1] + transDist * Math.sin(degToRad(this._orientation-90)), 0];


 	//all fake numbers except the center
 	var newChild = new PlaneView(newCenter, 0, this.parentPlane.view, this.parentPlane.index);
 	this.childPlane = newChild;

 	return newChild;
 }