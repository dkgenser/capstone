define(function() {
    'use strict';


    var Prism = function( options ) {
        this.height = options.height;
        this.axis   = options.axis;
        this.base   = options.base;

        // bounding sphere
    };


    // BufferSet
    Prism.prototype._constructBuffers = function() {
        var buffers = {};
        return buffers;
    };

    // TODO: intersects


    return Prism;
});
