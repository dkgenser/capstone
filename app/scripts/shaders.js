define([
], function() {
    'use strict';

    var scripts = {
        frag: {
            type: 'x-shader/x-fragment',
            source: [
                'precision mediump float;',
                '',
                'uniform vec4 uVertexColor;',
                '',
                'uniform bool uUseTextures;',
                'varying vec2 vTextureCoord;',
                '',
                'uniform sampler2D uSampler;',
                '',
                'void main(void) {',
                '  vec4 vertexColor = uVertexColor;',
                '  if(uUseTextures) {',
                '    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
                '    vertexColor = textureColor;',
                '  }',
                '',
                '  gl_FragColor = vertexColor;',
                '}'
            ].join( '\n' )
        },
        vert: {
            type: 'x-shader/x-vertex',
            source: [
                'attribute vec3 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                '',
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                '',
                'varying vec2 vTextureCoord;',
                'varying vec4 vVertexColor;',
                '',
                'void main(void) {',
                '  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
                '  vTextureCoord = aTextureCoord;',
                '}'
            ].join( '\n' )
        }
    };

    return {
        get: function( gl, name ) {
            if ( !scripts[ name ] ) {
                return null;
            }

            var shader;
            if ( scripts[ name ].type === 'x-shader/x-fragment' ) {
                shader = gl.createShader( gl.FRAGMENT_SHADER );
            } else if ( scripts[ name ].type === 'x-shader/x-vertex' ) {
                shader = gl.createShader( gl.VERTEX_SHADER );
            } else {
                return null;
            }

            gl.shaderSource( shader, scripts[ name ].source );
            gl.compileShader( shader );

            if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
                alert( 'An error occured compiling the shaders: ' +
                       gl.getShaderInfoLog( shader ) );
            }

            return shader;
        }
    };
});
