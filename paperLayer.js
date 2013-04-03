/*var global = {
  world: ModelWorld,
  field: "stringField",

  mvMatrix: mat4.create(),
  pMatrix: mat4.create(),

  functionName: function () {

  }
}*/

var gl;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

//Plane variables
var planeWidth = 250;
var margin = 5;
var PlaneVertexPositionBuffer;
var PlaneVertexTextureCoordBuffer;

//Folding lines
var FLVertexPositionBuffer;
var FLVertexTextureCoordBuffer;

//Render To Texture
var RTT = {};
var framebufferWidth = 512;
var framebufferHeight = 512;

//ModelWorld information
var boundingSphereRadius = 100;


function setPlaneMatrices(){
  var eye = [0, 0, boundingSphereRadius];
  var center = [0, 0, 0];
  var up = [0, 1, 0];

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
  paper.renderToTextures();

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
	setPlaneMatrices();
  paper.drawToScreen();
}

function tick(){
  requestAnimFrame(tick);
  drawScene();
}

var canvas;
function createCanvas(){
  canvas = document.createElement('canvas');
  var div = document.getElementById('canvasDiv');

  canvas.width = div.clientWidth;
  canvas.height = div.clientHeight;
  div.appendChild(canvas);

  initGL(canvas);
  initInteraction();
}

function webGLStart() {
  createCanvas();
  initShaders();
  initTextureFramebuffer();
  
  modelWorld.init();
  paper.init();
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  tick();
}