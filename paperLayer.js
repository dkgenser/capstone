var gl;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

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

var topView = new View([0, boundingSphereRadius, 0], [0, 0, 0], [0, 0, -1]);
var frontView = new View([0, 0, boundingSphereRadius], [0, 0, 0], [0, 1, 0]);
var rightView = new View([boundingSphereRadius, 0, 0], [0, 0, 0], [0, 1, 0]);

var topPlane = new PlaneView([0, (planeWidth + margin)/2, 0], 0, topView, 0);
var frontPlane = new PlaneView([0, -(planeWidth + margin)/2, 0], 0, frontView, 1);

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
  topPlane.renderToTexture();
  frontPlane.renderToTexture();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //Draw plane layer
	setPlaneMatrices();
  topPlane.draw();
  frontPlane.draw();
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