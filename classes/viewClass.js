function View (eye, center, up){
	this.eye = eye;
	this.center = center;
	this.up = up;

	//width, height
}

View.prototype.draw = function(){
	gl.viewport(0, 0, framebufferWidth, framebufferHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//TODO: also, only calculated once? set and save pMatrix
	mat4.ortho(pMatrix, -framebufferWidth/2, framebufferHeight/2, 
	  -framebufferWidth/2, framebufferHeight/2, 
	  0.1, 2*boundingSphereRadius);

	mat4.identity(mvMatrix);
	mat4.lookAt(mvMatrix, this.eye, this.center, this.up);

	setMatrixUniforms();

	modelWorld.draw();
}