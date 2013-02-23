var gl;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixLocation, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixLocation, false, mvMatrix);
}

var FVertexPositionBuffer;

var boundingSphereRadius = 100;
var eye = [0, 0, -boundingSphereRadius];
var center = [0, 0, 0];
var up = [0, 1, 0];

function drawScene(){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.ortho(pMatrix, -gl.viewportWidth/2, gl.viewportWidth/2, 
    -gl.viewportHeight/2, gl.viewportHeight/2, 
    0.1, 2*boundingSphereRadius);

  mat4.identity(mvMatrix);
  mat4.lookAt(mvMatrix, [0, 0, 100], [0, 0, 0], [0, 1, 0]);

  //Draw
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES,0,FVertexPositionBuffer.numItems);
}

function webGLStart(){
  var canvas=document.getElementById("webGLcanvas");
  initGL(canvas);
  initShaders();
  initScene();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}