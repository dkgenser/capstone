 function PlaneView (center, orientation, View, index){
 	this.center = center;
 	this.orientation = orientation;

 	//TODO: create & use framebuffer object instead
 	this.framebufferIndex = index; 
 	this.view = View;
 }

 PlaneView.prototype.renderToTexture = function() {
 	gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer[this.framebufferIndex]);

 	this.view.draw();

 	gl.bindTexture(gl.TEXTURE_2D, RTT.texture[this.framebufferIndex]);
 	gl.generateMipmap(gl.TEXTURE_2D);
 	gl.bindTexture(gl.TEXTURE_2D, null);

 	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
 }

 PlaneView.prototype.draw = function() {
 	mvPushMatrix();
 	mat4.translate(mvMatrix, mvMatrix, this.center);
 	mat4.rotateZ(mvMatrix, mvMatrix, degToRad(this.orientation));

 	gl.uniform1i(shaderProgram.useTexturesUniform, true);

 	gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
 	gl.vertexAttribPointer(shaderProgram.positionLocation, PlaneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
 	gl.vertexAttribPointer(shaderProgram.textureLocation, PlaneVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
 	
 	gl.activeTexture(gl.TEXTURE0 + this.framebufferIndex);
 	gl.bindTexture(gl.TEXTURE_2D, RTT.texture[this.framebufferIndex]);
 	gl.uniform1i(shaderProgram.samplerUniform, this.framebufferIndex);

 	setMatrixUniforms();
 	gl.drawArrays(gl.TRIANGLE_STRIP, 0, PlaneVertexPositionBuffer.numItems);

 	mvPopMatrix();
 }
