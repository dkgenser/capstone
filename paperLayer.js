var gl;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var F = {};
var S = {};

var planeWidth = 250;
var margin = 5;
var PlaneVertexPositionBuffer;
var PlaneVertexTextureCoordBuffer;

//Render To Texture
var RTT = {};
var framebufferWidth = 512;
var framebufferHeight = 512;

var boundingSphereRadius = 100;
var eye;
var center;
var up;

function drawFrontView(){
  eye = [0, 0, boundingSphereRadius];
  center = [0, 0, 0];
  up = [0, 1, 0];
  setViewMatrices(eye, center, up);
  drawModelWorld();
}

function drawTopView(){
  eye = [0, boundingSphereRadius, 0];
  center = [0, 0, 0];
  up = [0, 0, -1];
  setViewMatrices(eye, center, up);
  drawModelWorld();
}

function drawRightView(){
  eye = [boundingSphereRadius, 0, 0];
  center = [0, 0, 0];
  up = [0, 1, 0];
  setViewMatrices(eye, center, up);
  drawModelWorld();
}

function drawModelWorld(){
  gl.uniform1i(shaderProgram.useTexturesUniform, false);
  //Draw F
  gl.bindBuffer(gl.ARRAY_BUFFER, F.vertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureLocation, F.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, F.vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionLocation,F.vertexPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  
  gl.uniform4f(shaderProgram.colorLocation, 0, 1, 0, 1);
  gl.drawArrays(gl.TRIANGLES, 0, F.vertexPositionBuffer.numItems);

  //Draw box
  gl.bindBuffer(gl.ARRAY_BUFFER, S.vertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureLocation, S.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, S.vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionLocation,S.vertexPositionBuffer.itemSize,gl.FLOAT,false,0,0);
  
  gl.uniform4f(shaderProgram.colorLocation, 0, 1, 1, 1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, S.vertexIndexBuffer);
  gl.drawElements(gl.TRIANGLES, S.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
}

function setViewMatrices(eye, center, up){
  gl.viewport(0, 0, framebufferWidth, framebufferHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //TODO: also, only calculated once? set and save pMatrix
  mat4.ortho(pMatrix, -framebufferWidth/2, framebufferHeight/2, 
    -framebufferWidth/2, framebufferHeight/2, 
    0.1, 2*boundingSphereRadius);
  //mat4.perspective(pMatrix, 45, framebufferWidth / framebufferHeight, 0.1, 100.0);

  mat4.identity(mvMatrix);
  mat4.lookAt(mvMatrix, eye, center, up);

  setMatrixUniforms();
}

function bindViewtoTexture(texture){
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function setPlaneMatrices(){
  eye = [0, 0, boundingSphereRadius];
  center = [0, 0, 0];
  up = [0, 1, 0];

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
  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  //Render views to Framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer[0]);
  drawTopView();
  bindViewtoTexture(RTT.texture[0]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer[1]);
  drawFrontView();
  bindViewtoTexture(RTT.texture[1]);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Draw plane layer
	setPlaneMatrices();

  mat4.translate(mvMatrix, mvMatrix, [0, (planeWidth + margin)/2, 0]);
  drawPlane(0);

  mat4.translate(mvMatrix, mvMatrix, [0, -(planeWidth + margin), 0]);
  drawPlane(1);
}

function drawPlane(index){
  gl.uniform1i(shaderProgram.useTexturesUniform, true);

  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionLocation, PlaneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureLocation, PlaneVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  gl.activeTexture(gl.TEXTURE0+index);
  gl.bindTexture(gl.TEXTURE_2D, RTT.texture[index]);
  gl.uniform1i(shaderProgram.samplerUniform, index);

  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, PlaneVertexPositionBuffer.numItems);
}

function tick(){
  requestAnimFrame(tick);

  drawScene();
}

function webGLStart(){
  var canvas=document.getElementById("webGLcanvas");
  initGL(canvas);
  initShaders();
  initTextureFramebuffer();
  initWorldModel();
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  tick();
}