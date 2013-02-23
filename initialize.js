
function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function initVariableLocations() {
  shaderProgram.positionLocation=gl.getAttribLocation(shaderProgram,"a_position");
  gl.enableVertexAttribArray(shaderProgram.positionLocation);

  shaderProgram.colorLocation=gl.getUniformLocation(shaderProgram, "u_color");
  gl.uniform4f(shaderProgram.colorLocation, 0, 1, 0, 1);

  shaderProgram.mvMatrixLocation=gl.getUniformLocation(shaderProgram, "u_MVMatrix");
  shaderProgram.pMatrixLocation=gl.getUniformLocation(shaderProgram, "u_PMatrix");
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  initVariableLocations();
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixLocation, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixLocation, false, mvMatrix);
}

var FVertexPositionBuffer;

function initScene(){
  FVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,FVertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    /*new Float32Array([
          // left column
          0,   0,  0,
          30,   0,  0,
          0, 150,  0,
          0, 150,  0,
          30,   0,  0,
          30, 150,  0,

          // top rung
          30,   0,  0,
          100,   0,  0,
          30,  30,  0,
          30,  30,  0,
          100,   0,  0,
          100,  30,  0,

          // middle rung
          30,  60,  0,
          67,  60,  0,
          30,  90,  0,
          30,  90,  0,
          67,  60,  0,
          67,  90,  0]), 2D = 18 items*/
    new Float32Array([0,0,0,30,0,0,0,150,0,0,150,0,30,0,0,30,150,0,30,0,0,100,0,0,30,30,0,30,30,0,100,0,0,100,30,0,30,60,0,67,60,0,30,90,0,30,90,0,67,60,0,67,90,0,0,0,30,30,0,30,0,150,30,0,150,30,30,0,30,30,150,30,30,0,30,100,0,30,30,30,30,30,30,30,100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,30,30,30,60,30,30,30,0,30,60,30,30,60,0,30,60,0,30,60,30,67,60,30,30,60,0,67,60,30,67,60,0,67,60,0,67,60,30,67,90,30,67,60,0,67,90,30,67,90,0,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,90,30,30,150,30,30,90,0,30,150,30,30,150,0,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0]),
    gl.STATIC_DRAW);
  FVertexPositionBuffer.itemSize = 3;
  FVertexPositionBuffer.numItems = 96;

  gl.vertexAttribPointer(shaderProgram.positionLocation,FVertexPositionBuffer.itemSize,gl.FLOAT,false,0,0);
}