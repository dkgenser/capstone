 function PlaneView (center, orientation, View, FBO){
 	this.center = center;
 	this.orientation = orientation;

 	this.frameBufferObject = FBO; 
 	this.view = View;

 	//Tree information
 	this.parentLine = null;
 	this.children = new Array();
 }

 PlaneView.prototype.transferDistance = function(){
 	if(this.parentLine == null) return (planeWidth + margin)/2;

 	return this.parentLine.distToParent();
 }

 PlaneView.prototype.renderToTexture = function() {
 	this.frameBufferObject.renderToBuffer(this.view);
 }

 PlaneView.prototype.draw = function() {
 	mvPushMatrix();
 	mat4.translate(mvMatrix, mvMatrix, this.center);
 	mat4.rotateZ(mvMatrix, mvMatrix, degToRad(this.orientation));

 	gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
 	gl.vertexAttribPointer(shaderProgram.positionLocation, PlaneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

 	gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexColorBuffer);
 	gl.vertexAttribPointer(shaderProgram.colorLocation, PlaneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
 	gl.vertexAttribPointer(shaderProgram.textureLocation, PlaneVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	this.frameBufferObject.setUpForDraw();

 	setMatrixUniforms();
 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, PlaneVertexPositionBuffer.numItems);

 	mvPopMatrix();
 }
