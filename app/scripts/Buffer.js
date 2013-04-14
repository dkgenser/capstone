define([
], function() {
    'use strict';

    var ITEM_SIZES = {
        positions: 3,
        colors: 4,
        textureCoords: 2,
        indices: 1
    };

    var Buffer = function( options ) {
        this.gl = options.gl;
        this.name = options.name;
        this.data = options.data;
        this.itemSize = options.itemSize || ITEM_SIZES[ this.name ];
        this.numItems = this.data.length / this.itemSize;
        this.target = options.target || this._getDefaultTarget();
        this.buffer = this._createGlBuffer();
    };

    Buffer.prototype._getDefaultTarget = function() {
        if ( this.name === 'indices' ) {
            return this.gl.ELEMENT_ARRAY_BUFFER;
        } else {
            return this.gl.ARRAY_BUFFER;
        }
    };

    Buffer.prototype._createGlBuffer = function() {
        var buffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.target, buffer );
        this.gl.bufferData( this.target, this.data, this.gl.STATIC_DRAW );
        return buffer;
    };

    return Buffer;
});
