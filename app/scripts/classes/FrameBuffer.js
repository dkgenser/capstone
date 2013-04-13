define([
], function() {
    'use strict';

    var FrameBuffer = function(gl, width, height, activeTexture) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.activeTexture = activeTexture;

        this._initFrameBuffer();
        this._initTextureBuffer();
        this._initRenderBuffer();

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };

    FrameBuffer.prototype._initFrameBuffer = function() {
        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.framebuffer.width = this.width;
        this.framebuffer.height = this.height;
    };

    FrameBuffer.prototype._initTextureBuffer = function() {
        this.texturebuffer = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texturebuffer);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texturebuffer, 0);
    };

    FrameBuffer.prototype._initRenderBuffer = function() {
        this.renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.renderbuffer);
    };

    FrameBuffer.prototype.renderToBuffer = function(world) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        world.draw();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texturebuffer);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    };

    FrameBuffer.prototype.setUpForDraw = function(shaderProgram) {
        this.gl.uniform1i(shaderProgram.useTexturesUniform, true);
        this.gl.activeTexture(this.gl.TEXTURE0 + this.activeTexture);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texturebuffer);
        this.gl.uniform1i(shaderProgram.samplerUniform, this.activeTexture);
    };

    return FrameBuffer;

});
