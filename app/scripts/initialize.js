define([
    'shaders',
    'classes/FrameBuffer'

], function(shaders, FrameBuffer) {
    'use strict';

    var initVariableLocations = function(gl, shaderProgram) {
        shaderProgram.positionLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.enableVertexAttribArray(shaderProgram.positionLocation);
        shaderProgram.textureLocation = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
        gl.enableVertexAttribArray(shaderProgram.textureLocation);
        shaderProgram.colorLocation = gl.getAttribLocation(shaderProgram, 'aVertexColor');
        gl.enableVertexAttribArray(shaderProgram.colorLocation);
        //uSampler indicates what TEXTURE# to use
        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler');
        shaderProgram.mvMatrixLocation = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        shaderProgram.pMatrixLocation = gl.getUniformLocation(shaderProgram, 'uPMatrix');
        shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, 'uUseTextures');
    };

    return {

        initGL: function(canvas) {
            var gl;
            try {
                gl = canvas.getContext('experimental-webgl');
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
            } catch (e) {}
            if (!gl) {
                alert('Could not initialise WebGL, sorry :-(');
            }
            return gl;
        },

        initShaders: function(gl) {
            var fragmentShader = shaders.getShader(gl, 'frag');
            var vertexShader = shaders.getShader(gl, 'vert');
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Could not initialise shaders');
            }
            gl.useProgram(shaderProgram);
            initVariableLocations(gl, shaderProgram);
        },

        initFBOs: function(gl, width, height) {
            var RTT = { fbos: [] };
            for (var i = 0; i < 6; i++) {
                RTT.fbos.push(new FrameBuffer(gl, width, height, i));
            }
            return RTT;
        }

    };
});
