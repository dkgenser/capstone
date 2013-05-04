define(function( require ) {
    'use strict';

    var Framebuffer = function( options ) {
        this.world         = options.world;
        // TODO: prone to errors to copy gl property: either reference
        // this.world.gl directly, or set up a getter/setter to make sure
        // this.gl changes when this.world changes.
        this.gl            = this.world.gl;
        this.width         = options.width;
        this.height        = options.height;
        this.textureNumber = options.textureNumber;

        this.framebuffer  = this._initializeFramebuffer();
        this.texture      = this._initializeTexture();
        this.renderbuffer = this._initializeRenderbuffer();

        this.gl.bindTexture( this.gl.TEXTURE_2D, null );
        this.gl.bindRenderbuffer( this.gl.RENDERBUFFER, null );
        this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );
    };


    Framebuffer.prototype._initializeFramebuffer = function() {
        var framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,                // GLenum target
            framebuffer                         // WebGLFramebuffer fb
        );
        framebuffer.width = this.width;
        framebuffer.height = this.height;
        return framebuffer;
    };


    Framebuffer.prototype._initializeTexture = function() {
        var texture  = this.gl.createTexture();
        this.gl.bindTexture(
            this.gl.TEXTURE_2D,                 // GLenum target
            texture                             // WebGLTexture texture
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,                 // GLenum target
            this.gl.TEXTURE_MAG_FILTER,         // GLenum pname
            this.gl.LINEAR                      // GLint param
        );
        this.gl.texParameteri(
            this.gl.TEXTURE_2D,                 // GLenum target
            this.gl.TEXTURE_MIN_FILTER,         // GLenum pname
            this.gl.LINEAR_MIPMAP_NEAREST       // GLint param
        );
        this.gl.generateMipmap( this.gl.TEXTURE_2D );
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,                 // GLenum target
            0,                                  // GLint level
            this.gl.RGBA,                       // GLenum internalformat
            this.width,                         // GLsizei width
            this.height,                        // GLsizei height
            0,                                  // GLint border
            this.gl.RGBA,                       // GLenum format
            this.gl.UNSIGNED_BYTE,              // GLenum type
            null                                // ArrayBufferView pixels
        );
        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,                // GLenum target
            this.gl.COLOR_ATTACHMENT0,          // GLenum attachment
            this.gl.TEXTURE_2D,                 // GLenum textarget
            texture,                            // WebGLTexture texture
            0                                   // GLint level
        );
        return texture;
    };


    Framebuffer.prototype._initializeRenderbuffer = function() {
        var renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(
            this.gl.RENDERBUFFER,               // GLenum target
            renderbuffer                        // WebGLRenderbuffer rb
        );
        this.gl.renderbufferStorage(
            this.gl.RENDERBUFFER,               // GLenum target
            this.gl.DEPTH_COMPONENT16,          // GLenum internalformat
            this.width,                         // GLsizei width
            this.height                         // GLsizei height
        );
        this.gl.framebufferRenderbuffer(
            this.gl.FRAMEBUFFER,                // GLenum target
            this.gl.DEPTH_ATTACHMENT,           // GLenum attachment
            this.gl.RENDERBUFFER,               // GLenum renderbuffertarget
            renderbuffer                        // WebGLRenderbuffer rb
        );
        return renderbuffer;
    };


    Framebuffer.prototype.renderToBuffer = function( view ) {
        this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, this.framebuffer );
        this.world.drawView( view );
        this.gl.bindTexture( this.gl.TEXTURE_2D, this.texture );
        this.gl.generateMipmap( this.gl.TEXTURE_2D );
        this.gl.bindTexture( this.gl.TEXTURE_2D, null );
        this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );
    };


    Framebuffer.prototype.prepareToDraw = function( program ) {
        this.gl.uniform1i( program.useTexturesUniform, true );
        this.gl.activeTexture( this.gl.TEXTURE0 + this.textureNumber );
        this.gl.bindTexture( this.gl.TEXTURE_2D, this.texture );
        this.gl.uniform1i( program.samplerUniform, this.textureNumber );
    };


    return Framebuffer;

});
