define([
], function() {
    'use strict';

    // var mvMatrixStack = [];

    return {
        setMatrixUniforms: function(gl, pMatrix, mvMatrix) {
            gl.uniformMatrix4fv(pMatrix.location, false, pMatrix.matrix);
            gl.uniformMatrix4fv(mvMatrix.location, false, mvMatrix.matrix);
            // gl.uniformMatrix4fv(shaderProgram.pMatrixLocation, false, pMatrix);
            // gl.uniformMatrix4fv(shaderProgram.mvMatrixLocation, false, mvMatrix);
        }

        // mvPushMatrix: function() {
        //     var copy = mat4.clone(mvMatrix);
        //     mvMatrixStack.push(copy);
        // },

        // mvPopMatrix: function(){
        //     if (mvMatrixStack.length == 0) {
        //         throw "Invalid popMatrix!";
        //     }
        //     mvMatrix = mvMatrixStack.pop();
        // }
    };
});
