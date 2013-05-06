define([
    'Buffer'
], function( Buffer ) {
    'use strict';

    var BufferSet = function( options, buffers ) {
        this.gl = options.gl;
        for ( var name in buffers ) {
            if ( buffers.hasOwnProperty( name ) ) {
                if ( name == 'colors' ) {
                    this[ name ] = buffers[ name ];
                    continue;
                }
                
                this[ name ] = new Buffer({
                    gl: this.gl,
                    name: name,
                    data: buffers[ name ]
                });
            }
        }
    };

    BufferSet.prototype.assignVertexAttributes = function( program ) {
        var assignBuffer = function( buffer, index ) {
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, buffer.buffer );
            this.gl.vertexAttribPointer(
                index,                          // GLuint indx
                buffer.itemSize,                // GLint size
                this.gl.FLOAT,                  // GLenum type
                false,                          // GLboolean normalized
                0,                              // GLsizei stride
                0                               // GLintpr offset
            );
        }.bind( this );
        assignBuffer( this.textureCoords, program.textureLocation );
        assignBuffer( this.positions, program.positionLocation );
        //assignBuffer( this.colors, program.colorLocation );
        this.gl.uniform4f( program.colorLocation, 
            this.colors[0], 
            this.colors[1], 
            this.colors[2], 
            this.colors[3] 
        );
    };

    return BufferSet;
});
