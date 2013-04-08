function FrameBufferObject(width, height, activeTexture){
	this.width = width;
	this.height = height;

	this.activeTexture = activeTexture;

	this.initFrameBuffer();
	this.initTextureBuffer();
	this.initRenderBuffer();

	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

FrameBufferObject.prototype.initFrameBuffer = function(){
	this.framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
	this.framebuffer.width = this.width;
	this.framebuffer.height = this.height;
}

FrameBufferObject.prototype.initTextureBuffer = function(){
	this.texturebuffer = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texturebuffer);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texturebuffer, 0);
}

FrameBufferObject.prototype.initRenderBuffer = function(){
	this.renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);
}

FrameBufferObject.prototype.renderToBuffer = function(world){
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

	world.draw();

	gl.bindTexture(gl.TEXTURE_2D, this.texturebuffer);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

FrameBufferObject.prototype.setUpForDraw = function(){
	gl.uniform1i(shaderProgram.useTexturesUniform, true);
	gl.activeTexture(gl.TEXTURE0 + this.activeTexture);
	gl.bindTexture(gl.TEXTURE_2D, this.texturebuffer);
	gl.uniform1i(shaderProgram.samplerUniform, this.activeTexture);
}

