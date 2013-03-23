var gl;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixLocation, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixLocation, false, mvMatrix);
};

var F = {};

var PlaneVertexPositionBuffer;
var PlaneVertexTextureCoordBuffer;

//Render To Texture
var RTT = {};
var framebufferWidth = 512;
var framebufferHeight = 512;

var boundingSphereRadius = 100;
var eye = [0, 0, -boundingSphereRadius];
var center = [0, 0, 0];
var up = [0, 1, 0];

function drawView(){
  setViewMatrices(eye, center, up);
  drawModelWorld();
}

function drawModelWorld(){
  gl.uniform1i(shaderProgram.useTexturesUniform, false);
  gl.bindBuffer(gl.ARRAY_BUFFER, F.vertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureLocation, F.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, F.vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionLocation,F.vertexPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  
  gl.uniform4f(shaderProgram.colorLocation, 0, 1, 0, 1);
  gl.drawArrays(gl.TRIANGLES, 0, F.vertexPositionBuffer.numItems);
}

function setViewMatrices(eye, center, up){
  gl.viewport(0, 0, framebufferWidth, framebufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //TODO: also, only calculated once? set and save pMatrix
  mat4.ortho(pMatrix, -framebufferWidth/2, framebufferHeight/2, 
    -framebufferWidth/2, framebufferHeight/2, 
    0.1, 2*boundingSphereRadius);

  mat4.identity(mvMatrix);
  mat4.lookAt(mvMatrix, eye, center, up);

  setMatrixUniforms();
}

function bindViewtoTexture(){
  gl.bindTexture(gl.TEXTURE_2D, RTT.texture);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function setPlaneMatrices(){
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //TODO: This should really only be calculated once?
  mat4.ortho(pMatrix, -gl.viewportWidth/2, gl.viewportWidth/2, 
    -gl.viewportHeight/2, gl.viewportHeight/2, 
    0.1, 2*boundingSphereRadius);

  mat4.identity(mvMatrix);
  mat4.lookAt(mvMatrix, eye, center, up);

  setMatrixUniforms();
}

function drawScene(){
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  //Render to Framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer);
  drawView();
  bindViewtoTexture();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Draw plane layer
	setPlaneMatrices(eye, center, up);

  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionLocation, PlaneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureLocation, PlaneVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.uniform1i(shaderProgram.useTexturesUniform, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, RTT.texture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  gl.uniform4f(shaderProgram.colorLocation, 0, 1, 0, 1);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, PlaneVertexPositionBuffer.numItems);
  
}

function webGLStart(){
  var canvas=document.getElementById("webGLcanvas");
  initGL(canvas);
  initShaders();
  initTextureFramebuffer();
  initWorldModel();
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}