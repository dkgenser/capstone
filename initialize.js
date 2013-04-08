
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

  shaderProgram.colorLocation=gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.colorLocation);

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

function initTextureFramebuffer() {
    //rtt = render to texture
    RTT.framebuffer = new Array();
    RTT.texture = new Array();
    RTT.renderbuffer = new Array();

    for (var i = 0; i < 6; i++) {
      paper.fbIndices.push(i);
      RTT.framebuffer[i] = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, RTT.framebuffer[i]);
      RTT.framebuffer[i].width = framebufferWidth;
      RTT.framebuffer[i].height = framebufferHeight;

      createRenderTexture(i);
    };

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

  RTT.renderbuffer[index] = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, RTT.renderbuffer[index]);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, RTT.framebuffer[index].width, RTT.framebuffer[index].height);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, RTT.texture[index], 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, RTT.renderbuffer[index]);
}
