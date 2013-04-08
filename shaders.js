// Global shader list
var shaderScripts = {};

shaderScripts['frag'] = {
  type: 'x-shader/x-fragment',
  source: [
    'precision mediump float;',
    '',
    'varying vec4 vVertexColor;',
    '',
    'uniform bool uUseTextures;',
    'varying vec2 vTextureCoord;',
    '',
    'uniform sampler2D uSampler;',
    '',
    'void main(void) {',
    '  vec4 vertexColor = vVertexColor;',
    '  if(uUseTextures) {',
    '    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
    '    vertexColor = textureColor;',
    '  }',
    '',
    '  gl_FragColor = vertexColor;',
    '}'
  ].join('\n')
};

shaderScripts['vert'] = {
  type: 'x-shader/x-vertex',
  source: [
    'attribute vec3 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec4 aVertexColor;',
    '',
    'uniform mat4 uMVMatrix;',
    'uniform mat4 uPMatrix;',
    '',
    'varying vec2 vTextureCoord;',
    'varying vec4 vVertexColor;',
    '',
    'void main(void) {',
    '  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);',
    '  vTextureCoord = aTextureCoord;',
    '  vVertexColor = aVertexColor;',
    '}'
  ].join('\n')
};

function getShader(name) {
  if (!shaderScripts[name]) return null;

  var shader;
  if(shaderScripts[name].type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScripts[name].type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderScripts[name].source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occured compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
}