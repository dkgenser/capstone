 function FoldingLine(distance, angle){
 	this.distance = distance;
 	this.angle = angle;
 }

 FoldingLine.prototype.draw = function(){
 	mvPushMatrix();
 	//mat4.translate(mvMatrix, mvMatrix, this.distance);
 	//mat4.rotateZ(mvMatrix, mvMatrix, degToRad(this.angle));

 	gl.uniform1i(shaderProgram.useTexturesUniform, false);

 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexPositionBuffer);
 	gl.vertexAttribPointer(shaderProgram.positionLocation, FLVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexTextureCoordBuffer);
 	gl.vertexAttribPointer(shaderProgram.textureLocation, FLVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

 	setMatrixUniforms();
 	gl.uniform4f(shaderProgram.colorLocation, 1, 1, 1, 1);
 	gl.drawArrays(gl.LINE_STRIP, 0, FLVertexPositionBuffer.numItems);

 	mvPopMatrix();
 }