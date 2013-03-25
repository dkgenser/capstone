
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
  modelWorld.init();

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
      //TL corner
      0.0, 1.0,
      //TR corner
      1.0, 1.0,
      //BL corner
      0.0, 0.0,
      //BR corner
      1.0, 0.0,]), 
    gl.STATIC_DRAW);
  PlaneVertexTextureCoordBuffer.itemSize = 2;
  PlaneVertexTextureCoordBuffer.numItems = 4;

  FLVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexPositionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([
      //left
      -(planeWidth*0.75), 0, 0,
      //right
      (planeWidth*0.75), 0, 0,
      ]), 
    gl.STATIC_DRAW);
  FLVertexPositionBuffer.itemSize = 3;
  FLVertexPositionBuffer.numItems = 2;

  FLVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, FLVertexTextureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array(4), 
    gl.STATIC_DRAW);
  FLVertexTextureCoordBuffer.itemSize = 2;
  FLVertexTextureCoordBuffer.numItems = 2;
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
