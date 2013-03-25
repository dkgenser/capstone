
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
  shaderProgram.positionLocation=gl.getAttribLocation(shaderProgram,"aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.positionLocation);

  shaderProgram.textureLocation=gl.getAttribLocation(shaderProgram,"aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureLocation);

  shaderProgram.colorLocation=gl.getUniformLocation(shaderProgram, "uVertexColor");

  //uSampler indicates what TEXTURE# to use
  shaderProgram.samplerUniform=gl.getUniformLocation(shaderProgram, "uSampler");

  shaderProgram.mvMatrixLocation=gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixLocation=gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.useTexturesUniform=gl.getUniformLocation(shaderProgram, "uUseTextures");
} 

function initShaders() {
  var fragmentShader = getShader('frag');
  var vertexShader = getShader('vert');

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

function initWorldModel(){
  F.vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,F.vertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0,0,0,    30,0,0,   0,150,0,
      0,150,0,  30,0,0,   30,150,0,
      30,0,0,   100,0,0,  30,30,0,
      30,30,0,  100,0,0,  100,30,0,
      30,60,0,  67,60,0,  30,90,0,
      30,90,0,  67,60,0,  67,90,0,
      0,0,30,   30,0,30,  0,150,30,
      0,150,30, 30,0,30,  30,150,30,
      30,0,30,  100,0,30, 30,30,30,
      30,30,30, 100,0,30,100,30,30,30,60,30,67,60,30,30,90,30,30,90,30,67,60,30,67,90,30,0,0,0,100,0,0,100,0,30,0,0,0,100,0,30,0,0,30,100,0,0,100,30,0,100,30,30,100,0,0,100,30,30,100,0,30,30,30,0,30,30,30,100,30,30,30,30,0,100,30,30,100,30,0,30,30,0,30,30,30,30,60,30,30,30,0,30,60,30,30,60,0,30,60,0,30,60,30,67,60,30,30,60,0,67,60,30,67,60,0,67,60,0,67,60,30,67,90,30,67,60,0,67,90,30,67,90,0,30,90,0,30,90,30,67,90,30,30,90,0,67,90,30,67,90,0,30,90,0,30,90,30,30,150,30,30,90,0,30,150,30,30,150,0,0,150,0,0,150,30,30,150,30,0,150,0,30,150,30,30,150,0,0,0,0,0,0,30,0,150,30,0,0,0,0,150,30,0,150,0]),
    gl.STATIC_DRAW);
  F.vertexPositionBuffer.itemSize = 3;
  F.vertexPositionBuffer.numItems = 96;

  F.vertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, F.vertexTextureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(192),
    gl.STATIC_DRAW);
  F.vertexTextureCoordBuffer.itemSize = 2;
  F.vertexTextureCoordBuffer.numItems = 96;

  S.vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, S.vertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      
      // Front face
      -50.0, -50.0,  50.0,
      50.0, -50.0,  50.0,
      50.0,  50.0,  50.0,
      -50.0,  50.0,  50.0,

      // Back face
      -50.0, -50.0, -50.0,
      -50.0,  50.0, -50.0,
      50.0,  50.0, -50.0,
      50.0, -50.0, -50.0,

      // Top face
      -50.0,  50.0, -50.0,
      -50.0,  50.0,  50.0,
      50.0,  50.0,  50.0,
      50.0,  50.0, -50.0,

      // Bottom face
      -50.0, -50.0, -50.0,
      50.0, -50.0, -50.0,
      50.0, -50.0,  50.0,
      -50.0, -50.0,  50.0,

      // Right face
      50.0, -50.0, -50.0,
      50.0,  50.0, -50.0,
      50.0,  50.0,  50.0,
      50.0, -50.0,  50.0,

      // Left face
      -50.0, -50.0, -50.0,
      -50.0, -50.0,  50.0,
      -50.0,  50.0,  50.0,
      -50.0,  50.0, -50.0,
      ]),
    gl.STATIC_DRAW);
  S.vertexPositionBuffer.itemSize = 3;
  S.vertexPositionBuffer.numItems = 24;

  S.vertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, S.vertexTextureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(48),
    gl.STATIC_DRAW);
  S.vertexTextureCoordBuffer.itemSize = 2;
  S.vertexTextureCoordBuffer.numItems = 24;

  S.vertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, S.vertexIndexBuffer);
  var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
  ]
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  S.vertexIndexBuffer.itemSize = 1;
  S.vertexIndexBuffer.numItems = 36;

  PlaneVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      //TL corner
      -planeWidth/2, planeWidth/2, 0,
      //TR corner
      planeWidth/2, planeWidth/2, 0,
      //BL corner
      -planeWidth/2, -planeWidth/2, 0,
      //BR corner
      planeWidth/2, -planeWidth/2, 0,
      ]), 
    gl.STATIC_DRAW);
  PlaneVertexPositionBuffer.itemSize = 3;
  PlaneVertexPositionBuffer.numItems = 4;

  PlaneVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, PlaneVertexTextureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      1.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      0.0, 0.0,]), 
    gl.STATIC_DRAW);
  PlaneVertexTextureCoordBuffer.itemSize = 2;
  PlaneVertexTextureCoordBuffer.numItems = 4;
}

function initTextureFramebuffer() {
    //rtt = render to texture
    RTT.framebuffer = new Array();
    RTT.texture = new Array();

    for (var i = 0; i < 2; i++) {
      RTT.framebuffer[i] = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer[i]);
      RTT.framebuffer[i].width = framebufferWidth;
      RTT.framebuffer[i].height = framebufferHeight;

      createRenderTexture(i);
    };
    /*var renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, RTT.framebuffer.width, RTT.framebuffer.height);

    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);*/

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function createRenderTexture(index){
  RTT.texture[index] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, RTT.texture[index]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, RTT.framebuffer[index].width, RTT.framebuffer[index].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, RTT.texture[index], 0);
}
